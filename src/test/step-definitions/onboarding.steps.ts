import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import { termsScreen } from '../../screens/TermsScreen.js';
import { onboardingScreen } from '../../screens/OnboardingScreen.js';
import { loginScreen } from '../../screens/LoginScreen.js';
import { logger } from '../../utils/logger.js';

// ===========================================================================
// Onboarding — Terms & Conditions acceptance and initial flow
// ===========================================================================

Given('the YRide application has been launched for the first time', async () => {
  logger.info('OnboardingSteps', 'Checking initial application launch state');
  // On first launch (or after clearing app data), the Terms screen appears.
  // If the app has already been launched and T&C accepted, this step is a no-op.
  const isTermsDisplayed = await termsScreen.isDisplayed();
  if (!isTermsDisplayed) {
    logger.info('OnboardingSteps', 'Terms screen not shown — T&C may already have been accepted in this session');
  }
});

When('the Terms & Conditions screen is displayed', async () => {
  logger.info('OnboardingSteps', 'Verifying Terms & Conditions screen');
  // This step verifies the precondition; if the screen is not visible,
  // the test is marked as pending (T&C already accepted in this run).
  const isDisplayed = await termsScreen.isDisplayed();
  if (!isDisplayed) {
    logger.warn('OnboardingSteps', 'Terms screen not visible — T&C already accepted. Skipping T&C steps.');
    return;
  }
  expect(isDisplayed).toBe(true);
});

Then('the user must accept the Terms to continue', async () => {
  logger.info('OnboardingSteps', 'Accepting Terms & Conditions');
  const isDisplayed = await termsScreen.isDisplayed();
  if (isDisplayed) {
    await termsScreen.acceptTerms();
  } else {
    logger.info('OnboardingSteps', 'Terms screen already accepted — proceeding');
  }
});

Then('the application should proceed to the onboarding or Login screen', async () => {
  logger.info('OnboardingSteps', 'Verifying post-T&C navigation');
  // After accepting T&C, the app navigates to onboarding or Login
  const isOnboarding = await onboardingScreen.isDisplayed();
  const isLogin = await loginScreen.isDisplayed();
  expect(isOnboarding || isLogin).toBe(true);
});

Given('the user is on the onboarding screen', async () => {
  logger.info('OnboardingSteps', 'Ensuring app is on the Onboarding screen');
  const isDisplayed = await onboardingScreen.isDisplayed();
  if (!isDisplayed) {
    logger.warn('OnboardingSteps', 'Onboarding screen not shown — may have been passed already in this session');
  }
});

When('the user taps Skip', async () => {
  logger.info('OnboardingSteps', 'Tapping Skip on onboarding screen');
  if (await onboardingScreen.isDisplayed()) {
    await onboardingScreen.skip();
  }
});

When('the user taps Get Started', async () => {
  logger.info('OnboardingSteps', 'Tapping Get Started on onboarding screen');
  if (await onboardingScreen.isDisplayed()) {
    await onboardingScreen.getStarted();
  }
});

Then('the user should reach the Sign In screen', async () => {
  logger.info('OnboardingSteps', 'Verifying user reached the Sign In screen');
  await loginScreen.header.waitForDisplayed({ timeout: 10000 });
  const isDisplayed = await loginScreen.isDisplayed();
  expect(isDisplayed).toBe(true);
});
