import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Given('Go to home page', () => {
  cy.visit('/');
});

When('I do nothing', () => { });

Then('Check version is {string}', (version: string) => {
  cy.get('h4').first().contains('version:' + version);
});

Then('Message contains {string}', (message: string) => {
  cy.get('p-toast div[data-pc-section=detail]').contains(message);
});

Then('I refresh page', () => {
  cy.reload();
});
