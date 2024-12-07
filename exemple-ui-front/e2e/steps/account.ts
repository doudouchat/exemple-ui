import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Given('Delete username {string}', (username: string) => {
    cy.task('deleteLogin', username);
    cy.task('deleteAccountUsername', username);
});

Given('Create username {string}', (username: string) => {
    cy.task('deleteLogin', username);
    cy.task('deleteAccountUsername', username);
    cy.task('insertLogin', username);
    cy.task('insertPassword', username);
});

Given('Fill account email {string}', (email: string) => {
    cy.get('input[formControlName=email]').type(email);
});

Given('Fill account lastname {string}', (lastname: string) => {
    cy.get('input[formControlName=lastname]').type(lastname);
});

Given('Fill account firstname {string}', (firstname: string) => {
    cy.get('input[formControlName=firstname]').type(firstname);
});

Given('Replace account email {string}', (email: string) => {
    cy.get('input[formControlName=email]').clear();
    cy.get('input[formControlName=email]').type(email);
});

Given('Replace account firstname {string}', (firstname: string) => {
    cy.get('input[formControlName=firstname]').clear();
    cy.get('[formControlName=firstname]').type(firstname);
});

Given('Fill account birthday {string}', (birthday: string) => {
    cy.get('p-inputMask[formControlName=birthday]>input').type(birthday);
});

Given('Fill account password {string}', (password: string) => {
    cy.get('input[formControlName=password]').type(password);
});

When('Go to account page', () => {
    cy.get('a[href="#/account"]').click();
});

When('Click button save', () => {
    cy.get('button[label="Save"]').click();
});

Then('Go to account creation page', () => {
    cy.get('a[href="#/account/create"]').click();
});

Then('I am edit page', () => {
    cy.get('app-account-edit').should('exist');
});

Then('I am creation page', () => {
    cy.get('app-account-create').should('exist');
});

Then('Error is {string}', (message: string) => {
    cy.get('p-message').contains(message);
});
