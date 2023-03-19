Feature: Account

  Scenario: Create account
    Given Delete username 'jean.dupond@gmail.com'
    And Go to home page
    And Go to account page
    And I am connection page
    And Go to account creation page
    And I am creation page
    And Fill account email 'jean.dupond@gmail.com'
    And Fill account lastname 'dupond'
    And Fill account firstname 'pierre'
    And Fill account birthday '12/12/1976'
    And Fill account password '123'
    When Click button save
    Then Message contains 'Account creation successfull'

  Scenario: Create account fails because email already exists
    Given Create username 'jean.dupont@gmail.com'
    And Go to home page
    And Go to account page
    And I am connection page
    And Go to account creation page
    And I am creation page
    When Fill account email 'jean.dupont@gmail.com'
    Then Error is 'Email already exists.'

  Scenario: Edit account
    Given Go to home page
    And Go to account page
    And I am connection page
    And Fill authenticate username 'jean.dupond@gmail.com'
    And Fill authenticate password '123'
    And Click button login
    Then Message contains 'Authenticate successfull'
    And Message contains 'Account access successfull'
    And I am edit page
    When Replace account firstname 'jean'
    And Click button save
    Then Message contains 'Account update successfull'

 Scenario: Change username
    Given Delete username 'jean.dupond@hotmail.com'
    And Go to home page
    And Go to account page
    And I am connection page
    And Fill authenticate username 'jean.dupond@gmail.com'
    And Fill authenticate password '123'
    And Click button login
    Then Message contains 'Authenticate successfull'
    And Message contains 'Account access successfull'
    And I am edit page
    When Replace account email 'jean.dupond@hotmail.com'
    And Click button save
    Then Message contains 'Account update successfull'
    And I refresh page
    And I am connection page
