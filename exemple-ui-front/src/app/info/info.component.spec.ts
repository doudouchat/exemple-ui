import { DebugElement } from '@angular/core';
import { async, inject, TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';

import { InfoModule } from './info.module';
import { InfoComponent } from './info.component';

describe('test', () => {

    let fixture: ComponentFixture<InfoComponent>;
    let debugElement: DebugElement;

    beforeEach(async(() => {

        fixture = TestBed.configureTestingModule({

            imports: [HttpClientTestingModule, InfoModule]

        }).createComponent(InfoComponent);


    }));

    beforeEach(() => {

        fixture.detectChanges();
        debugElement = fixture.debugElement;

    });

    afterEach(() => {

        TestBed.resetTestingModule();

    });

    it('home success', async(inject(
        [HttpTestingController], (http) => {

            const req = http.expectOne('http://localhost:8080/ExempleService/actuator/info');
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
