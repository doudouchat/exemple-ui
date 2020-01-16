import { DebugElement } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';

import { AccountEditComponent } from './account-edit.component';
import { AccountModule } from '../account.module';

describe('AccountEditComponent', () => {

  let fixture: ComponentFixture<AccountEditComponent>;

  beforeEach(async(() => {

    fixture = TestBed.configureTestingModule({

      imports: [AccountModule]

    }).createComponent(AccountEditComponent);


  }));

  afterEach(() => {

    TestBed.resetTestingModule();

  });

  it('account edit simple', async(() => {

    fixture.detectChanges();

    let de: DebugElement[];
    de = fixture.debugElement.queryAll(By.css('p'));

    expect(de[0].nativeElement.innerHTML).to.equal('account-edit works!');

  }));
});
