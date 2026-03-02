Feature: Install a signed application
  As a Feather user
  I want to sign and install an IPA
  So that I can run apps on my device

  Scenario: Install an IPA from local storage
    Given a valid IPA is available on the device
    And a signing certificate pair is configured
    When I choose the IPA and start signing
    Then Feather produces a signed IPA
    And the installation flow begins

  Scenario: Install via hosted manifest
    Given an IPA and manifest are hosted for installation
    When I confirm the install action
    Then iOS begins installing the app from the manifest
    And Feather reports install progress
