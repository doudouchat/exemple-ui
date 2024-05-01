import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router, RouterModule, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { expect } from 'chai';
import { MockComponents, MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { AnonymousGuard, AuthenticatedGuard } from '../auth/shared/auth.guard';
import { AuthLoginComponent } from '../auth/auth-login/auth-login.component';
import { AccountResolver } from './shared/account.resolver';
import { ACCOUNT_ROUTES } from './account-routing';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountCreateComponent } from './account-create/account-create.component';

describe('AccountRouting', () => {

  let router: Router;
  let accountResolver: AccountResolver;
  let authenticatedGuard: AuthenticatedGuard;
  let anonymousGuard: AnonymousGuard;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [
        MockComponents(AccountEditComponent, AccountCreateComponent),
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
        }), withComponentInputBinding())
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    accountResolver = TestBed.inject(AccountResolver);
    Object.defineProperty(accountResolver, 'accountState$', { writable: true });
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

      // And resolver
      accountResolver.accountState$ = of({
        id: '123'
      });

      // When forward
      const routerHarness = await RouterTestingHarness.create();
      const activatedComponent = await routerHarness.navigateByUrl('', AccountEditComponent);

      // Then check router
      expect(router.url).to.equal('/');

      // And check account
      expect(activatedComponent.account).to.eql({
        id: '123'
      })

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
