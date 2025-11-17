import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { NgxsModule, Store } from '@ngxs/store';
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import * as sinon from 'sinon';

import { CreateAccount } from '../shared/account.action';
import { AccountCreateComponent } from './account-create.component';

describe('AccountCreateComponent', () => {

  let fixture: ComponentFixture<AccountCreateComponent>;
  let store: Store;

  beforeEach(waitForAsync(() => {

    fixture = TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot([])
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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

      // setup form
      const component: AccountCreateComponent = fixture.componentInstance;
      component.accountForm.get('email').setValue('jean.dupond@gmail.com');
      component.accountForm.get('firstname').setValue('jean');
      component.accountForm.get('lastname').setValue('dupond');
      component.accountForm.get('birthday').setValue('12/12/1976');
      component.accountForm.get('password').setValue('D#az78&é');

      // and mock store
      const dispatch = sinon.stub(store, 'dispatch');

      // and mock http
      let headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });
      headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleAuthorization/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });

      fixture.detectChanges();

      // when click save
      fixture.debugElement.query(By.css('button[label=Save]')).nativeElement.click();

      fixture.detectChanges();

      // Then check http
      http.verify();

      // And check dispatch
      sinon.assert.calledWith(dispatch, new CreateAccount({
        email: 'jean.dupond@gmail.com',
        lastname: 'dupond',
        firstname: 'jean',
        birthday: '12/12/1976'
      }, 'D#az78&é'));

    })));

  [
    { message: 'email is required', selector: 'input[formControlName=email]', value: '', event: 'input', expectedMessage: 'Email is required' },
    { message: 'email is incorrect', selector: 'input[formControlName=email]', value: 'jean.dupond', event: 'input', expectedMessage: 'Email is incorrect' },
    { message: 'lastname is required', selector: 'input[formControlName=lastname]', value: '', event: 'input', expectedMessage: 'Lastname is required' },
    { message: 'lastname is not blank', selector: 'input[formControlName=lastname]', value: '  ', event: 'input', expectedMessage: 'Lastname is required' },
    { message: 'firstname is required', selector: 'input[formControlName=firstname]', value: '', event: 'input', expectedMessage: 'Firstname is required' },
    { message: 'firstname is not blank', selector: 'input[formControlName=firstname]', value: '  ', event: 'input', expectedMessage: 'Firstname is required' },
    { message: 'birthday is required', selector: 'p-inputMask[formControlName=birthday]>input', value: '', event: 'blur', expectedMessage: 'Birthday is required' },
    { message: 'password is required', selector: 'input[formControlName=password]', value: '', event: 'input', expectedMessage: 'Password is required' },
    { message: 'password is not blank', selector: 'input[formControlName=password]', value: '  ', event: 'input', expectedMessage: 'Password is required' }
  ].forEach(function (test) {
    it('creation account failure: ' + test.message, waitForAsync(inject(
      [HttpTestingController], (http: HttpTestingController) => {

        // setup form
        const dispatch = sinon.spy(store, 'dispatch');

        fixture.debugElement.query(By.css(test.selector)).nativeElement.value = test.value;
        fixture.debugElement.query(By.css(test.selector)).nativeElement.dispatchEvent(new Event(test.event));

        fixture.detectChanges();

        // Then check message
        expect(fixture.debugElement.query(By.css('p-message')).nativeElement.innerHTML).contains(test.expectedMessage);

        // And check save button
        expect(fixture.debugElement.query(By.css('button[label=Save]')).nativeElement.disabled).to.be.true;

        // And check http
        http.verify();

        // And check dispatch
        sinon.assert.notCalled(dispatch);

      })));
  });


  it('creation account failure: email already exists', waitForAsync(inject(
    [HttpTestingController], (http: HttpTestingController) => {

      // setup form
      const component: AccountCreateComponent = fixture.componentInstance;
      component.accountForm.get('firstname').setValue('jean');
      component.accountForm.get('lastname').setValue('dupond');
      component.accountForm.get('birthday').setValue('12/12/1976');
      component.accountForm.get('password').setValue('D#az78&é');

      const dispatch = sinon.spy(store, 'dispatch');

      fixture.debugElement.query(By.css('input[formControlName=email]')).nativeElement.value = 'jean.dupond@gmail.com';
      fixture.debugElement.query(By.css('input[formControlName=email]')).nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      // and mock http
      let headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({ status: 200, statusText: 'found' });
      headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleAuthorization/ws/v1/logins/jean.dupond@gmail.com' });

      fixture.detectChanges();

      // Then check message
      expect(fixture.debugElement.query(By.css('p-message')).nativeElement.innerHTML).contains('Email already exists');

      // And check save button
      expect(fixture.debugElement.query(By.css('button[label=Save]')).nativeElement.disabled).to.be.true;

      // And check http
      http.verify();

      // And check dispatch
      sinon.assert.notCalled(dispatch);

    })));

  it.skip('creation account failure: request HEAD /ws/v1/logins fails', inject(
    [HttpTestingController], (http: HttpTestingController) => {

      const component: AccountCreateComponent = fixture.componentInstance;
      component.accountForm.get('email').setValue('jean.dupond@gmail.com');
      component.accountForm.get('firstname').setValue('jean');
      component.accountForm.get('lastname').setValue('dupond');
      component.accountForm.get('birthday').setValue('12/12/1976');
      component.accountForm.get('password').setValue('D#az78&é');

      fixture.detectChanges();

      // and mock http
      let headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 500, statusText: 'internal error' });
      headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleAuthorization/ws/v1/logins/jean.dupond@gmail.com' });
      http.verify();

      fixture.detectChanges();

      // Then check save button
      expect(fixture.debugElement.query(By.css('button[label=Save]')).nativeElement.disabled).to.be.true;

    }));

  it('reset account success', waitForAsync(inject(
    [HttpTestingController], (http: HttpTestingController) => {

      // setup form
      const component: AccountCreateComponent = fixture.componentInstance;
      component.accountForm.get('email').setValue('jean.dupond@gmail.com');
      component.accountForm.get('firstname').setValue('jean');
      component.accountForm.get('lastname').setValue('dupond');
      component.accountForm.get('birthday').setValue('12/12/1976');
      component.accountForm.get('password').setValue('D#az78&é');

      const dispatch = sinon.spy(store, 'dispatch');

      fixture.detectChanges();

      // and mock http
      let headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });
      headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleAuthorization/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });

      fixture.detectChanges();

      // when click save
      fixture.debugElement.query(By.css('button[label=Cancel]')).nativeElement.click();

      fixture.detectChanges();

      // Then check http
      http.verify();

      // And check dispatch
      sinon.assert.notCalled(dispatch);

      // And check form
      expect(fixture.debugElement.query(By.css('input[formControlName=email]')).nativeElement.value).to.be.empty;
      expect(fixture.debugElement.query(By.css('input[formControlName=firstname]')).nativeElement.value).to.be.empty;
      expect(fixture.debugElement.query(By.css('input[formControlName=lastname]')).nativeElement.value).to.be.empty;
      expect(fixture.debugElement.query(By.css('p-inputMask[formControlName=birthday]>input')).nativeElement.value).to.be.empty;
      expect(fixture.debugElement.query(By.css('input[formControlName=password]')).nativeElement.value).to.be.empty;

    })));

});
