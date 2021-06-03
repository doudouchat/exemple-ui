Feature: Account creation

  Scenario: Go to home page
    Given Go to home page
    When I do nothing
    Then Check version is '2.0.0-SNAPSHOT'

  Scenario: Go to creation
    When Go to account page
    Then I am connection page
    And Go to account creation page
    And I am creation page

  Scenario: Create account
    Given Fill account email 'jean.dupond@gmail.com'
    And Fill account lastname 'dupond'
    And Fill account firstname 'pierre'
    And Fill account birthday '12/12/1976'
    And Fill account password '123'
    When Click button save
    Then Message contains 'Account creation successfull'

  Scenario: Connect account
    Given I am connection page
    And Fill authenticate username 'jean.dupond@gmail.com'
    And Fill authenticate password '123'
    When Click button login
    Then Message contains 'Authenticate successfull'
    And Message contains 'Account access successfull'

  Scenario: Edit account
    Given I am edit page
    And Replace account firstname 'jean'
    When Click button save
    Then Message contains 'Account update successfull'

  Scenario: Change username
    Given I am edit page
    And Replace account email 'jean.dupond@hotmail.com'
    When Click button save
    Then Message contains 'Account update successfull'
    And I refresh page
    And I am connection page

  Scenario: Connect account
    Given I am connection page
    And Fill authenticate username 'jean.dupond@hotmail.com'
    And Fill authenticate password '123'
    When Click button login
    Then Message contains 'Authenticate successfull'
    And Message contains 'Account access successfull'