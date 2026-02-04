import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule, Store } from '@ngxs/store';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { UpdateAccount } from '../shared/account.action';
import { AccountEditComponent } from './account-edit.component';

describe('AccountEditComponent', () => {

  let fixture: ComponentFixture<AccountEditComponent>;
  let store: Store;
  let loader: HarnessLoader;

  beforeEach(waitForAsync(() => {

    fixture = TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot([])
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).createComponent(AccountEditComponent);

    fixture.componentRef.setInput('account', {
      id: '99',
      email: 'john.doe@gmail.com',
      firstname: 'john',
      lastname: 'doe',
      birthday: '12/06/1976'
    });
    store = TestBed.inject(Store);
    loader = TestbedHarnessEnvironment.loader(fixture);

  }));

  it('init account', async () => {

    // check email
    const email = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Email' }));
    const emailControl = await email.getControl() as MatInputHarness;
    expect(await emailControl.getValue()).to.equal('john.doe@gmail.com');

    // And check firstname
    const firstname = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Firstname' }));
    const firstnameControl = await firstname.getControl() as MatInputHarness;
    expect(await firstnameControl.getValue()).to.equal('john');

    // And check lastname
    const lastname = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Lastname' }));
    const lastnameControl = await lastname.getControl() as MatInputHarness;
    expect(await lastnameControl.getValue()).to.equal('doe');

    // And check birthday
    const birthday = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Birthday' }));
    const birthdayControl = await birthday.getControl() as MatInputHarness;
    expect(await birthdayControl.getValue()).to.equal('12/06/1976');

    // And check save button
    const save = await loader.getHarness(MatButtonHarness.with({ selector: `[aria-label='save']` }));
    expect(await save.isDisabled()).to.be.false;

  });

  it('edit account success: birthday', waitForAsync(inject(
    [HttpTestingController], async (http: HttpTestingController) => {

      // setup mock store
      const dispatch = sinon.spy(store, 'dispatch');

      // when change form
      const birthday = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Birthday' }));
      const birthdayControl = await birthday.getControl() as MatInputHarness;
      await birthdayControl.setValue('12/07/1977');

      // when click save
      const save = await loader.getHarness(MatButtonHarness.with({ selector: `[aria-label='save']` }));
      await save.click();

      // Then check http
      http.verify();

      // And check birthday
      expect(await birthdayControl.getValue()).to.equal('12/07/1977');

      // And check dispatch
      sinon.assert.calledWith(dispatch, new UpdateAccount(
        {
          id: '99',
          email: 'john.doe@gmail.com',
          firstname: 'john',
          lastname: 'doe',
          birthday: '12/07/1977',
          creation_date: null,
          update_date: null
        },
        {
          id: '99',
          email: 'john.doe@gmail.com',
          firstname: 'john',
          lastname: 'doe',
          birthday: '12/06/1976'
        }
      ));

    })));

  it('edit account success: email', waitForAsync(inject(
    [HttpTestingController], async (http: HttpTestingController) => {

      // setup mock store
      const dispatch = sinon.spy(store, 'dispatch');

      // When change email
      const email = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Email' }));
      const emailControl = await email.getControl() as MatInputHarness;
      await emailControl.setValue('jean.dupond@gmail.com');

      let headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });
      headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleAuthorization/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });

      // And click save
      const save = await loader.getHarness(MatButtonHarness.with({ selector: `[aria-label='save']` }));
      await save.click();

      // Then check http
      http.verify({ ignoreCancelled: true });

      // And check email
      expect(await emailControl.getValue()).to.equal('jean.dupond@gmail.com');

      // And check dispatch
      sinon.assert.calledWith(dispatch, new UpdateAccount(
        {
          id: '99',
          email: 'jean.dupond@gmail.com',
          firstname: 'john',
          lastname: 'doe',
          birthday: '12/06/1976',
          creation_date: null,
          update_date: null
        },
        {
          id: '99',
          email: 'john.doe@gmail.com',
          firstname: 'john',
          lastname: 'doe',
          birthday: '12/06/1976'
        }
      ));

    })));

  it('edit account failure: email already exists', waitForAsync(inject(
    [HttpTestingController], async (http: HttpTestingController) => {

      // When change email
      const email = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Email' }));
      const emailControl = await email.getControl() as MatInputHarness;
      await emailControl.setValue('jean.dupond@gmail.com');

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
    })));

  [
    { message: 'email is required', label: 'Email', value: '', expectedMessage: 'Email is required.' },
    { message: 'email is not blank', label: 'Email', value: ' ', expectedMessage: 'Email is incorrect.' },
    { message: 'email is incorrect', label: 'Email', value: 'jean.dupond', expectedMessage: 'Email is incorrect.' },
    { message: 'lastname is required', label: 'Lastname', value: '', expectedMessage: 'Lastname is required.' },
    { message: 'lastname is not blank', label: 'Lastname', value: '  ', expectedMessage: 'Lastname is required.' },
    { message: 'firstname is required', label: 'Firstname', value: '', expectedMessage: 'Firstname is required.' },
    { message: 'firstname is not blank', label: 'Firstname', value: '  ', expectedMessage: 'Firstname is required.' }
  ].forEach(function (test) {
    it('edit account failure: ' + test.message, waitForAsync(inject(
      [HttpTestingController], async (http: HttpTestingController) => {

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

      })));
  });

  it('edit account failure: birthday is required', waitForAsync(inject(
    [HttpTestingController], async (http: HttpTestingController) => {

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

    })));

  it('reset account', waitForAsync(inject(
    [HttpTestingController], async (http: HttpTestingController) => {

      // setup change birthday
      const birthday = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Birthday' }));
      const birthdayControl = await birthday.getControl() as MatInputHarness;
      await birthdayControl.setValue('12/07/1977');

      // When perform reset
      const cancel = await loader.getHarness(MatButtonHarness.with({ selector: `[aria-label='cancel']` }));
      await cancel.click();

      // Then check email
      const email = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Email' }));
      const emailControl = await email.getControl() as MatInputHarness;
      expect(await emailControl.getValue()).to.equal('john.doe@gmail.com');

      // And check firstname
      const firstname = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Firstname' }));
      const firstnameControl = await firstname.getControl() as MatInputHarness;
      expect(await firstnameControl.getValue()).to.equal('john');

      // And check lastname
      const lastname = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Lastname' }));
      const lastnameControl = await lastname.getControl() as MatInputHarness;
      expect(await lastnameControl.getValue()).to.equal('doe');

      // And check birthday
      expect(await birthdayControl.getValue()).to.equal('12/06/1976');

      // And check save button
      const save = await loader.getHarness(MatButtonHarness.with({ selector: `[aria-label='save']` }));
      expect(await save.isDisabled()).to.be.false;

      // And check http
      http.verify();

    })));
});
