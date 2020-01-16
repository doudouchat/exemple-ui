import { DebugElement } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from 'chai';

import { AuthLoginComponent } from './auth-login.component';
import { AuthModule } from '../auth.module';

describe('AuthLoginComponent', () => {

  let fixture: ComponentFixture<AuthLoginComponent>;

  beforeEach(async(() => {

    fixture = TestBed.configureTestingModule({

      imports: [AuthModule, RouterTestingModule]

    }).createComponent(AuthLoginComponent);


  }));

  afterEach(() => {

    TestBed.resetTestingModule();

  });

  it('auth check simple', async(() => {

    fixture.detectChanges();

    let de: DebugElement[];
    de = fixture.debugElement.queryAll(By.css('p'));

    expect(de[0].nativeElement.innerHTML).to.equal('auth-login works!');

  }));
});
