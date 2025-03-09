import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { NgxsModule, Store } from '@ngxs/store';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { UpdateAccount } from '../shared/account.action';
import { AccountEditComponent } from './account-edit.component';

describe('AccountEditComponent', () => {

  let fixture: ComponentFixture<AccountEditComponent>;
  let store: Store;

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

  }));

  beforeEach(() => {

    fixture.detectChanges();

  });

  afterEach(() => {

    TestBed.resetTestingModule();

  });

  it('init account', () => {

    expect(fixture.debugElement.query(By.css('input[formControlName=email]')).nativeElement.value).to.equal('john.doe@gmail.com');
    expect(fixture.debugElement.query(By.css('input[formControlName=firstname]')).nativeElement.value).to.equal('john');
    expect(fixture.debugElement.query(By.css('input[formControlName=lastname]')).nativeElement.value).to.equal('doe');
    expect(fixture.debugElement.query(By.css('p-inputMask[formControlName=birthday]>input')).nativeElement.value).to.equal('12/06/1976');

  });

  it('edit account success: birthday', waitForAsync(inject(
    [HttpTestingController], (http: HttpTestingController) => {

      // setup mock store
      const dispatch = sinon.stub(store, 'dispatch');

      // when change form
      const component: AccountEditComponent = fixture.componentInstance;
      component.accountForm.get('birthday').setValue('12/07/1977');

      fixture.detectChanges();

      fixture.debugElement.query(By.css('button[label=Save]')).nativeElement.click();

      fixture.detectChanges();

      // Then check http
      http.verify();

      expect(fixture.debugElement.query(By.css('p-inputMask[formControlName=birthday]>input')).nativeElement.value).to.equal('12/07/1977');

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
    [HttpTestingController], (http: HttpTestingController) => {

      // setup mock store
      const dispatch = sinon.stub(store, 'dispatch');

      // When change email
      const component: AccountEditComponent = fixture.componentInstance;
      component.accountForm.get('email').setValue('jean.dupond@gmail.com');

      fixture.detectChanges();

      let headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });
      headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleAuthorization/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });

      fixture.detectChanges();

      fixture.debugElement.query(By.css('button[label=Save]')).nativeElement.click();

      fixture.detectChanges();

      // Then check http
      http.verify();

      expect(fixture.debugElement.query(By.css('input[formControlName=email]')).nativeElement.value).to.equal('jean.dupond@gmail.com');

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
    [HttpTestingController], (http: HttpTestingController) => {

      // setup mock store
      const dispatch = sinon.spy(store, 'dispatch');

      // When change email
      fixture.debugElement.query(By.css('input[formControlName=email]')).nativeElement.value = 'jean.dupond@gmail.com';
      fixture.debugElement.query(By.css('input[formControlName=email]')).nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      let headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({ status: 200, statusText: 'found' });
      headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleAuthorization/ws/v1/logins/jean.dupond@gmail.com' });

      fixture.detectChanges();

      // Then check message
      expect(fixture.debugElement.query(By.css('p-message')).nativeElement.innerHTML).contains('Email already exists');

      // And check button save
      expect(fixture.debugElement.query(By.css('button[label=Save]')).nativeElement.disabled).to.be.true;

      // And check http
      http.verify();

      // And check dispatch
      sinon.assert.notCalled(dispatch);

    })));

  it('reset account', waitForAsync(inject(
    [HttpTestingController], (http: HttpTestingController) => {

      // setup mock store
      const dispatch = sinon.spy(store, 'dispatch');

      // And change form
      const component: AccountEditComponent = fixture.componentInstance;
      component.accountForm.get('birthday').setValue('12/07/1977');

      fixture.detectChanges();

      // When perform reset
      fixture.debugElement.query(By.css('button[label=Cancel]')).nativeElement.click();

      fixture.detectChanges();

      // Then check form
      expect(fixture.debugElement.query(By.css('p-inputMask[formControlName=birthday]>input')).nativeElement.value).to.equal('12/06/1976');

      // And check http
      http.verify();

      // And check dispatch
      sinon.assert.notCalled(dispatch);

    })));
});
