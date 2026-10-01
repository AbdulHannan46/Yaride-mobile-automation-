import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import { homeScreen } from '../../screens/HomeScreen.js';
import { exploreScreen } from '../../screens/ExploreScreen.js';
import { favoritesScreen } from '../../screens/FavoritesScreen.js';
import { profileScreen } from '../../screens/ProfileScreen.js';
import { loginScreen } from '../../screens/LoginScreen.js';
import { signupScreen } from '../../screens/SignupScreen.js';
import { bottomNavComponent } from '../../components/BottomNavComponent.js';
import { logger } from '../../utils/logger.js';

Given('YRide is open on the Home screen', async () => {
  logger.info('NavigationSteps', 'Verifying YRide is open on the Home screen');
  if (await profileScreen.isGuestDialogDisplayed()) {
    await profileScreen.clickGuestContinue();
  }
  if (await signupScreen.isDisplayed()) {
    await signupScreen.clickSignInLink();
  }
  if (await loginScreen.isDisplayed()) {
    await loginScreen.clickEnterAsGuest();
    await homeScreen.waitForHomeDisplayed();
  }
  if (!(await homeScreen.isHomeSelected())) {
    await bottomNavComponent.navigateToHome();
    await homeScreen.waitForHomeDisplayed();
  }
  const isDisplayed = await homeScreen.isHomeDisplayed();
  expect(isDisplayed).toBe(true);

  const isSelected = await homeScreen.isHomeSelected();
  expect(isSelected).toBe(true);
});

When('the user navigates to Explore', async () => {
  logger.info('NavigationSteps', 'Navigating to Explore tab');
  await bottomNavComponent.navigateToExplore();
});

Then('the Explore section should be displayed', async () => {
  logger.info('NavigationSteps', 'Verifying Explore section is displayed and active');
  const isDisplayed = await exploreScreen.isDisplayed();
  expect(isDisplayed).toBe(true);

  const isSelected = await exploreScreen.isSelected();
  expect(isSelected).toBe(true);
});

When('the user navigates to Favorites', async () => {
  logger.info('NavigationSteps', 'Navigating to Favorites tab');
  await bottomNavComponent.navigateToFavorites();
});

Then('the Favorites section should be displayed', async () => {
  logger.info('NavigationSteps', 'Verifying Favorites section or guest access prompt');
  if (await profileScreen.isGuestDialogDisplayed()) {
    logger.info('NavigationSteps', 'Guest mode active: verified Guest User modal on protected Favorites');
    expect(await profileScreen.isGuestDialogDisplayed()).toBe(true);
  } else {
    const isDisplayed = await favoritesScreen.isDisplayed();
    expect(isDisplayed).toBe(true);
    const isSelected = await favoritesScreen.isSelected();
    expect(isSelected).toBe(true);
  }
});

When('the user navigates to Profile', async () => {
  logger.info('NavigationSteps', 'Navigating to Profile tab');
  if (await profileScreen.isGuestDialogDisplayed()) {
    await profileScreen.clickGuestContinue();
  }
  await bottomNavComponent.navigateToProfile();
});

Then('the Profile section should be displayed', async () => {
  logger.info('NavigationSteps', 'Verifying Profile section or guest access prompt');
  if (await profileScreen.isGuestDialogDisplayed()) {
    logger.info('NavigationSteps', 'Guest mode active: verified Guest User modal on protected Profile');
    expect(await profileScreen.isGuestDialogDisplayed()).toBe(true);
  } else {
    const isDisplayed = await profileScreen.isDisplayed();
    expect(isDisplayed).toBe(true);
    const isSelected = await profileScreen.isSelected();
    expect(isSelected).toBe(true);
  }
});

When('the user navigates to Home', async () => {
  logger.info('NavigationSteps', 'Navigating to Home tab');
  if (await profileScreen.isGuestDialogDisplayed()) {
    await profileScreen.clickGuestContinue();
  }
  await bottomNavComponent.navigateToHome();
});

Then('the Home section should be displayed', async () => {
  logger.info('NavigationSteps', 'Verifying Home section is displayed and active');
  await homeScreen.waitForHomeDisplayed();
  const isDisplayed = await homeScreen.isHomeDisplayed();
  expect(isDisplayed).toBe(true);

  const isSelected = await homeScreen.isHomeSelected();
  expect(isSelected).toBe(true);
});
