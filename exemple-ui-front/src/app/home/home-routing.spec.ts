import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router, RouterModule, provideRouter } from '@angular/router';
import { expect } from 'chai';
import { MockComponents } from 'ng-mocks';

import { HOME_ROUTES } from './home-routing';
import { HomeComponent } from './home.component';

describe('HomeRouting', () => {

  let router: Router;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [
        MockComponents(HomeComponent)
      ],
      imports: [
        RouterModule
      ],
      providers: [
        provideRouter(HOME_ROUTES)
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

});
