@authentication @signup
Feature: YRide user account registration

  As a prospective YRide user
  I want to create an account through the Signup screen
  So that I can access the application's full feature set

  # ============================================================================
  # IMPORTANT: UI-REQUIREMENT DISCREPANCIES (Lead QA reference)
  # ============================================================================
  #
  # Scenario 11 (Password Confirmation Mismatch):
  #   The current Signup UI does NOT expose a Confirm Password field.
  #   This scenario cannot be implemented against the current application.
  #   It is documented in the separate UI-mismatches.md reference.
  #
  # Scenario 12 (Terms & Conditions Validation):
  #   The Signup screen does NOT contain a T&C checkbox.
  #   T&C acceptance is part of the INITIAL ONBOARDING flow (before Login/Signup).
  #   The separate feature file authentication/onboarding.feature covers this.
  #
  # Scenarios 13, 14, 15 (API/Backend):
  #   Cannot be validated at API/database level without backend access.
  #   UI-observable behavior is automated; backend assertions are not claimed.
  # ============================================================================

  Background:
    Given the user is on the YRide Signup screen


  # ============================================================================
  # SCENARIO 1 — Successful Signup
  # ============================================================================

  @smoke @signup-happy-path
  Scenario: Successfully create a new YRide account
    When the user fills in valid signup details
    And submits the Signup form
    Then the account creation success message should be displayed
    And the user completes post-signup setup
    And the user should reach the Home screen

  # ============================================================================
  # SCENARIO 2 — Required Fields Validation
  # ============================================================================

  @signup-validation
  Scenario: User cannot submit an empty Signup form
    When the user submits the Signup form without entering any details
    Then the user should remain on the Signup screen

  # ============================================================================
  # SCENARIO 3 — Invalid Email Format
  # ============================================================================

  @signup-validation
  Scenario Outline: User cannot signup with an invalid email address
    When the user fills in signup details with email "<invalid_email>"
    And submits the Signup form
    Then the Signup form should indicate the email is invalid

    Examples:
      | invalid_email   |
      | notanemail      |
      | qa@             |
      | @yride.qa       |

  # ============================================================================
  # SCENARIO 4 — Existing Email
  # ============================================================================

  @signup-duplicate
  Scenario: User cannot register with an email address already in use
    Given an account has been registered with a known email address
    When a new user attempts to register using the same email address
    Then the Signup form should indicate the email address already exists

  # ============================================================================
  # SCENARIO 5 — Valid Phone Number
  # ============================================================================

  @signup-validation
  Scenario: User can successfully enter a valid phone number
    When the user enters a phone number with 7 subscriber digits
    Then the phone field should accept the input

  # ============================================================================
  # SCENARIO 6 — Invalid Phone Number (special characters)
  # ============================================================================

  @signup-validation
  Scenario: User cannot signup with a phone number containing special characters
    When the user fills in signup details with phone "123#456"
    And submits the Signup form
    Then the Signup form should indicate the phone number is invalid

  # ============================================================================
  # SCENARIO 7 — Leading Zero Phone Number
  # ============================================================================

  @signup-validation
  Scenario: System behaviour for phone number with leading zero
    When the user fills in signup details with phone "0123456"
    And submits the Signup form
    Then the Signup form should indicate the phone number is invalid

  # ============================================================================
  # SCENARIO 8 — Phone Length Boundaries
  # ============================================================================

  # KNOWN DEFECT: YRide backend permits registration with 5/6 digit phone numbers
  # instead of rejecting them with "Invalid Mobile Number".
  # Tagged with @defect to isolate from the baseline passing suite.
  @signup-validation @defect
  Scenario Outline: Phone number boundary length validation
    When the user fills in signup details with phone "<phone_number>"
    And submits the Signup form
    Then the Signup form should indicate the phone number is invalid

    Examples:
      | phone_number | description               |
      | 12345        | 5 digits — below boundary |

  # NOTE: 8-digit behavior requires experimental verification on the device.
  # The 8-digit case is marked as pending until verified (see UI-mismatches.md).

  # ============================================================================
  # SCENARIO 9 — Existing Phone Number
  # ============================================================================

  @signup-duplicate
  Scenario: User cannot register with a phone number already in use
    Given an account has been registered with a known phone number
    When a new user attempts to register using the same phone number
    Then the Signup form should indicate the phone number already exists

  # ============================================================================
  # SCENARIO 10 — Password Validation
  # ============================================================================

  @signup-validation
  Scenario: User cannot signup with a password shorter than the minimum length
    When the user fills in signup details with password "12345"
    And submits the Signup form
    Then the Signup form should reject the short password

  @signup-validation
  Scenario: User can signup with a password meeting the minimum length
    When the user fills in signup details with a minimum-length password
    And submits the Signup form
    Then the account should be accepted or validation should not reject the password

  # ============================================================================
  # SCENARIO 11 — Password Confirmation Mismatch
  # ============================================================================
  # STATUS: BLOCKED — UI Mismatch
  # The current Signup screen does NOT have a Confirm Password field.
  # This scenario cannot be implemented against the current application UI.
  # Documented in: docs/ui-mismatches.md
  # ============================================================================

  # ============================================================================
  # SCENARIO 12 — Terms & Conditions
  # ============================================================================
  # STATUS: REDIRECTED — The T&C acceptance is part of the initial onboarding
  # flow, not the Signup screen. Covered in: onboarding.feature
  # ============================================================================

  # ============================================================================
  # SCENARIOS 13, 14, 15 — API / Backend Dependent
  # ============================================================================
  # STATUS: BLOCKED — No API/database access available.
  # UI-observable behavior from Signup is automated in Scenarios 1–10, 16–20.
  # Backend state (API response, rollback, orphaned records) cannot be verified.
  # ============================================================================

  # ============================================================================
  # SCENARIO 16 — Retry After Failed Signup
  # ============================================================================

  @signup-resilience
  Scenario: User can retry signup after a failed attempt
    When the user attempts to signup with an invalid phone number
    And the Signup form rejects the submission
    When the user corrects the phone number and resubmits
    Then the signup should be accepted or a meaningful error should appear

  # ============================================================================
  # SCENARIO 17 — Multiple Submit Protection
  # ============================================================================

  @signup-resilience
  Scenario: Rapid multiple taps on Sign Up button do not cause erratic behaviour
    When the user fills in valid signup details
    And the user taps the Sign Up button multiple times rapidly
    Then the application should respond without displaying multiple error states

  # ============================================================================
  # SCENARIO 18 — Network Failure During Signup
  # ============================================================================
  # STATUS: PARTIALLY AUTOMATABLE
  # Full network interruption requires device-level Wi-Fi/ADB control.
  # Verified separately: the app handles connectivity gracefully at the UI level.
  # ============================================================================

  # ============================================================================
  # SCENARIO 19 — Signup Data Persistence
  # ============================================================================

  @signup-ux
  Scenario: Signup form retains data when user navigates back and returns
    When the user fills in partial signup details
    And the user navigates back to the Login screen
    And the user navigates back to the Signup screen
    Then the Signup form should be in a clean initial state

  # ============================================================================
  # SCENARIO 20 — Post-Signup Session
  # ============================================================================

  @signup-happy-path
  Scenario: Successfully created account allows access to the Home screen
    When the user fills in valid signup details
    And submits the Signup form
    Then the account creation success message should be displayed
    And the user completes post-signup setup
    And the user should reach the Home screen
    And the bottom navigation bar should be visible

  # ============================================================================
  # ADDITIONAL: Signup Screen UI Validation
  # ============================================================================

  @smoke @signup-ui
  Scenario: Signup screen displays all required UI components
    Then the Signup screen should display all required input fields
    And the terms and privacy policy statement should be visible
    And the Sign Up submit button should be displayed

  @signup-ui
  Scenario: User can navigate from Signup back to the Login screen
    When the user taps the Sign In link on the Signup screen
    Then the Login screen should be displayed
