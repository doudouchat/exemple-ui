import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { LoginService } from '../../login/shared/login.service';
import { CreateAccount, GetAccountByUsername, UpdateAccount } from './account.action';
import { AccountService } from './account.service';
import { AccountState } from './account.state';
import { PublishMessage } from 'src/app/shared/message/message.action';
import { Navigate } from '@ngxs/router-plugin';

describe('AccountState', () => {

  let store: Store;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({

      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([AccountState])
      ],
      providers: [
        AccountService,
        LoginService
      ]

    }).compileComponents();

    store = TestBed.inject(Store);

  }));

  afterEach(() => {

    TestBed.resetTestingModule();

  });

  describe('Create Account', () => {

    it('create account success', waitForAsync(inject(
      [HttpTestingController], (http: HttpTestingController) => {

        const dispatch = sinon.spy(store, 'dispatch');

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

        // And check dispatch
        sinon.assert.calledWith(dispatch, new PublishMessage(
          { severity: 'success', summary: 'Success', detail: 'Account creation successfull' }));
        sinon.assert.calledWith(dispatch, new Navigate(['/login']));


      })));

  });

  describe('Update Account', () => {

    it('update account success', waitForAsync(inject(
      [HttpTestingController], (http: HttpTestingController) => {

        const dispatch = sinon.spy(store, 'dispatch');

        // when dispatch
        store.dispatch(new UpdateAccount(
          {
            id: '99',
            email: 'john.doe@gmail.com',
            firstname: 'john',
            lastname: 'doe',
            birthday: '12/07/1976',
            update_date: new Date()
          },
          {
            id: '99',
            email: 'john.doe@gmail.com',
            firstname: 'john',
            lastname: 'doe',
            birthday: '12/06/1977'
          }
        ));

        // Then check http
        const accountPatch = http.expectOne({ method: 'PATCH', url: '/ExempleService/ws/v1/accounts/99' });
        accountPatch.flush({}, { status: 200, statusText: 'ok' });

        http.verify();

        const expectedAccountBody = [{ op: 'replace', path: '/birthday', value: '1976-07-12' }];
        expect(accountPatch.request.body).is.be.eq(JSON.stringify(expectedAccountBody));

        // And check store
        expect(store.selectSnapshot(state => state.account.birthday)).is.be.eq('1976-07-12');

        // And check dispatch
        expect(dispatch.calledWith(new PublishMessage(
          { severity: 'success', summary: 'Success', detail: 'Account update successfull' }))).is.be.true;

      })));

    it('update email success', waitForAsync(inject(
      [HttpTestingController], (http: HttpTestingController) => {

        const dispatch = sinon.spy(store, 'dispatch');

        // when dispatch
        store.dispatch(new UpdateAccount(
          {
            id: '99',
            email: 'jean.dupond@gmail.com',
            firstname: 'john',
            lastname: 'doe',
            birthday: '12/06/1976',
            update_date: new Date()
          },
          {
            id: '99',
            email: 'john.doe@gmail.com',
            firstname: 'john',
            lastname: 'doe',
            birthday: '12/06/1976'
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

        // And check dispatch
        expect(dispatch.calledWith(new PublishMessage(
          { severity: 'success', summary: 'Success', detail: 'Account update successfull' }))).is.be.true;

      })));

  });

  describe('Get Account', () => {

    it('get account success', waitForAsync(inject(
      [HttpTestingController], (http: HttpTestingController) => {

        const dispatch = sinon.spy(store, 'dispatch');

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
        sinon.assert.calledWith(dispatch, new Navigate(['/account'], { id: 99 }));
      })));

  });


});
