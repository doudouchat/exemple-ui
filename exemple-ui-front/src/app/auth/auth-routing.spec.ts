import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, RouterModule, provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';

import { AnonymousGuard, AuthenticatedGuard } from './shared/auth.guard';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AUTH_ROUTES } from './auth-routing';

describe('AuthRouting', () => {

  let router: Router;
  let anonymousGuard: AnonymousGuard;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        MockComponents(AuthLoginComponent)
      ],
      imports: [RouterModule],
      providers: [
        AuthenticatedGuard,
        AnonymousGuard,
        provideStore(),
        provideRouter(AUTH_ROUTES),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    anonymousGuard = TestBed.inject(AnonymousGuard);
    Object.defineProperty(anonymousGuard, 'authState$', { writable: true });

  });

  describe('Forward login', () => {

    it('forward to login', async () => {
      // Setup authenticate
      anonymousGuard.authState$ = of({
        authenticate: false
      });

      // When forward
      await router.navigate(['']);

      // Then check router
      expect(router.url).to.equal('/');

    });

  });

});
