import { DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';

import { AccountEditComponent } from './account-edit.component';
import { AccountModule } from '../account.module';

describe('AccountEditComponent', () => {

  let fixture: ComponentFixture<AccountEditComponent>;

  beforeEach(waitForAsync(() => {

    fixture = TestBed.configureTestingModule({

      imports: [AccountModule]

    }).createComponent(AccountEditComponent);


  }));

  afterEach(() => {

    TestBed.resetTestingModule();

  });

  it('account edit simple', waitForAsync(() => {

    fixture.detectChanges();

    let de: DebugElement[];
    de = fixture.debugElement.queryAll(By.css('p'));

    expect(de[0].nativeElement.innerHTML).to.equal('account-edit works!');

  }));
});
