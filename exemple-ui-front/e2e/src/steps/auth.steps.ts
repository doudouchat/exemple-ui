import { Before, BeforeAll, Given, Then, When } from '@cucumber/cucumber';
import { by, element } from 'protractor';
import * as cassandra from 'cassandra-driver';

import { AppPage } from '../pages/app.po';

let page: AppPage;

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1:9042'],
    localDataCenter: 'datacenter1'
});

BeforeAll(() => {

    client.execute('insert into test_authorization.login (username, password) values (?, ?)', ['jean.dupont@gmail.com',
        '{bcrypt}$2a$10$Kd7BZwLmFIfoYDttqaJ6V.Lsp4xe31Qc9ha/gBYFGYgnAMvY758vm']);
});


Before(() => {
    page = new AppPage();
});

Given('Fill authenticate username {string}', async (username: string) => {
    await element(by.css('input[formControlName=username]')).sendKeys(username);
});

Given('Fill authenticate password {string}', async (password: string) => {
    await element(by.css('input[formControlName=password]')).sendKeys(password);
});

When('Click button login', () => {
    element(by.css('button[label="Login"]')).click();
});

Then('I am connection page', async () => {
    await element(by.css('app-auth-login')).isPresent();
});
