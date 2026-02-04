import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { AppComponent } from './app.component';
import { appConfig } from './app.config';
import { PublishMessage } from './shared/message/message.action';

@Component({
  template: '<h6>dummy</h6>'
})
class DummyComponent { }

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let mock: ComponentFixture<DummyComponent>;
  let store: Store;
  let snackBar: MatSnackBar;

  before(() => window.localStorage.clear());

  beforeEach(waitForAsync(() => {

    fixture = TestBed.configureTestingModule({
      imports: [
        AppComponent,
        NoopAnimationsModule,
        DummyComponent,
        RouterModule.forRoot([{ path: '', component: DummyComponent }])
      ],
      providers: appConfig.providers.concat([
        provideHttpClientTesting(), { provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }],
      )
    }).createComponent(AppComponent);

    mock = TestBed.createComponent(DummyComponent);
    store = TestBed.inject(Store);
    snackBar = TestBed.inject(MatSnackBar);
    store.reset({
      authenticate: { authenticate: true, username: 'john.doe@gmail.com' }
    });

  }));

  describe('Forward to any template', () => {

    it('routing should have as template dummy', waitForAsync(inject(
      [HttpTestingController], (http) => {

        // Setup authenticate
        const req = http.expectOne({ method: 'POST', url: '/ExempleAuthorization/oauth/token' });
        req.flush({
          expires_in: 300
        });
        http.expectNone({ method: 'GET', url: '/ExempleService/ws/v1/logins/john.doe@gmail.com' });
        http.verify();

        fixture.detectChanges();

        // Then check state
        expect(store.selectSnapshot(state => state.application)).is.be.true;

        mock.detectChanges();

        // And check dummy
        const de: DebugElement[] = mock.debugElement.queryAll(By.css('h6'));
        expect(de[0].nativeElement.innerHTML).to.equal('dummy');

      })));

    it('routing should have as template dummy refresh', waitForAsync(inject(
      [HttpTestingController], (http) => {

        // Setup authenticate
        http.expectNone({ method: 'POST', url: '/ExempleAuthorization/oauth/token' });
        const getLogin = http.expectOne({ method: 'GET', url: '/ExempleService/ws/v1/logins/john.doe@gmail.com' });
        getLogin.flush(99);
        const getAccount = http.expectOne({ method: 'GET', url: '/ExempleService/ws/v1/accounts/99' });
        getAccount.flush({
          firstname: 'john',
          lastname: 'doe'
        });
        http.verify();

        fixture.detectChanges();

        // Then check state
        expect(store.selectSnapshot(state => state.application)).is.be.undefined;
        expect(store.selectSnapshot(state => state.authenticate.authenticate)).is.be.true;
        expect(store.selectSnapshot(state => state.authenticate.username)).is.be.eq('john.doe@gmail.com');

        mock.detectChanges();

        // And check dummy
        const de: DebugElement[] = mock.debugElement.queryAll(By.css('h6'));
        expect(de[0].nativeElement.innerHTML).to.equal('dummy');

      })));

    it('routing should have as template dummy refresh exception', waitForAsync(inject(
      [HttpTestingController], (http) => {

        // Setup authenticate
        http.expectNone({ method: 'POST', url: '/ExempleAuthorization/oauth/token' });
        const getLogin = http.expectOne({ method: 'GET', url: '/ExempleService/ws/v1/logins/john.doe@gmail.com' });
        getLogin.flush({}, { status: 403, statusText: 'access is forbidden' });
        http.expectNone({ method: 'GET', url: '/ExempleService/ws/v1/accounts/99' });
        http.verify();

        fixture.detectChanges();

        // Then check state
        expect(store.selectSnapshot(state => state.application)).is.be.undefined;
        expect(store.selectSnapshot(state => state.authenticate.authenticate)).is.be.false;
        expect(store.selectSnapshot(state => state.authenticate.username)).is.be.undefined;

        mock.detectChanges();

        // And check dummy
        const de: DebugElement[] = mock.debugElement.queryAll(By.css('h6'));
        expect(de[0].nativeElement.innerHTML).to.equal('dummy');

      })));

  });

  describe('Display message', () => {

    it('should display one message', async () => {

      // setup snackBar
      const open = sinon.spy(snackBar, 'open');

      // when dispatch
      store.dispatch(new PublishMessage({ detail: 'message detail', severity: 'info', summary: 'message summary' }));

      fixture.detectChanges();

      // Then check message
      sinon.assert.calledWith(open, sinon.match('message detail'));
    });

  });

});
