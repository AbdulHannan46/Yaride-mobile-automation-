@navigation
Feature: YRide bottom navigation

  As an authenticated YRide mobile user
  I want to use the bottom navigation bar
  So that I can smoothly transition between Home, Explore, Favorites, and Profile sections

  @smoke
  Scenario: User can navigate between primary sections
    Given YRide is open on the Home screen
    When the user navigates to Explore
    Then the Explore section should be displayed
    When the user navigates to Favorites
    Then the Favorites section should be displayed
    When the user navigates to Profile
    Then the Profile section should be displayed
    When the user navigates to Home
    Then the Home section should be displayed
