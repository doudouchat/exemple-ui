import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Given('Fill authenticate username {string}', (username: string) => {
  cy.get('input[formControlName=username]').type(username);
});

Given('Fill authenticate password {string}', (password: string) => {
  cy.get('input[formControlName=password]').type(password);
});

When('Click button login', () => {
  cy.get('button[label="Login"]').click();
});

Then('I am connection page', () => {
  cy.get('app-auth-login').should('exist');
});
