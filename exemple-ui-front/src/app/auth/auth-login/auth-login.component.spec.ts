import { DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from 'chai';

import { AuthLoginComponent } from './auth-login.component';
import { AuthModule } from '../auth.module';

describe('AuthLoginComponent', () => {

  let fixture: ComponentFixture<AuthLoginComponent>;

  beforeEach(waitForAsync(() => {

    fixture = TestBed.configureTestingModule({

      imports: [AuthModule, RouterTestingModule]

    }).createComponent(AuthLoginComponent);


  }));

  afterEach(() => {

    TestBed.resetTestingModule();

  });

  it('auth check simple', waitForAsync(() => {

    fixture.detectChanges();

    let de: DebugElement[];
    de = fixture.debugElement.queryAll(By.css('p'));

    expect(de[0].nativeElement.innerHTML).to.equal('auth-login works!');

  }));
});
