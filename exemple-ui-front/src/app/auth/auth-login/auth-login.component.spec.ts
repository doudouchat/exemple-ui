import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Navigate } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { expect } from 'chai';
import { of, throwError } from 'rxjs';
import * as sinon from 'sinon';

import { GetAccountByUsername } from '../../account/shared/account.action';
import { PublishMessage } from '../../shared/message/message.action';
import { AuthModule } from '../auth.module';
import { Authenticate } from '../shared/auth.action';
import { UnauthorizedError } from '../shared/auth.service';
import { AuthLoginComponent } from './auth-login.component';

describe('AuthLoginComponent', () => {

  let fixture: ComponentFixture<AuthLoginComponent>;
  let store: Store;

  beforeEach(waitForAsync(() => {

    fixture = TestBed.configureTestingModule({

      imports: [AuthModule, RouterTestingModule,
        NgxsModule.forRoot([])]

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
    const id = '123';
    const dispatch = sinon.stub(store, 'dispatch');
    dispatch.withArgs(new Authenticate('jean.dupond@gmail.com', 'D#az78&é')).returns(of(true));
    dispatch.withArgs(new GetAccountByUsername('jean.dupond@gmail.com')).returns(of(id));

    // when change form
    const component: AuthLoginComponent = fixture.componentInstance;
    component.authenticateForm.get('username').setValue('jean.dupond@gmail.com');
    component.authenticateForm.get('password').setValue('D#az78&é');

    fixture.detectChanges();

    fixture.debugElement.query(By.css('button[label=Login]')).nativeElement.click();

    fixture.detectChanges();

    // Then check message
    expect(dispatch.calledWith(new PublishMessage(
      { severity: 'success', summary: 'Success', detail: 'Authenticate successfull' }))).is.be.true;

    // And check navigate
    expect(dispatch.calledWith(new Navigate(['/account'], { id }))).is.be.true;

  }));

  it('authenticate failure', waitForAsync(() => {

    // setup mock store
    const dispatch = sinon.stub(store, 'dispatch');
    dispatch.withArgs(new Authenticate('jean.dupond@gmail.com', 'D#az78&é')).returns(throwError(new UnauthorizedError()));

    // when change form
    const component: AuthLoginComponent = fixture.componentInstance;
    component.authenticateForm.get('username').setValue('jean.dupond@gmail.com');
    component.authenticateForm.get('password').setValue('D#az78&é');

    fixture.detectChanges();

    fixture.debugElement.query(By.css('button[label=Login]')).nativeElement.click();

    fixture.detectChanges();

    // Then check message
    expect(dispatch.calledWith(new PublishMessage(
      { severity: 'error', summary: 'Failure', detail: 'Authenticate failure' }))).is.be.true;

  }));

  it('authenticate exception', () => {

    // setup mock store
    const dispatch = sinon.stub(store, 'dispatch');
    dispatch.withArgs(new Authenticate('jean.dupond@gmail.com', 'D#az78&é')).returns(throwError(new Error()));

    // when change form
    const component: AuthLoginComponent = fixture.componentInstance;
    component.authenticateForm.get('username').setValue('jean.dupond@gmail.com');
    component.authenticateForm.get('password').setValue('D#az78&é');

    fixture.detectChanges();

    fixture.debugElement.query(By.css('button[label=Login]')).nativeElement.click();

    fixture.detectChanges();

    // Then check message
    expect(component.login).to.throw();

  });

  const AUTHENTICATE_FAILURES = [
    { message: 'username is required', selector: 'input[formControlName=username]', value: '', event: 'input', expectedMessage: 'Username is required' },
    { message: 'username is not blank', selector: 'input[formControlName=username]', value: '  ', event: 'input', expectedMessage: 'Username is required' },
    { message: 'password is required', selector: 'input[formControlName=password]', value: '', event: 'input', expectedMessage: 'Password is required' },
    { message: 'password is not blank', selector: 'input[formControlName=password]', value: '  ', event: 'input', expectedMessage: 'Password is required' }
  ];

  AUTHENTICATE_FAILURES.forEach(function (test) {
    it('authenticate failure: ' + test.message, () => {

      // setup form
      fixture.debugElement.query(By.css(test.selector)).nativeElement.value = test.value;
      fixture.debugElement.query(By.css(test.selector)).nativeElement.dispatchEvent(new Event(test.event));
      fixture.detectChanges();

      // Then check message
      expect(fixture.debugElement.query(By.css('div.p-invalid')).nativeElement.innerHTML).contains(test.expectedMessage);

      // And check save login
      expect(fixture.debugElement.query(By.css('button[label=Login]')).nativeElement.disabled).to.be.true;


    });
  });

});
