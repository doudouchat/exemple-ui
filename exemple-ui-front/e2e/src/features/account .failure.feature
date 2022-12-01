Feature: Account creation fails

  Scenario: Go to home page
    Given Go to home page
    When I do nothing
    Then Check version is '4.0.0-SNAPSHOT'

  Scenario: Go to creation
    When Go to account page
    Then I am connection page
    And Go to account creation page
    And I am creation page

  Scenario: Create account fails because email already exists
    When Fill account email 'jean.dupont@gmail.com'
    Then Error is 'Email already exists.'