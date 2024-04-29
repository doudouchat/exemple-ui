import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { expect } from 'chai';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

@Component({
  template: '<h6>dummy</h6>'
})
class DummyComponent { }

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let mock: ComponentFixture<DummyComponent>;
  let store: Store;

  before(() => window.localStorage.clear());

  beforeEach(waitForAsync(() => {

    fixture = TestBed.configureTestingModule({

      imports: [
        AppModule,
        HttpClientTestingModule,
        RouterModule.forRoot(
          [{ path: '', component: DummyComponent }])
      ],
      declarations: [DummyComponent]

    }).createComponent(AppComponent);

    mock = TestBed.createComponent(DummyComponent);
    store = TestBed.inject(Store);
    store.reset({
      authenticate: { authenticate: true, username: 'john.doe@gmail.com' }
    });

  }));

  afterEach(() => {

    TestBed.resetTestingModule();

  });

  it('routing should have as template dummy', waitForAsync(inject(
    [HttpTestingController], (http) => {

      const req = http.expectOne({ method: 'POST', url: '/ExempleAuthorization/oauth/token' });
      req.flush({
        expires_in: 300
      });
      http.expectNone({ method: 'GET', url: '/ExempleService/ws/v1/logins/john.doe@gmail.com' });
      http.verify();

      fixture.detectChanges();

      expect(store.selectSnapshot(state => state.application)).is.be.true;

      mock.detectChanges();

      mock.whenStable().then(() => {

        mock.detectChanges();
        const de: DebugElement[] = mock.debugElement.queryAll(By.css('h6'));

        expect(de[0].nativeElement.innerHTML).to.equal('dummy');

      });

    })));

  it('routing should have as template dummy refresh', waitForAsync(inject(
    [HttpTestingController], (http) => {

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

      expect(store.selectSnapshot(state => state.application)).is.be.undefined;
      expect(store.selectSnapshot(state => state.authenticate.authenticate)).is.be.true;
      expect(store.selectSnapshot(state => state.authenticate.username)).is.be.eq('john.doe@gmail.com');

      mock.detectChanges();

      mock.whenStable().then(() => {

        mock.detectChanges();
        const de: DebugElement[] = mock.debugElement.queryAll(By.css('h6'));

        expect(de[0].nativeElement.innerHTML).to.equal('dummy');

      });

    })));

  it('routing should have as template dummy refresh exception', waitForAsync(inject(
    [HttpTestingController], (http) => {

      http.expectNone({ method: 'POST', url: '/ExempleAuthorization/oauth/token' });
      const getLogin = http.expectOne({ method: 'GET', url: '/ExempleService/ws/v1/logins/john.doe@gmail.com' });
      getLogin.flush({}, { status: 403, statusText: 'access is forbidden' });
      http.expectNone({ method: 'GET', url: '/ExempleService/ws/v1/accounts/99' });
      http.verify();

      fixture.detectChanges();

      expect(store.selectSnapshot(state => state.application)).is.be.undefined;
      expect(store.selectSnapshot(state => state.authenticate.authenticate)).is.be.false;
      expect(store.selectSnapshot(state => state.authenticate.username)).is.be.undefined;

      mock.detectChanges();

      mock.whenStable().then(() => {

        mock.detectChanges();
        const de: DebugElement[] = mock.debugElement.queryAll(By.css('h6'));

        expect(de[0].nativeElement.innerHTML).to.equal('dummy');

      });

    })));

});
