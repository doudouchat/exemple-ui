import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatSnackBarHarness } from '@angular/material/snack-bar/testing';
import { expect } from 'chai';

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
  let loader: HarnessLoader;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({})
      .createComponent(TestExample);

    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  describe('Display message', () => {

    it('should display one info message', async () => {

      // When publish
      fixture.componentInstance.messageService.info('message title>', 'message detail');

      // Then check message
      const infoMessage = await loader.getHarness(MatSnackBarHarness);
      expect(await infoMessage.getMessage()).to.be.equal('message title>message detail');

      // And close message
      const closeButton = await loader.getHarness(MatButtonHarness);
      await closeButton.click();
      expect(await infoMessage.isDismissed()).to.be.true;
    });

    it('should display one success message', async () => {

      // When publish
      fixture.componentInstance.messageService.success('message title>', 'message detail');

      // Then check message
      const successMessage = await loader.getHarness(MatSnackBarHarness);
      expect(await successMessage.getMessage()).to.be.equal('message title>message detail');

      // And close message
      const closeButton = await loader.getHarness(MatButtonHarness);
      await closeButton.click();
      expect(await successMessage.isDismissed()).to.be.true;

    });

    it('should display one error message', async () => {

      // When publish
      fixture.componentInstance.messageService.error('message title>', 'message detail');

      // Then check message
      const errorMessage = await loader.getHarness(MatSnackBarHarness);
      expect(await errorMessage.getMessage()).to.be.equal('message title>message detail');

      // And close message
      const closeButton = await loader.getHarness(MatButtonHarness);
      await closeButton.click();
      expect(await errorMessage.isDismissed()).to.be.true;
    });

  });
});
