import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { expect } from 'chai';

import { AuthModule } from '../auth.module';
import { Authenticate } from './auth.action';
import { AuthState } from './auth.state';

describe('AuthState', () => {

  let store: Store;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({

      imports: [AuthModule, RouterTestingModule, HttpClientTestingModule,
        NgxsModule.forRoot([AuthState])]

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
      const getAuthorize = http.expectOne({ method: 'GET', url: '/ExempleAuthorization/oauth/authorize?response_type=code&client_id=test_service_user&scope=account:read%20account:update%20login:head%20login:read%20login:create%20login:update' });
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
