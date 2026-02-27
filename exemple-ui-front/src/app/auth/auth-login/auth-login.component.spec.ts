import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { RouterModule } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';

import { Authenticate } from '../shared/auth.action';
import { AuthLoginComponent } from './auth-login.component';

describe('AuthLoginComponent', () => {

  let fixture: ComponentFixture<AuthLoginComponent>;
  let store: Store;
  let loader: HarnessLoader;

  beforeEach(() => {

    fixture = TestBed.configureTestingModule({

      imports: [
        RouterModule.forRoot([]),
        NgxsModule.forRoot([])
      ]

    }).createComponent(AuthLoginComponent);

    store = TestBed.inject(Store);
    loader = TestbedHarnessEnvironment.loader(fixture);

  });

  it('authenticate success', async () => {

    // setup mock store
    const dispatch = vi.spyOn(store, 'dispatch');

    // when edit username
    const username = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Username' }));
    const usernameControl = await username.getControl() as MatInputHarness;
    await usernameControl.setValue('jean.dupond@gmail.com');

    // And edit password
    const password = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Password' }));
    const passwordControl = await password.getControl() as MatInputHarness;
    await passwordControl.setValue('D#az78&é');

    // And perform
    const connexion = await loader.getHarness(MatButtonHarness.with({ selector: `[aria-label='connexion']` }));
    await connexion.click();

    // Then check dispatch
    expect(dispatch).toHaveBeenCalledWith(new Authenticate('jean.dupond@gmail.com', 'D#az78&é'));

  });

  [
    { message: 'username is required', label: 'Username', value: '', expectedMessage: 'Username is required.' },
    { message: 'username is not blank', label: 'Username', value: '  ', expectedMessage: 'Username is required.' },
    { message: 'password is required', label: 'Password', value: '', expectedMessage: 'Password is required.' },
    { message: 'password is not blank', label: 'Password', value: '  ', expectedMessage: 'Password is required.' }
  ].forEach(function (test) {
    it('authenticate failure: ' + test.message, async () => {

      // When edit field
      const formField = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: test.label }));
      const fieldControl = await formField.getControl() as MatInputHarness;
      await fieldControl.setValue(test.value);

      // Then check message
      const errors = await formField.getTextErrors();
      expect(errors).contains(test.expectedMessage);

      // And check save login
      const connexion = await loader.getHarness(MatButtonHarness.with({ selector: `[aria-label='connexion']` }));
      expect(await connexion.isDisabled()).to.be.true;


    });
  });

});
