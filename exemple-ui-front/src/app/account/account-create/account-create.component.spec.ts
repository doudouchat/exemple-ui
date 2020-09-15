import { DebugElement } from '@angular/core';
import { inject, TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';

import { AccountCreateComponent } from './account-create.component';
import { AccountModule } from '../account.module';

describe('AccountCreateComponent', () => {

  let fixture: ComponentFixture<AccountCreateComponent>;
  let debugElement: DebugElement;

  beforeEach(waitForAsync(() => {

    fixture = TestBed.configureTestingModule({

      imports: [HttpClientTestingModule, AccountModule]

    }).createComponent(AccountCreateComponent);


  }));

  beforeEach(() => {

    fixture.detectChanges();
    debugElement = fixture.debugElement;

  });

  afterEach(() => {

    TestBed.resetTestingModule();

  });

  it('account check simple', waitForAsync(inject(
    [HttpTestingController], (http) => {

      const req = http.expectOne({ method: 'HEAD', url: 'http://localhost:8080/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      req.flush({});

      http.verify();

      fixture.detectChanges();

      let de: DebugElement[];
      de = debugElement.queryAll(By.css('p'));

      expect(de[0].nativeElement.innerHTML).to.equal('account-create works!true');

    })));

  it('account check simple failure', waitForAsync(inject(
    [HttpTestingController], (http) => {

      const req = http.expectOne({ method: 'HEAD', url: 'http://localhost:8080/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      req.flush({}, { status: 404, statusText: 'not found' });

      http.verify();

      fixture.detectChanges();

      let de: DebugElement[];
      de = debugElement.queryAll(By.css('p'));

      expect(de[0].nativeElement.innerHTML).to.equal('account-create works!false');

    })));

  it.skip('account check simple error', waitForAsync(inject(
    [HttpTestingController], (http) => {

      const req = http.expectOne({ method: 'HEAD', url: 'http://localhost:8080/ExempleService/ws/v1/logins/jean.dupond@gmail.com' });
      req.flush({}, { status: 500, statusText: 'internal error' });

      http.verify();

      fixture.detectChanges();

      let de: DebugElement[];
      de = debugElement.queryAll(By.css('p'));

      expect(de[0].nativeElement.innerHTML).to.equal('account-create works!');

    })));

});
