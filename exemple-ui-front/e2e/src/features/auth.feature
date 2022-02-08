Feature: Authentication

  Scenario: Go to home page
    Given Go to home page
    When I do nothing
    Then Check version is '3.0.0-SNAPSHOT'

  Scenario: Connect account fails
    Given Go to account page
    And I am connection page
    And Fill authenticate username 'jean.dupont@gmail.com'
    And Fill authenticate password '124'
    When Click button login
    Then Message contains 'Authenticate failure'

  Scenario: Connect account success
    Given I am connection page
    And I refresh page
    And Fill authenticate username 'jean.dupont@gmail.com'
    And Fill authenticate password '123'
    When Click button login
    Then Message contains 'Authenticate success'