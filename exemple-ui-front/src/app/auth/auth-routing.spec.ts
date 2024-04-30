import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router, RouterModule, provideRouter } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { expect } from 'chai';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';

import { AnonymousGuard, AuthenticatedGuard } from './shared/auth.guard';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AUTH_ROUTES } from './auth-routing';

describe('AuthRouting', () => {

  let router: Router;
  let anonymousGuard: AnonymousGuard;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [
        MockComponents(AuthLoginComponent)
      ],
      imports: [
        RouterModule,
        HttpClientTestingModule,
        NgxsModule.forRoot([])
      ],
      providers: [
        AuthenticatedGuard,
        AnonymousGuard,
        provideRouter(AUTH_ROUTES)
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    anonymousGuard = TestBed.inject(AnonymousGuard);
    Object.defineProperty(anonymousGuard, 'authState$', { writable: true });

  }));

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
