import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { NgxsModule, Store } from '@ngxs/store';

import { CreateAccount } from '../shared/account.action';
import { AccountCreateComponent } from './account-create.component';

describe('AccountCreateComponent', () => {

  let fixture: ComponentFixture<AccountCreateComponent>;
  let store: Store;
  let loader: HarnessLoader;

  beforeEach(() => {

    fixture = TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([])
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).createComponent(AccountCreateComponent);

    store = TestBed.inject(Store);
    loader = TestbedHarnessEnvironment.loader(fixture);

  });

  it('init account', async () => {

    // check email
    const email = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Email' }));
    const emailControl = await email.getControl() as MatInputHarness;
    expect(await emailControl.getValue()).to.equal('');
    expect(await email.getTextErrors()).to.be.empty;

    // And check firstname
    const firstname = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Firstname' }));
    const firstnameControl = await firstname.getControl() as MatInputHarness;
    expect(await firstnameControl.getValue()).to.equal('');
    expect(await firstname.getTextErrors()).to.be.empty;

    // And check lastname
    const lastname = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Lastname' }));
    const lastnameControl = await lastname.getControl() as MatInputHarness;
    expect(await lastnameControl.getValue()).to.equal('');
    expect(await lastname.getTextErrors()).to.be.empty;

    // And check birthday
    const birthday = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Birthday' }));
    const birthdayControl = await birthday.getControl() as MatInputHarness;
    expect(await birthdayControl.getValue()).to.equal('');
    expect(await birthday.getTextErrors()).to.be.empty;

    // And check password
    const password = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Password' }));
    const passwordControl = await password.getControl() as MatInputHarness;
    expect(await passwordControl.getValue()).to.equal('');
    expect(await password.getTextErrors()).to.be.empty;

    // And check save button
    const save = await loader.getHarness(MatButtonHarness.with({ selector: `[aria-label='save']` }));
    expect(await save.isDisabled()).to.be.true;

  });

  it('create account success', inject(
    [HttpTestingController], async (http: HttpTestingController) => {

      // Setup edit email
      const email = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Email' }));
      const emailControl = await email.getControl() as MatInputHarness;
      await emailControl.setValue('jean.dupond@gmail.com');

      // And edit firstname
      const firstname = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Firstname' }));
      const firstnameControl = await firstname.getControl() as MatInputHarness;
      await firstnameControl.setValue('jean');

      // And edit lastname
      const lastname = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Lastname' }));
      const lastnameControl = await lastname.getControl() as MatInputHarness;
      await lastnameControl.setValue('dupond');

      // And edit birthday
      const birthday = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Birthday' }));
      const birthdayControl = await birthday.getControl() as MatInputHarness;
      await birthdayControl.setValue('12/12/1976');

      // And edit password
      const password = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Password' }));
      const passwordControl = await password.getControl() as MatInputHarness;
      await passwordControl.setValue('D#az78&é');

      const dispatch = vi.spyOn(store, 'dispatch');

      // and mock http
      let headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });
      headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleAuthorization/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });

      // when click save
      const save = await loader.getHarness(MatButtonHarness.with({ selector: `[aria-label='save']` }));
      await save.click();

      // Then check http
      http.verify({ ignoreCancelled: true });

      // And check dispatch
      expect(dispatch).toHaveBeenCalledWith(new CreateAccount({
        email: 'jean.dupond@gmail.com',
        lastname: 'dupond',
        firstname: 'jean',
        birthday: '12/12/1976'
      }, 'D#az78&é'));

    }));

  [
    { message: 'email is required', label: 'Email', value: '', expectedMessage: 'Email is required.' },
    { message: 'email is not blank', label: 'Email', value: ' ', expectedMessage: 'Email is incorrect.' },
    { message: 'email is incorrect', label: 'Email', value: 'jean.dupond', expectedMessage: 'Email is incorrect.' },
    { message: 'lastname is required', label: 'Lastname', value: '', expectedMessage: 'Lastname is required.' },
    { message: 'lastname is not blank', label: 'Lastname', value: '  ', expectedMessage: 'Lastname is required.' },
    { message: 'firstname is required', label: 'Firstname', value: '', expectedMessage: 'Firstname is required.' },
    { message: 'firstname is not blank', label: 'Firstname', value: '  ', expectedMessage: 'Firstname is required.' },
    { message: 'password is required', label: 'Password', value: '', expectedMessage: 'Password is required.' },
    { message: 'password is not blank', label: 'Password', value: '  ', expectedMessage: 'Password is required.' },

  ].forEach(function (test) {
    it('creation account failure: ' + test.message, inject(
      [HttpTestingController], async (http: HttpTestingController) => {

        // setup form
        const dispatch = vi.spyOn(store, 'dispatch');

        // When edit field
        const formField = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: test.label }));
        const fieldControl = await formField.getControl() as MatInputHarness;
        await fieldControl.setValue(test.value);

        // Then check message
        const errors = await formField.getTextErrors();
        expect(errors).contains(test.expectedMessage);

        // And check save button
        const save = await loader.getHarness(MatButtonHarness.with({ selector: `[aria-label='save']` }));
        expect(await save.isDisabled()).to.be.true;

        // And check http
        http.verify();

        // And check dispatch
        expect(dispatch).not.toHaveBeenCalled();

      }));
  });

  it('creation account failure: birthday is required', inject(
    [HttpTestingController], async (http: HttpTestingController) => {

      // setup form
      const dispatch = vi.spyOn(store, 'dispatch');

      // When edit field
      const formField = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Birthday' }));
      const fieldControl = await formField.getControl() as MatInputHarness;
      await fieldControl.setValue('12');
      await fieldControl.blur();

      // Then check message
      const errors = await formField.getTextErrors();
      expect(errors).contains('Birthday is required.');

      // And check save button
      const save = await loader.getHarness(MatButtonHarness.with({ selector: `[aria-label='save']` }));
      expect(await save.isDisabled()).to.be.true;

      // And check http
      http.verify();

      // And check dispatch
      expect(dispatch).not.toHaveBeenCalled();

    }));

  it('creation account failure: email already exists', inject(
    [HttpTestingController], async (http: HttpTestingController) => {

      // Setup edit firstname
      const firstname = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Firstname' }));
      const firstnameControl = await firstname.getControl() as MatInputHarness;
      await firstnameControl.setValue('jean');

      // And edit lastname
      const lastname = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Lastname' }));
      const lastnameControl = await lastname.getControl() as MatInputHarness;
      await lastnameControl.setValue('dupond');

      // And edit birthday
      const birthday = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Birthday' }));
      const birthdayControl = await birthday.getControl() as MatInputHarness;
      await birthdayControl.setValue('12/12/1976');

      // And edit password
      const password = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Password' }));
      const passwordControl = await password.getControl() as MatInputHarness;
      await passwordControl.setValue('D#az78&é');

      const dispatch = vi.spyOn(store, 'dispatch');

      // When edit email
      const email = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Email' }));
      const emailControl = await email.getControl() as MatInputHarness;
      await emailControl.setValue('jean.dupond@gmail.com');

      // and mock http
      let headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({ status: 200, statusText: 'found' });
      headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleAuthorization/ws/v1/logins/jean.dupond@gmail.com' });

      // Then check message
      const errors = await email.getTextErrors();
      expect(errors).contains('Email already exists.');

      // And check save button
      const save = await loader.getHarness(MatButtonHarness.with({ selector: `[aria-label='save']` }));
      expect(await save.isDisabled()).to.be.true;

      // And check http
      http.verify({ ignoreCancelled: true });

      // And check dispatch
      expect(dispatch).not.toHaveBeenCalled();

    }));

  it.skip('creation account failure: request HEAD /ws/v1/logins fails', inject(
    [HttpTestingController], async (http: HttpTestingController) => {

      // Setup edit firstname
      const firstname = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Firstname' }));
      const firstnameControl = await firstname.getControl() as MatInputHarness;
      await firstnameControl.setValue('jean');

      // And edit lastname
      const lastname = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Lastname' }));
      const lastnameControl = await lastname.getControl() as MatInputHarness;
      await lastnameControl.setValue('dupond');

      // And edit birthday
      const birthday = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Birthday' }));
      const birthdayControl = await birthday.getControl() as MatInputHarness;
      await birthdayControl.setValue('12/12/1976');

      // And edit password
      const password = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Password' }));
      const passwordControl = await password.getControl() as MatInputHarness;
      await passwordControl.setValue('D#az78&é');

      // When edit email
      const email = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Email' }));
      const emailControl = await email.getControl() as MatInputHarness;
      await emailControl.setValue('jean.dupond@gmail.com');

      // and mock http
      let headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 500, statusText: 'internal error' });
      headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleAuthorization/ws/v1/logins/jean.dupond@gmail.com' });

      // Then check save button
      const save = await loader.getHarness(MatButtonHarness.with({ selector: `[aria-label='save']` }));
      expect(await save.isDisabled()).to.be.true;

      // And check http
      http.verify({ ignoreCancelled: true });

    }));

  it('reset account success', inject(
    [HttpTestingController], async (http: HttpTestingController) => {

      // Setup edit email
      const email = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Email' }));
      const emailControl = await email.getControl() as MatInputHarness;
      await emailControl.setValue('jean.dupond@gmail.com');

      // And edit firstname
      const firstname = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Firstname' }));
      const firstnameControl = await firstname.getControl() as MatInputHarness;
      await firstnameControl.setValue('jean');

      // And edit lastname
      const lastname = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Lastname' }));
      const lastnameControl = await lastname.getControl() as MatInputHarness;
      await lastnameControl.setValue('dupond');

      // And edit birthday
      const birthday = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Birthday' }));
      const birthdayControl = await birthday.getControl() as MatInputHarness;
      await birthdayControl.setValue('12/12/1976');

      // And edit password
      const password = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Password' }));
      const passwordControl = await password.getControl() as MatInputHarness;
      await passwordControl.setValue('D#az78&é');

      const dispatch = vi.spyOn(store, 'dispatch');

      // and mock http
      let headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });
      headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleAuthorization/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });

      // when click cancel
      const cancel = await loader.getHarness(MatButtonHarness.with({ selector: `[aria-label='cancel']` }));
      await cancel.click();

      // Then check http
      http.verify({ ignoreCancelled: true });

      // And check dispatch
      expect(dispatch).not.toHaveBeenCalled();

      // And check form
      expect(await emailControl.getValue()).to.be.empty;
      expect(await firstnameControl.getValue()).to.be.empty;
      expect(await lastnameControl.getValue()).to.be.empty;
      expect(await birthdayControl.getValue()).to.be.empty;
      expect(await passwordControl.getValue()).to.be.empty;

      // And check save button
      const save = await loader.getHarness(MatButtonHarness.with({ selector: `[aria-label='save']` }));
      expect(await save.isDisabled()).to.be.true;

    }));

});
