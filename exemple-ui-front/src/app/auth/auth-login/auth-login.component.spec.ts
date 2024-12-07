import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { NgxsModule, Store } from '@ngxs/store';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { Authenticate } from '../shared/auth.action';
import { AuthLoginComponent } from './auth-login.component';
import { RouterModule } from '@angular/router';

describe('AuthLoginComponent', () => {

  let fixture: ComponentFixture<AuthLoginComponent>;
  let store: Store;

  beforeEach(waitForAsync(() => {

    fixture = TestBed.configureTestingModule({

      imports: [
        NoopAnimationsModule,
        RouterModule.forRoot([]),
        NgxsModule.forRoot([])
      ]

    }).createComponent(AuthLoginComponent);

    store = TestBed.inject(Store);

  }));

  beforeEach(() => {

    fixture.detectChanges();

  });

  afterEach(() => {

    TestBed.resetTestingModule();

  });

  it('authenticate success', waitForAsync(() => {

    // setup mock store
    const dispatch = sinon.stub(store, 'dispatch');

    // when change form
    const component: AuthLoginComponent = fixture.componentInstance;
    component.authenticateForm.get('username').setValue('jean.dupond@gmail.com');
    component.authenticateForm.get('password').setValue('D#az78&é');

    fixture.detectChanges();

    fixture.debugElement.query(By.css('button[label=Login]')).nativeElement.click();

    fixture.detectChanges();

    // Then check dispatch
    sinon.assert.calledWith(dispatch, new Authenticate('jean.dupond@gmail.com', 'D#az78&é'));

  }));

  [
    { message: 'username is required', selector: 'input[formControlName=username]', value: '', event: 'input', expectedMessage: 'Username is required' },
    { message: 'username is not blank', selector: 'input[formControlName=username]', value: '  ', event: 'input', expectedMessage: 'Username is required' },
    { message: 'password is required', selector: 'input[formControlName=password]', value: '', event: 'input', expectedMessage: 'Password is required' },
    { message: 'password is not blank', selector: 'input[formControlName=password]', value: '  ', event: 'input', expectedMessage: 'Password is required' }
  ].forEach(function (test) {
    it('authenticate failure: ' + test.message, () => {

      // setup form
      fixture.debugElement.query(By.css(test.selector)).nativeElement.value = test.value;
      fixture.debugElement.query(By.css(test.selector)).nativeElement.dispatchEvent(new Event(test.event));
      fixture.detectChanges();

      // Then check message
      expect(fixture.debugElement.query(By.css('p-message')).nativeElement.innerHTML).contains(test.expectedMessage);

      // And check save login
      expect(fixture.debugElement.query(By.css('button[label=Login]')).nativeElement.disabled).to.be.true;


    });
  });

});
