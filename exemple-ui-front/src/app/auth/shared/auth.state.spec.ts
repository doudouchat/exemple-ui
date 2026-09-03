
import { HttpRequest, provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { MockProvider } from 'ng-mocks';

import { GetAccountByUsername } from '../../account/shared/account.action';
import { MessageService } from '../../shared/message/message.service';
import { Authenticate } from './auth.action';
import { AuthState } from './auth.state';

describe('AuthState', () => {

  let store: Store;
  let messageService: MessageService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        provideStore([AuthState]),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        MockProvider(MessageService)]
    }).compileComponents();

    store = TestBed.inject(Store);
    messageService = TestBed.inject(MessageService);

  });


  afterEach(() => {

    TestBed.resetTestingModule();

  });

  it('authenticate success', inject(
    [HttpTestingController], (http: HttpTestingController) => {

      const dispatch = vi.spyOn(store, 'dispatch');
      const publish = vi.spyOn(messageService, 'success');

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

      // And check dispatch & publish
      expect(publish).toHaveBeenCalledWith('Success', 'Authenticate successfull');
      expect(dispatch).toHaveBeenCalledWith(new GetAccountByUsername('jean.dupond@gmail.com'));
    }));

  it('authenticate failure', inject(
    [HttpTestingController], (http: HttpTestingController) => {

      const publish = vi.spyOn(messageService, 'error');

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

      // And check publish
      expect(publish).toHaveBeenCalledWith('Failure', 'Authenticate failure');

    }));

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
