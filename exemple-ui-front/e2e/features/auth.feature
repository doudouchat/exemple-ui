Feature: Authentication

  Background:
    Given Create username 'jean.dupont@gmail.com'

  Scenario: Connect account fails
    Given Go to home page
    And Go to account page
    And I am connection page
    When Fill authenticate username 'jean.dupont@gmail.com'
    And Fill authenticate password '124'
    When Click button login
    Then Message contains 'Authenticate failure'

  Scenario: Connect account success
    Given Go to home page
    And Go to account page
    And I am connection page
    When Fill authenticate username 'jean.dupont@gmail.com'
    And Fill authenticate password '123'
    And Click button login
    Then Message contains 'Authenticate success'