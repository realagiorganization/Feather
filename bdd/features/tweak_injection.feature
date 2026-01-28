Feature: Inject tweaks into apps
  As a Feather power user
  I want to inject tweaks into signed apps
  So that I can customize behavior

  Scenario: Inject a dylib tweak
    Given a signed IPA is ready for customization
    And a compatible .dylib file is available
    When I enable tweak injection
    Then Feather embeds the tweak into the IPA
    And the final IPA is ready to install

  Scenario: Inject a deb package
    Given a signed IPA is ready for customization
    And a compatible .deb file is available
    When I enable tweak injection
    Then Feather embeds the deb contents into the IPA
    And the final IPA is ready to install
