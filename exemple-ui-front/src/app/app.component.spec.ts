import { Component, DebugElement } from '@angular/core';
import { async, inject, TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { expect } from 'chai';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@Component({
    template: '<h6>dummy</h6>'
})
class DummyComponent { }

describe('AppComponent', () => {

    let fixture: ComponentFixture<AppComponent>;
    let mock: ComponentFixture<DummyComponent>;

    beforeEach(async(() => {

        fixture = TestBed.configureTestingModule({

            imports: [AppModule, HttpClientTestingModule, RouterTestingModule.withRoutes(
                [{ path: '', component: DummyComponent }])],
            declarations: [DummyComponent]

        }).createComponent(AppComponent);

        mock = TestBed.createComponent(DummyComponent);

    }));

    afterEach(() => {

        TestBed.resetTestingModule();

    });

    it('routing should have as template dummy', async(inject(
        [HttpTestingController], (http) => {

            const req = http.expectOne({ method: 'POST', url: 'http://localhost:8080/ExempleAuthorization/oauth/token' });
            req.flush({
                expires_in: 300
            });

            http.verify();

            fixture.detectChanges();

            mock.detectChanges();

            mock.whenStable().then(() => {

                mock.detectChanges();
                let de: DebugElement[];
                de = mock.debugElement.queryAll(By.css('h6'));

                expect(de[0].nativeElement.innerHTML).to.equal('dummy');

            });

        })));

});
