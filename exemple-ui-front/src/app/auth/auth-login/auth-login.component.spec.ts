import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { expect } from 'chai';

import { AccountState } from '../../account/shared/account.state';
import { MessageState } from '../../shared/message/message.state';
import { AuthModule } from '../auth.module';
import { AuthState } from '../shared/auth.state';
import { AuthLoginComponent } from './auth-login.component';

describe('AuthLoginComponent', () => {

  let fixture: ComponentFixture<AuthLoginComponent>;
  let store: Store;

  beforeEach(waitForAsync(() => {

    fixture = TestBed.configureTestingModule({

      imports: [AuthModule, RouterTestingModule, HttpClientTestingModule,
        NgxsModule.forRoot([AccountState, AuthState, MessageState])]

    }).createComponent(AuthLoginComponent);

    store = TestBed.inject(Store);

  }));

  beforeEach(() => {

    fixture.detectChanges();

  });

  afterEach(() => {

    TestBed.resetTestingModule();

  });

  it('authenticate success', waitForAsync(inject(
    [HttpTestingController], (http: HttpTestingController) => {

      const component: AuthLoginComponent = fixture.componentInstance;
      component.authenticateForm.get('username').setValue('jean.dupond@gmail.com');
      component.authenticateForm.get('password').setValue('D#az78&é');

      fixture.detectChanges();

      fixture.debugElement.query(By.css('button[label=Login]')).nativeElement.click();

      fixture.detectChanges();

      const postPassword = http.expectOne({ method: 'POST', url: '/ExempleAuthorization/oauth/token' });
      postPassword.flush({
        expires_in: 300
      });
      const getLogin = http.expectOne({ method: 'GET', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      getLogin.flush(99);
      const getAccount = http.expectOne({ method: 'GET', url: '/ExempleService/ws/v1/accounts/99' });
      getAccount.flush({
        firstname: 'john',
        lastname: 'doe'
      });
      http.verify();

      expect(store.selectSnapshot(state => state.authenticate.authenticate)).is.be.true;
      expect(store.selectSnapshot(state => state.authenticate.username)).is.be.eq('jean.dupond@gmail.com');
      expect(store.selectSnapshot(state => state.messages.severity)).is.be.eq('success');
      expect(store.selectSnapshot(state => state.account.firstname)).is.be.eq('john');
      expect(store.selectSnapshot(state => state.account.lastname)).is.be.eq('doe');

    })));

  it('authenticate failure', waitForAsync(inject(
    [HttpTestingController], (http: HttpTestingController) => {

      const component: AuthLoginComponent = fixture.componentInstance;
      component.authenticateForm.get('username').setValue('jean.dupond@gmail.com');
      component.authenticateForm.get('password').setValue('D#az78&é');

      fixture.detectChanges();

      fixture.debugElement.query(By.css('button[label=Login]')).nativeElement.click();

      fixture.detectChanges();

      const postPassword = http.expectOne({ method: 'POST', url: '/ExempleAuthorization/oauth/token' });
      postPassword.flush({}, { status: 401, statusText: 'unauthorized' });
      http.expectNone({ method: 'GET', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      http.verify();

      expect(store.selectSnapshot(state => state.authenticate.authenticate)).is.be.false;
      expect(store.selectSnapshot(state => state.authenticate.username)).is.be.undefined;
      expect(store.selectSnapshot(state => state.messages.severity)).is.be.eq('error');

    })));

  it('authenticate exception', inject(
    [HttpTestingController], (http: HttpTestingController) => {

      const component: AuthLoginComponent = fixture.componentInstance;
      component.authenticateForm.get('username').setValue('jean.dupond@gmail.com');
      component.authenticateForm.get('password').setValue('D#az78&é');

      fixture.detectChanges();

      fixture.debugElement.query(By.css('button[label=Login]')).nativeElement.click();

      fixture.detectChanges();

      const postPassword = http.expectOne({ method: 'POST', url: '/ExempleAuthorization/oauth/token' });
      postPassword.flush({}, { status: 500, statusText: 'internal error' });
      http.verify();

      expect(store.selectSnapshot(state => state.authenticate.authenticate)).is.be.false;
      expect(store.selectSnapshot(state => state.authenticate.username)).is.be.undefined;
      expect(store.selectSnapshot(state => state.messages)).is.empty;

      expect(component.login).to.throw();

    }));

  const AUTHENTICATE_FAILURES = [
    { message: 'username is required', selector: 'input[formControlName=username]', value: '', event: 'input', expectedMessage: 'Username is required' },
    { message: 'username is not blank', selector: 'input[formControlName=username]', value: '  ', event: 'input', expectedMessage: 'Username is required' },
    { message: 'password is required', selector: 'input[formControlName=password]', value: '', event: 'input', expectedMessage: 'Password is required' },
    { message: 'password is not blank', selector: 'input[formControlName=password]', value: '  ', event: 'input', expectedMessage: 'Password is required' }
  ];

  AUTHENTICATE_FAILURES.forEach(function (test) {
    it('authenticate failure: ' + test.message, waitForAsync(inject(
      [HttpTestingController], (http: HttpTestingController) => {

        fixture.debugElement.query(By.css(test.selector)).nativeElement.value = test.value;
        fixture.debugElement.query(By.css(test.selector)).nativeElement.dispatchEvent(new Event(test.event));
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('div.p-invalid')).nativeElement.innerHTML).contains(test.expectedMessage);
        expect(fixture.debugElement.query(By.css('button[label=Login]')).nativeElement.disabled).to.be.true;


      })));
  });

});
