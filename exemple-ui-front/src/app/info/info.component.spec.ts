import { DebugElement } from '@angular/core';
import { inject, TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';

import { InfoComponent } from './info.component';

describe('InfoComponent', () => {

  let fixture: ComponentFixture<InfoComponent>;
  let debugElement: DebugElement;

  beforeEach(waitForAsync(() => {

    fixture = TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).createComponent(InfoComponent);


  }));

  beforeEach(() => {

    fixture.detectChanges();
    debugElement = fixture.debugElement;

  });

  afterEach(() => {

    TestBed.resetTestingModule();

  });

  it('display info', waitForAsync(inject(
    [HttpTestingController], (http) => {

      const req = http.expectOne('/ExempleService/actuator/info');
      req.flush({
        version: 'test',
        buildTime: '1976-01-03'
      });

      http.verify();

      fixture.detectChanges();

      const de: DebugElement[] = debugElement.queryAll(By.css('h4'));

      expect(de[0].nativeElement.innerHTML).to.equal('version:test');
      expect(de[1].nativeElement.innerHTML).to.equal('buildTime:1976-01-03');

    })));

});
