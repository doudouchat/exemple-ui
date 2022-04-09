import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { expect } from 'chai';
import { of } from 'rxjs';
import { AuthState } from 'src/app/auth/shared/auth.state';

import { MessageState } from '../../shared/message/message.state';
import { AccountModule } from '../account.module';
import { AccountState } from '../shared/account.state';
import { AccountEditComponent } from './account-edit.component';

describe('AccountEditComponent', () => {

  let fixture: ComponentFixture<AccountEditComponent>;
  let store: Store;

  beforeEach(waitForAsync(() => {

    fixture = TestBed.configureTestingModule({

      imports: [AccountModule, HttpClientTestingModule,
        NgxsModule.forRoot([AccountState, AuthState, MessageState])],
      providers: [{
        provide: ActivatedRoute, useValue: {
          data: of({
            account: {
              id: '99',
              email: 'john.doe@gmail.com',
              firstname: 'john',
              lastname: 'doe',
              birthday: '12/06/1976'
            }
          })
        }
      }]

    }).createComponent(AccountEditComponent);

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

      const component: AccountEditComponent = fixture.componentInstance;
      component.accountForm.get('birthday').setValue('12/06/1977');

      fixture.detectChanges();

      fixture.debugElement.query(By.css('button[label=Save]')).nativeElement.click();

      fixture.detectChanges();

      const accountPatch = http.expectOne({ method: 'PATCH', url: '/ExempleService/ws/v1/accounts/99' });
      accountPatch.flush({}, { status: 200, statusText: 'ok' });
      http.verify();

      expect(store.selectSnapshot(state => state.messages.severity)).is.be.eq('success');
      expect(store.selectSnapshot(state => state.account.email)).is.be.eq('john.doe@gmail.com');
      expect(store.selectSnapshot(state => state.account.birthday)).is.be.eq('1977-06-12');

    })));

  it('edit account success: email', waitForAsync(inject(
    [HttpTestingController], (http: HttpTestingController) => {

      const component: AccountEditComponent = fixture.componentInstance;
      component.accountForm.get('email').setValue('jean.dupond@gmail.com');

      fixture.detectChanges();

      let headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });
      headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleAuthorization/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({}, { status: 404, statusText: 'not found' });
      http.verify();

      fixture.detectChanges();

      fixture.debugElement.query(By.css('button[label=Save]')).nativeElement.click();

      fixture.detectChanges();

      const accountPatch = http.expectOne({ method: 'PATCH', url: '/ExempleService/ws/v1/accounts/99' });
      accountPatch.flush({}, { status: 204, statusText: 'ok' });
      const loginAuthorizationCopy = http.expectOne({ method: 'POST', url: '/ExempleAuthorization/ws/v1/logins/move' });
      loginAuthorizationCopy.flush({}, { status: 201, statusText: 'ok' });
      http.verify();

      expect(store.selectSnapshot(state => state.messages.severity)).is.be.eq('success');
      expect(store.selectSnapshot(state => state.account.email)).is.be.eq('jean.dupond@gmail.com');
      expect(store.selectSnapshot(state => state.authenticate.authenticate)).is.be.false;
      expect(store.selectSnapshot(state => state.authenticate.username)).is.be.undefined;

    })));

  it('edit account failure: email already exists', waitForAsync(inject(
    [HttpTestingController], (http: HttpTestingController) => {

      fixture.detectChanges();

      fixture.debugElement.query(By.css('input[formControlName=email]')).nativeElement.value = 'jean.dupond@gmail.com';
      fixture.debugElement.query(By.css('input[formControlName=email]')).nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      let headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      headLogin.flush({ status: 200, statusText: 'found' });
      headLogin = http.expectOne({ method: 'HEAD', url: '/ExempleAuthorization/ws/v1/logins/jean.dupond@gmail.com' });
      http.verify();

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('div.p-invalid')).nativeElement.innerHTML).contains('Email already exists');
      expect(fixture.debugElement.query(By.css('button[label=Save]')).nativeElement.disabled).to.be.true;

      http.expectNone({ method: 'PATCH', url: '/ExempleService/ws/v1/accounts/99' });
      http.verify();

      expect(store.selectSnapshot(state => state.account)).is.be.empty;

    })));

  it('reset account', waitForAsync(() => {

    const component: AccountEditComponent = fixture.componentInstance;
    component.accountForm.get('email').setValue('jean.dupond@gmail.com');

    fixture.detectChanges();

    fixture.debugElement.query(By.css('button[label=Cancel]')).nativeElement.click();

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('input[formControlName=email]')).nativeElement.value).to.equal('john.doe@gmail.com');

  }));
});
