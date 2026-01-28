Feature: Manage installed apps
  As a Feather user
  I want to view and remove installed apps
  So that I can keep my device tidy

  Scenario: View installed app details
    Given I have installed apps managed by Feather
    When I view an app's details
    Then Feather shows certificate and signing metadata
    And I can see the installed version

  Scenario: Remove an installed app
    Given I have an installed app managed by Feather
    When I choose to remove the app
    Then Feather removes the app from the device
    And the app no longer appears in my list
