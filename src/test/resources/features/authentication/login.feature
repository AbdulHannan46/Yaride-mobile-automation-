@authentication @login
Feature: YRide user authentication and login

  As a YRide mobile user
  I want to access the login screen and authenticate
  So that I can securely manage my account or explore the application

  Background:
    Given the user is on the YRide Login screen

  @smoke
  Scenario: Login screen UI components are displayed correctly
    Then the login header and subtitle should be displayed
    And the email and password input fields should be displayed
    And the Sign In and Sign Up buttons should be displayed
    And the Enter as Guest button should be displayed
    And the Forgot Password link should be displayed

  Scenario: User can toggle password visibility
    When the user enters a password into the password field
    Then the password field should have an initial masking state
    When the user taps the password visibility toggle
    Then the password field masking should be toggled

  Scenario: User cannot sign in with empty credentials
    When the user taps the Sign In button without entering credentials
    Then the user should remain on the Login screen

  Scenario: User cannot sign in with invalid credentials
    When the user enters invalid email and password credentials
    And the user taps the Sign In button
    Then the user should remain on the Login screen

  Scenario: User can navigate between Login and Signup screens
    When the user taps the Sign Up button
    Then the Signup screen should be displayed
    When the user taps the Sign In link on the Signup screen
    Then the Login screen should be displayed

  @smoke
  Scenario: User can enter application as a Guest
    When the user taps the Enter as Guest button
    Then the Home section should be displayed
