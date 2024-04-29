
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { expect } from 'chai';

import { Authenticate } from './auth.action';
import { AuthState } from './auth.state';

describe('AuthState', () => {

  let store: Store;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({

      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([AuthState])
      ]

    }).compileComponents();

    store = TestBed.inject(Store);

  }));


  afterEach(() => {

    TestBed.resetTestingModule();

  });

  it('authenticate success', waitForAsync(inject(
    [HttpTestingController], (http: HttpTestingController) => {

      // when dispatch
      store.dispatch(new Authenticate('jean.dupond@gmail.com', 'D#az78&é'));

      // Then check http
      const postLogin = http.expectOne({ method: 'POST', url: '/ExempleAuthorization/login' });
      postLogin.flush({}, { headers: { 'x-auth-token': 'x token' } });
      const getAuthorize = http.expectOne((req: HttpRequest<void>) =>
        req.method === 'GET' &&
        req.url === '/ExempleAuthorization/oauth/authorize' &&
        req.params.get('response_type') === 'code' &&
        req.params.get('client_id') === 'test_service_user' &&
        req.params.get('scope') === 'account:read account:update login:head login:read login:create login:update' &&
        req.params.get('code_challenge_method') === 'S256');
      getAuthorize.flush({}, { headers: { location: 'code=code123' } });
      const postToken = http.expectOne({ method: 'POST', url: '/ExempleAuthorization/oauth/token' });
      postToken.flush({
        expires_in: 300
      });
      http.verify();

      // And check store
      expect(store.selectSnapshot(state => state.authenticate.authenticate)).is.be.true;
      expect(store.selectSnapshot(state => state.authenticate.username)).is.be.eq('jean.dupond@gmail.com');

    })));

  it('authenticate failure', waitForAsync(inject(
    [HttpTestingController], (http: HttpTestingController) => {

      // when dispatch
      store.dispatch(new Authenticate('jean.dupond@gmail.com', 'D#az78&é'));

      // Then check http
      const postLogin = http.expectOne({ method: 'POST', url: '/ExempleAuthorization/login' });
      postLogin.flush({}, { status: 401, statusText: 'unauthorized' });
      http.expectNone({ method: 'GET', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      http.verify();

      // And check store
      expect(store.selectSnapshot(state => state.authenticate.authenticate)).is.be.false;
      expect(store.selectSnapshot(state => state.authenticate.username)).is.be.undefined;

    })));

  it('authenticate exception', inject(
    [HttpTestingController], (http: HttpTestingController) => {

      // when dispatch
      store.dispatch(new Authenticate('jean.dupond@gmail.com', 'D#az78&é'));

      // Then check http
      const postLogin = http.expectOne({ method: 'POST', url: '/ExempleAuthorization/login' });
      postLogin.flush({}, { status: 500, statusText: 'internal error' });
      http.verify();

      // And check store
      expect(store.selectSnapshot(state => state.authenticate.authenticate)).is.be.false;
      expect(store.selectSnapshot(state => state.authenticate.username)).is.be.undefined;

    }));

});
