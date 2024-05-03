import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { expect } from 'chai';
import { MockProvider } from 'ng-mocks';

import { AnonymousGuard, AuthenticatedGuard } from './auth/shared/auth.guard';
import { AppRoutingModule } from './app-routing.module';

describe('AppRouting', () => {

  let router: Router;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [
        //MockComponents(HomeComponent)
      ],
      imports: [
        RouterModule,
        AppRoutingModule,
        HttpClientTestingModule,
        NgxsModule.forRoot([])
      ],
      providers: [
        MockProvider(AuthenticatedGuard),
        MockProvider(AnonymousGuard)
      ]
    }).compileComponents();

    router = TestBed.inject(Router);

  }));

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
