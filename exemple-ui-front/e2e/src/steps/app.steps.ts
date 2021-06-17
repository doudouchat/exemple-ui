import { Before, Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
import { browser, by, element } from 'protractor';

import { AppPage } from '../pages/app.po';

let page: AppPage;

Before(() => {
    page = new AppPage();
});

Given('Go to home page', async () => {
    await browser.restart();
    await page.navigateTo();
});

When('I do nothing', () => { });

Then('Check version is {string}', async (version: string) => {
    expect(await element.all(by.css('h4')).first().getText()).to.equal('version:' + version);
});

Then('Message contains {string}', async (message: string) => {
    await element(by.css('p-toastitem')).isPresent();
    await browser.sleep(1000);
    expect(await element(by.css('p-toast>div')).getText()).to.contain(message);
});

Then('I refresh page', async () => {
    await browser.refresh();
});
