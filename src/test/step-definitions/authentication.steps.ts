import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import { loginScreen } from '../../screens/LoginScreen.js';
import { signupScreen } from '../../screens/SignupScreen.js';
import { homeScreen } from '../../screens/HomeScreen.js';
import { loginTestUser } from '../resources/test-data/signup.js';
import { logger } from '../../utils/logger.js';
import { ensureOnLoginScreen } from '../support/navigation.helper.js';
import type { CustomWorld } from '../support/world.js';

// ===========================================================================
// Login screen — navigation precondition
// ===========================================================================

Given('the user is on the YRide Login screen', async () => {
  logger.info('AuthSteps', 'Ensuring user is on Login screen');
  await ensureOnLoginScreen();
  const isDisplayed = await loginScreen.isDisplayed();
  expect(isDisplayed).toBe(true);
});

// ===========================================================================
// Login screen — UI assertions
// ===========================================================================

Then('the login header and subtitle should be displayed', async () => {
  logger.info('AuthSteps', 'Verifying Login header and subtitle');
  expect(await loginScreen.isDisplayed()).toBe(true);
  expect(await loginScreen.isSubtitleDisplayed()).toBe(true);
});

Then('the email and password input fields should be displayed', async () => {
  logger.info('AuthSteps', 'Verifying email and password input fields');
  expect(await loginScreen.isEmailInputDisplayed()).toBe(true);
  expect(await loginScreen.isPasswordInputDisplayed()).toBe(true);
});

Then('the Sign In and Sign Up buttons should be displayed', async () => {
  logger.info('AuthSteps', 'Verifying Sign In and Sign Up buttons');
  expect(await loginScreen.isSignInButtonDisplayed()).toBe(true);
  expect(await loginScreen.isSignUpButtonDisplayed()).toBe(true);
});

Then('the Enter as Guest button should be displayed', async () => {
  logger.info('AuthSteps', 'Verifying Enter as Guest button');
  expect(await loginScreen.isEnterAsGuestDisplayed()).toBe(true);
});

Then('the Forgot Password link should be displayed', async () => {
  logger.info('AuthSteps', 'Verifying Forgot Password link');
  expect(await loginScreen.isForgotPasswordLinkDisplayed()).toBe(true);
});

// ===========================================================================
// Login screen — password visibility toggle
// ===========================================================================

When(
  'the user enters a password into the password field',
  async function (this: CustomWorld) {
    logger.info('AuthSteps', 'Entering sample test password');
    await loginScreen.enterPassword('TestSecretPass123!');
    this.scenarioState.initialPasswordMaskedState = await loginScreen.isPasswordMasked();
  }
);

Then(
  'the password field should have an initial masking state',
  async function (this: CustomWorld) {
    const initialState = this.scenarioState.initialPasswordMaskedState;
    logger.info('AuthSteps', `Initial password masking state: ${initialState}`);
    expect(typeof initialState).toBe('boolean');
  }
);

When('the user taps the password visibility toggle', async () => {
  logger.info('AuthSteps', 'Tapping password visibility toggle');
  await loginScreen.togglePasswordVisibility();
});

Then(
  'the password field masking should be toggled',
  async function (this: CustomWorld) {
    logger.info('AuthSteps', 'Verifying password field masking toggled');
    const toggledMaskedState = await loginScreen.isPasswordMasked();
    logger.info('AuthSteps', `Toggled password masking state: ${toggledMaskedState}`);
    expect(toggledMaskedState).not.toBe(this.scenarioState.initialPasswordMaskedState);
  }
);

// ===========================================================================
// Login screen — interaction steps
// ===========================================================================

When('the user taps the Sign In button without entering credentials', async () => {
  logger.info('AuthSteps', 'Tapping Sign In with empty credentials');
  await loginScreen.clickSignIn();
});

Then('the user should remain on the Login screen', async () => {
  logger.info('AuthSteps', 'Verifying user remains on Login screen');
  const isDisplayed = await loginScreen.isDisplayed();
  expect(isDisplayed).toBe(true);
});

When('the user enters invalid email and password credentials', async () => {
  logger.info('AuthSteps', 'Entering invalid credentials');
  await loginScreen.enterEmail('unregistered_qa@yride.internal');
  await loginScreen.enterPassword('InvalidPassword123!');
});

When('the user taps the Sign In button', async () => {
  logger.info('AuthSteps', 'Tapping Sign In button');
  await loginScreen.clickSignIn();
});

When('the user taps the Sign Up button', async () => {
  logger.info('AuthSteps', 'Tapping Sign Up button');
  await loginScreen.clickSignUp();
});

Then('the Signup screen should be displayed', async () => {
  logger.info('AuthSteps', 'Verifying Signup screen is displayed');
  const isDisplayed = await signupScreen.isDisplayed();
  expect(isDisplayed).toBe(true);
});

When('the user taps the Sign In link on the Signup screen', async () => {
  logger.info('AuthSteps', 'Tapping Sign In link on Signup screen');
  await signupScreen.clickSignInLink();
});

Then('the Login screen should be displayed', async () => {
  logger.info('AuthSteps', 'Verifying Login screen is displayed');
  await loginScreen.header.waitForDisplayed({ timeout: 10000 });
  const isDisplayed = await loginScreen.isDisplayed();
  expect(isDisplayed).toBe(true);
});

When('the user taps the Enter as Guest button', async () => {
  logger.info('AuthSteps', 'Tapping Enter as Guest button');
  await loginScreen.clickEnterAsGuest();
});

Then('the Home section should be displayed', async () => {
  logger.info('AuthSteps', 'Verifying Home section is displayed after guest access');
  const isHomeDisplayed = await homeScreen.waitForHomeDisplayed(15000);
  expect(isHomeDisplayed).toBe(true);
});

// ===========================================================================
// NOTE: Signup-specific steps are in signup.steps.ts
// The steps below are LOGIN feature-owned only.
// ===========================================================================

void loginTestUser; // Suppress unused import warning — referenced by other modules
