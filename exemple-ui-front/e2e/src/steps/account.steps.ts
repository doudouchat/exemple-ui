import { AfterAll, Before, BeforeAll, Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
import { by, element } from 'protractor';
import * as cassandra from 'cassandra-driver';

import { AppPage } from '../pages/app.po';

let page: AppPage;

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1:9042'],
    localDataCenter: 'datacenter1'
});

BeforeAll( async () => {

    await client.execute('delete from test_authorization.login where username = ?', ['jean.dupond@gmail.com']);
    await client.execute('delete from test_service.login where username = ?', ['jean.dupond@gmail.com']);
    await client.execute('delete from test_authorization.login where username = ?', ['jean.dupond@hotmail.com']);
    await client.execute('delete from test_service.login where username = ?', ['jean.dupond@hotmail.com']);
    await client.execute('insert into test_authorization.login (username) values (?)', ['jean.dupont@gmail.com']);
    await client.execute('delete from test_service.login where username = ?', ['jean.dupont@gmail.com']);
});

AfterAll(async () => {
    await client.shutdown();
});

Before(() => {
    page = new AppPage();
});

Given('Fill account email {string}', async (email: string) => {
    await element(by.css('input[formControlName=email]')).sendKeys(email);
});

Given('Fill account lastname {string}', async (lastname: string) => {
    await element(by.css('input[formControlName=lastname]')).sendKeys(lastname);
});

Given('Fill account firstname {string}', async (firstname: string) => {
    await element(by.css('input[formControlName=firstname]')).sendKeys(firstname);
});

Given('Replace account email {string}', async (email: string) => {
    await element(by.css('input[formControlName=email]')).clear();
    await element(by.css('input[formControlName=email]')).sendKeys(email);
});

Given('Replace account firstname {string}', async (firstname: string) => {
    await element(by.css('input[formControlName=firstname]')).clear();
    await element(by.css('input[formControlName=firstname]')).sendKeys(firstname);
});

Given('Fill account birthday {string}', async (birthday: string) => {
    await element(by.css('p-inputMask[formControlName=birthday]>input')).sendKeys(birthday);
});

Given('Fill account password {string}', async (password: string) => {
    await element(by.css('input[formControlName=password]')).sendKeys(password);
});

When('Go to account page', () => {
    element(by.css('a[href="#/account"]')).click();
});

When('Click button save', () => {
    element(by.css('button[label="Save"]')).click();
});

Then('Go to account creation page', () => {
    element(by.css('a[href="#/account/create"]')).click();
});

Then('I am edit page', async () => {
    await element(by.css('app-account-edit')).isPresent();
});

Then('I am creation page', async () => {
    await element(by.css('app-account-create')).isPresent();
});

Then('Error is {string}', async (message: string) => {
    expect(await element(by.css('div.p-invalid')).getText()).is.to.equal(message);
});
