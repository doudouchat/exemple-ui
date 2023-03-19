Feature: Home

  Scenario: Go to home page
    Given Go to home page
    When I do nothing
    Then Check version is '4.0.0-SNAPSHOT'