import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { AccountModule } from '../account.module';
import { AccountState } from '../shared/account.state';
import { AccountCreateComponent } from './account-create.component';
import { MessageState } from '../../shared/message/message.state';

describe('AccountCreateComponent', () => {

  let fixture: ComponentFixture<AccountCreateComponent>;
  let store: Store;

  beforeEach(waitForAsync(() => {

    fixture = TestBed.configureTestingModule({

      imports: [HttpClientTestingModule, AccountModule, NgxsModule.forRoot([AccountState, MessageState])]

    }).createComponent(AccountCreateComponent);

    store = TestBed.inject(Store);

  }));

  beforeEach(() => {

    fixture.detectChanges();

  });

  afterEach(() => {

    TestBed.resetTestingModule();

  });

  it('create account success', waitForAsync(inject(
    [HttpTestingController], (http: HttpTestingController) => {

      const component: AccountCreateComponent = fixture.componentInstance;
      component.accountForm.get('email').setValue('jean.dupond@gmail.com');
      component.accountForm.get('firstname').setValue('jean');
      component.accountForm.get('lastname').setValue('dupond');
      component.accountForm.get('birthday').setValue('12/12/1976');
      component.accountForm.get('password').setValue('D#az78&é');

      const id = sinon.spy(component.id, 'emit');

      fixture.detectChanges();

      const headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });
      http.verify();

      fixture.detectChanges();

      fixture.debugElement.query(By.css('button[label=Save]')).nativeElement.click();

      fixture.detectChanges();

      const postAccount = http.expectOne({ method: 'POST', url: '/ExempleService/ws/v1/accounts' });
      postAccount.flush({}, { headers: { location: 'http://127.0.0.1/ExempleService/ws/v1/accounts/123' } });
      const postLogin = http.expectOne({ method: 'POST', url: '/ExempleService/ws/v1/logins' });
      postLogin.flush({}, { headers: { location: 'http://127.0.0.1/ExempleService/ws/v1/logins/jean.dupond@gmail.com' } });
      http.verify();

      sinon.assert.calledOnce(id);
      sinon.assert.calledWith(id, '123');

      store.selectSnapshot(state => state.account.id);

      expect(store.selectSnapshot(state => state.account.id)).is.be.eq('123');
      expect(store.selectSnapshot(state => state.messages.severity)).is.be.eq('success');

    })));

  const ACCOUNT_FAILURES = [
    { message: 'email is required', selector: 'input[formControlName=email]', value: '', event: 'input', expectedMessage: 'Email is required' },
    { message: 'email is incorrect', selector: 'input[formControlName=email]', value: 'jean.dupond', event: 'input', expectedMessage: 'Email is incorrect' },
    { message: 'lastname is required', selector: 'input[formControlName=lastname]', value: '', event: 'input', expectedMessage: 'Lastname is required' },
    { message: 'lastname is not blank', selector: 'input[formControlName=lastname]', value: '  ', event: 'input', expectedMessage: 'Lastname is required' },
    { message: 'firstname is required', selector: 'input[formControlName=firstname]', value: '', event: 'input', expectedMessage: 'Firstname is required' },
    { message: 'firstname is not blank', selector: 'input[formControlName=firstname]', value: '  ', event: 'input', expectedMessage: 'Firstname is required' },
    { message: 'birthday is required', selector: 'p-inputMask[formControlName=birthday]>input', value: '', event: 'blur', expectedMessage: 'Birthday is required' },
    { message: 'password is required', selector: 'input[formControlName=password]', value: '', event: 'input', expectedMessage: 'Password is required' },
    { message: 'password is not blank', selector: 'input[formControlName=password]', value: '  ', event: 'input', expectedMessage: 'Password is required' }
  ];

  ACCOUNT_FAILURES.forEach(function (test) {
    it('creation account failure: ' + test.message, waitForAsync(inject(
      [HttpTestingController], (http: HttpTestingController) => {

        const component: AccountCreateComponent = fixture.componentInstance;
        const id = sinon.spy(component.id, 'emit');

        fixture.debugElement.query(By.css(test.selector)).nativeElement.value = test.value;
        fixture.debugElement.query(By.css(test.selector)).nativeElement.dispatchEvent(new Event(test.event));
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('div.p-invalid')).nativeElement.innerHTML).contains(test.expectedMessage);
        expect(fixture.debugElement.query(By.css('button[label=Save]')).nativeElement.disabled).to.be.true;

        http.expectNone({ method: 'POST', url: '/ExempleService/ws/v1/accounts' });
        http.expectNone({ method: 'POST', url: '/ExempleService/ws/v1/logins' });
        http.verify();

        sinon.assert.notCalled(id);

        expect(store.selectSnapshot(state => state.account)).is.be.empty;

      })));
  });


  it('creation account failure: email already exists', waitForAsync(inject(
    [HttpTestingController], (http: HttpTestingController) => {

      const component: AccountCreateComponent = fixture.componentInstance;
      component.accountForm.get('firstname').setValue('jean');
      component.accountForm.get('lastname').setValue('dupond');
      component.accountForm.get('birthday').setValue('12/12/1976');
      component.accountForm.get('password').setValue('D#az78&é');

      const id = sinon.spy(component.id, 'emit');

      fixture.debugElement.query(By.css('input[formControlName=email]')).nativeElement.value = 'jean.dupond@gmail.com';
      fixture.debugElement.query(By.css('input[formControlName=email]')).nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      const headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({ status: 200, statusText: 'found' });
      http.verify();

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('div.p-invalid')).nativeElement.innerHTML).contains('Email already exists');

      expect(fixture.debugElement.query(By.css('button[label=Save]')).nativeElement.disabled).to.be.true;

      http.expectNone({ method: 'POST', url: '/ExempleService/ws/v1/accounts' });
      http.expectNone({ method: 'POST', url: '/ExempleService/ws/v1/logins' });
      http.verify();

      sinon.assert.notCalled(id);

      expect(store.selectSnapshot(state => state.account)).is.be.empty;

    })));

  it('reset account success', waitForAsync(inject(
    [HttpTestingController], (http: HttpTestingController) => {

      const component: AccountCreateComponent = fixture.componentInstance;
      component.accountForm.get('email').setValue('jean.dupond@gmail.com');
      component.accountForm.get('firstname').setValue('jean');
      component.accountForm.get('lastname').setValue('dupond');
      component.accountForm.get('birthday').setValue('12/12/1976');
      component.accountForm.get('password').setValue('D#az78&é');

      const id = sinon.spy(component.id, 'emit');

      fixture.detectChanges();

      const headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });
      http.verify();

      fixture.detectChanges();

      fixture.debugElement.query(By.css('button[label=Cancel]')).nativeElement.click();

      fixture.detectChanges();

      http.expectNone({ method: 'POST', url: '/ExempleService/ws/v1/accounts' });
      http.expectNone({ method: 'POST', url: '/ExempleService/ws/v1/logins' });
      http.verify();

      sinon.assert.notCalled(id);

      expect(fixture.debugElement.query(By.css('input[formControlName=email]')).nativeElement.value).to.be.empty;
      expect(fixture.debugElement.query(By.css('input[formControlName=firstname]')).nativeElement.value).to.be.empty;
      expect(fixture.debugElement.query(By.css('input[formControlName=lastname]')).nativeElement.value).to.be.empty;
      expect(fixture.debugElement.query(By.css('p-inputMask[formControlName=birthday]>input')).nativeElement.value).to.be.empty;
      expect(fixture.debugElement.query(By.css('input[formControlName=password]')).nativeElement.value).to.be.empty;

    })));

});
