import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router, RouterModule, provideRouter } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { expect } from 'chai';
import { MockComponents, MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { AnonymousGuard, AuthenticatedGuard } from '../auth/shared/auth.guard';
import { AuthLoginComponent } from '../auth/auth-login/auth-login.component';
import { ACCOUNT_ROUTES } from './account-routing';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountCreateComponent } from './account-create/account-create.component';

describe('AccountRouting', () => {

  let router: Router;
  let authenticatedGuard: AuthenticatedGuard;
  let anonymousGuard: AnonymousGuard;
  let accountEditComponentFixture: ComponentFixture<AccountEditComponent>;
  let accountEditComponent: AccountEditComponent;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [
        MockComponents(AccountEditComponent, AccountCreateComponent)
      ],
      imports: [
        RouterModule,
        HttpClientTestingModule,
        NgxsModule.forRoot([])
      ],
      providers: [
        AuthenticatedGuard,
        AnonymousGuard,
        provideRouter(ACCOUNT_ROUTES.concat({
          path: 'login',
          component: MockComponent(AuthLoginComponent)
        }))
      ]
    }).compileComponents();

    accountEditComponentFixture = TestBed.createComponent(AccountEditComponent);
    accountEditComponent = accountEditComponentFixture.componentInstance;

    router = TestBed.inject(Router);
    authenticatedGuard = TestBed.inject(AuthenticatedGuard);
    Object.defineProperty(authenticatedGuard, 'authState$', { writable: true });
    anonymousGuard = TestBed.inject(AnonymousGuard);
    Object.defineProperty(anonymousGuard, 'authState$', { writable: true });

  }));

  describe('Forward edit account', () => {

    it('forward to edit account', async () => {
      // Setup authenticate
      authenticatedGuard.authState$ = of({
        authenticate: true
      });

      // When forward
      await router.navigate(['']);

      // Then check router
      expect(router.url).to.equal('/');

      // And check account
      expect(accountEditComponent.account).to.undefined;

    });

    it('forward to login', async () => {
      // Setup authenticate
      authenticatedGuard.authState$ = of({
        authenticate: false
      });

      // When forward
      await router.navigate(['']);

      // Then check router
      expect(router.url).to.equal('/login');

    });

  });

  describe('Forward create account', () => {

    it('forward to create account', async () => {
      // Setup authenticate
      anonymousGuard.authState$ = of({
        authenticate: false
      });

      //When forward
      await router.navigate(['create']);

       // Then check router
       expect(router.url).to.equal('/create');

    });

  });

});
