Feature: Manage signing certificates
  As a Feather user
  I want to manage certificate pairs
  So that signing operations succeed

  Scenario: Add a certificate pair
    Given I have a .p12 certificate and a .mobileprovision file
    When I import them into Feather
    Then the certificate pair appears in my list
    And it is available for signing

  Scenario: Switch active certificate pair
    Given multiple certificate pairs are available
    When I select a different pair
    Then Feather uses that pair for signing operations
