import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Navigate } from '@ngxs/router-plugin';
import { provideStore, Store } from '@ngxs/store';
import { MockProvider } from 'ng-mocks';

import { LoginService } from '../../login/shared/login.service';
import { MessageService } from '../../shared/message/message.service';
import { CreateAccount, GetAccountByUsername, UpdateAccount } from './account.action';
import { AccountService } from './account.service';
import { AccountState } from './account.state';

describe('AccountState', () => {

  let store: Store;
  let messageService: MessageService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        AccountService,
        LoginService,
        provideStore([AccountState]),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        MockProvider(MessageService)
      ]
    }).compileComponents();

    store = TestBed.inject(Store);
    messageService = TestBed.inject(MessageService);

  });

  afterEach(() => {

    TestBed.resetTestingModule();

  });

  describe('Create Account', () => {

    it('create account success', inject(
      [HttpTestingController], (http: HttpTestingController) => {

        const dispatch = vi.spyOn(store, 'dispatch');
        const publish = vi.spyOn(messageService, 'success');

        // when dispatch
        store.dispatch(new CreateAccount(
          {
            email: 'jean.dupond@gmail.com',
            lastname: 'dupond',
            firstname: 'jean',
            birthday: '12/12/1976'
          },
          'D#az78&é'));

        // Then check http
        const postAccount = http.expectOne({ method: 'POST', url: '/ExempleService/ws/v1/accounts' });
        postAccount.flush({}, { headers: { location: 'http://127.0.0.1/ExempleService/ws/v1/accounts/123' } });
        const postLogin = http.expectOne({ method: 'PUT', url: '/ExempleAuthorization/ws/v1/logins/jean.dupond@gmail.com' });
        postLogin.flush({}, { headers: { location: 'http://127.0.0.1/ExempleAuthorization/ws/v1/logins/jean.dupond@gmail.com' } });

        http.verify();

        const expectedAccountBody = {
          'email': 'jean.dupond@gmail.com',
          'lastname': 'dupond',
          'firstname': 'jean',
          'birthday': '1976-12-12'
        };
        expect(postAccount.request.body).is.be.eq(JSON.stringify(expectedAccountBody));

        // And check store
        expect(store.selectSnapshot(state => state.account.id)).is.be.eq('123');

        // And check dispatch & publish
        expect(publish).toHaveBeenCalledWith('Success', 'Account creation successfull');
        expect(dispatch).toHaveBeenCalledWith(new Navigate(['/login']));


      }));

  });

  describe('Update Account', () => {

    it('update account success', inject(
      [HttpTestingController], (http: HttpTestingController) => {

        // Setup store
        store.reset({
          account: {
            id: '99',
            email: 'john.doe@gmail.com',
            firstname: 'john',
            lastname: 'doe',
            birthday: '12/06/1977'
          }
        });

        const publish = vi.spyOn(messageService, 'success');

        // when dispatch
        store.dispatch(new UpdateAccount(
          {
            id: '99',
            email: 'john.doe@gmail.com',
            firstname: 'john',
            lastname: 'doe',
            birthday: '12/07/1976',
            update_date: new Date()
          }
        ));

        // Then check http
        const accountPatch = http.expectOne({ method: 'PATCH', url: '/ExempleService/ws/v1/accounts/99' });
        accountPatch.flush({}, { status: 200, statusText: 'ok' });

        http.verify();

        const expectedAccountBody = [{ op: 'replace', path: '/birthday', value: '1976-07-12' }];
        expect(accountPatch.request.body).is.be.eq(JSON.stringify(expectedAccountBody));

        // And check store
        expect(store.selectSnapshot(state => state.account.birthday)).is.be.eq('12/07/1976');

        // And check publish
        expect(publish).toHaveBeenCalledWith('Success', 'Account update successfull');

      }));

    it('update email success', inject(
      [HttpTestingController], (http: HttpTestingController) => {

        // Setup store
        store.reset({
          account: {
            id: '99',
            email: 'john.doe@gmail.com',
            firstname: 'john',
            lastname: 'doe',
            birthday: '12/06/1976'
          }
        });

        const publish = vi.spyOn(messageService, 'success');

        // when dispatch
        store.dispatch(new UpdateAccount(
          {
            id: '99',
            email: 'jean.dupond@gmail.com',
            firstname: 'john',
            lastname: 'doe',
            birthday: '12/06/1976',
            update_date: new Date()
          }
        ));

        // Then check http
        const accountPatch = http.expectOne({ method: 'PATCH', url: '/ExempleService/ws/v1/accounts/99' });
        accountPatch.flush({}, { status: 204, statusText: 'ok' });
        const loginAuthorizationCopy = http.expectOne({ method: 'POST', url: '/ExempleAuthorization/ws/v1/logins/move' });
        loginAuthorizationCopy.flush({}, { status: 201, statusText: 'ok' });

        http.verify();

        const expectedAccountBody = [{ op: 'replace', path: '/email', value: 'jean.dupond@gmail.com' }];
        expect(accountPatch.request.body).is.be.eq(JSON.stringify(expectedAccountBody));

        const expectedLoginBody = { fromUsername: 'john.doe@gmail.com', toUsername: 'jean.dupond@gmail.com' };
        expect(loginAuthorizationCopy.request.body).is.be.eq(JSON.stringify(expectedLoginBody));

        // And check store
        expect(store.selectSnapshot(state => state.account.email)).is.be.eq('jean.dupond@gmail.com');

        // And check publish
        expect(publish).toHaveBeenCalledWith('Success', 'Account update successfull');

      }));

    it('shouldn\'t update account because account has not changed', inject(
      [HttpTestingController], (http: HttpTestingController) => {

        // Setup store
        store.reset({
          account: {
            id: '99',
            email: 'john.doe@gmail.com',
            firstname: 'john',
            lastname: 'doe',
            birthday: '12/06/1977'
          }
        });

        const publish = vi.spyOn(messageService, 'success');

        // when dispatch
        store.dispatch(new UpdateAccount(
          {
            id: '99',
            email: 'john.doe@gmail.com',
            firstname: 'john',
            lastname: 'doe',
            birthday: '12/06/1977',
            update_date: new Date()
          }
        ));

        // Then check http
        http.verify();

        // And check publish
        expect(publish).not.toHaveBeenCalled();

      }));

  });

  describe('Get Account', () => {

    it('get account success', inject(
      [HttpTestingController], (http: HttpTestingController) => {

        const dispatch = vi.spyOn(store, 'dispatch');

        // when dispatch
        store.dispatch(new GetAccountByUsername('jean.dupond@gmail.com'));

        // Then check http
        const getLogin = http.expectOne({ method: 'GET', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
        getLogin.flush(99);
        const getAccount = http.expectOne({ method: 'GET', url: '/ExempleService/ws/v1/accounts/99' });
        getAccount.flush({
          firstname: 'john',
          lastname: 'doe'
        });

        http.verify();

        // And check store
        expect(store.selectSnapshot(state => state.account.firstname)).is.be.eq('john');
        expect(store.selectSnapshot(state => state.account.lastname)).is.be.eq('doe');

        // And check dispatch
        expect(dispatch).toHaveBeenCalledWith(new Navigate(['/account'], { id: 99 }));
      }));

  });


});
