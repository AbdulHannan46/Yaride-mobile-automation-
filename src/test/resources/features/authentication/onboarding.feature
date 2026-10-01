@authentication @onboarding
Feature: YRide application onboarding and Terms acceptance

  As a first-time YRide mobile user
  I want to go through the initial onboarding flow
  So that I can accept the Terms & Conditions and reach the Sign In screen

  # ============================================================================
  # NOTE: Lead scenario #12 specifies "Terms & Conditions Validation during Signup".
  # The current application does NOT expose a T&C checkbox on the Signup screen.
  # Instead, Terms acceptance is a mandatory first-launch step in onboarding.
  # These scenarios cover the actual T&C acceptance point in the real application.
  # ============================================================================

  @smoke @onboarding-tc
  Scenario: First-time user must accept Terms & Conditions before accessing Signup
    Given the YRide application has been launched for the first time
    When the Terms & Conditions screen is displayed
    Then the user must accept the Terms to continue
    And the application should proceed to the onboarding or Login screen

  @onboarding-navigation
  Scenario: User can proceed to Login via Skip on onboarding screen
    Given the user is on the onboarding screen
    When the user taps Skip
    Then the user should reach the Sign In screen

  @onboarding-navigation
  Scenario: User can proceed to Login via Get Started on onboarding screen
    Given the user is on the onboarding screen
    When the user taps Get Started
    Then the user should reach the Sign In screen
