import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { provideStore } from '@ngxs/store';
import { MockProvider } from 'ng-mocks';

import { AnonymousGuard, AuthenticatedGuard } from './auth/shared/auth.guard';
import { AppRoutingModule } from './app-routing.module';

describe('AppRouting', () => {

  let router: Router;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        //MockComponents(HomeComponent)
      ],
      imports: [RouterModule, AppRoutingModule],
      providers: [
        provideStore(),
        MockProvider(AuthenticatedGuard),
        MockProvider(AnonymousGuard),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    router = TestBed.inject(Router);

  });

  it('forward to home', async () => {

    // When forward
    await router.navigate(['']);

    // Then check router
    expect(router.url).to.equal('/');

  });

  it('forward to login', async () => {

    // When forward
    await router.navigate(['login']);

    // Then check router
    expect(router.url).to.equal('/login');

  });

  it('forward to account', async () => {

    // When forward
    await router.navigate(['account']);

    // Then check router
    expect(router.url).to.equal('/account');

  });

});
