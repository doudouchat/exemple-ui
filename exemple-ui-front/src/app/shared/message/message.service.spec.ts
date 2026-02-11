import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as sinon from 'sinon';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from './message.service';

@Component({
  selector: 'app-test',
  template: 'snack-bar-harness-example.html',
})
export class TestExample {

  readonly messageService = inject(MessageService);
}

describe('MessageService', () => {
  let fixture: ComponentFixture<TestExample>;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({})
      .createComponent(TestExample);

    snackBar = TestBed.inject(MatSnackBar);
  });

  describe('Display message', () => {

    it('should display one info message', async () => {

      // setup snackBar
      const open = sinon.spy(snackBar, 'open');

      // when dispatch
      fixture.componentInstance.messageService.info('message title', 'message detail');

      fixture.detectChanges();

      // Then check message
      sinon.assert.calledWith(open, sinon.match('message detail'));
    });

    it('should display one success message', async () => {

      // setup snackBar
      const open = sinon.spy(snackBar, 'open');

      // when dispatch
      fixture.componentInstance.messageService.success('message title', 'message detail');

      fixture.detectChanges();

      // Then check message
      sinon.assert.calledWith(open, sinon.match('message detail'));
    });

    it('should display one error message', async () => {

      // setup snackBar
      const open = sinon.spy(snackBar, 'open');

      // when dispatch
      fixture.componentInstance.messageService.error('message title', 'message detail');

      fixture.detectChanges();

      // Then check message
      sinon.assert.calledWith(open, sinon.match('message detail'));
    });

  });
});
