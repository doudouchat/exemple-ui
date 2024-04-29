import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { expect } from 'chai';

import { HomeComponent } from './home.component';

@Component({
  template: '<h6>dummy</h6>',
  standalone: true
})
class DummyComponent {
}

describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let mock: ComponentFixture<DummyComponent>;

  beforeEach(waitForAsync(() => {

    fixture = TestBed.configureTestingModule({

      imports: [
        DummyComponent,
        HttpClientTestingModule,
        RouterModule.forRoot(
          [{ path: 'account', component: DummyComponent }])
      ]

    }).createComponent(HomeComponent);
    mock = TestBed.createComponent(DummyComponent);

  }));

  afterEach(() => {

    TestBed.resetTestingModule();

  });

  it('home should have as title "exemple-ui"', waitForAsync(() => {

    fixture.detectChanges();

    const de: DebugElement[] = fixture.debugElement.queryAll(By.css('h1'));

    expect(de[0].nativeElement.innerHTML).to.equal(' Welcome to exemple-ui! ');

  }));

  it('home have link to account', waitForAsync(() => {

    fixture.detectChanges();

    // When click link
    const link: DebugElement = fixture.debugElement.query(By.css('a[routerLink="/account"]'));
    link.nativeElement.click();

    // Then check content
    const de: DebugElement[] = mock.debugElement.queryAll(By.css('h6'));
    expect(de[0].nativeElement.innerHTML).to.equal('dummy');

  }));

});
