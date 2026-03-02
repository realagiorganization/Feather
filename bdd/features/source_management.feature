Feature: Manage app sources
  As a Feather user
  I want to add and refresh app sources
  So that I can discover and install apps

  Scenario: Add an AltStore-compatible source
    Given I have a valid source URL
    When I add the source in Feather
    Then the source appears in my list
    And its apps are available for browsing

  Scenario: Refresh a source
    Given I have a source already saved
    When I refresh the source
    Then Feather fetches the latest app metadata
    And updates the app list
