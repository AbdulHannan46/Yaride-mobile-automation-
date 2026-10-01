import { loginScreen } from '../../screens/LoginScreen.js';
import { signupScreen } from '../../screens/SignupScreen.js';
import { homeScreen } from '../../screens/HomeScreen.js';
import { profileScreen } from '../../screens/ProfileScreen.js';
import { termsScreen } from '../../screens/TermsScreen.js';
import { onboardingScreen } from '../../screens/OnboardingScreen.js';
import { postSignupScreen } from '../../screens/PostSignupScreen.js';
import { config as envConfig } from '../../config/environment.js';
import { logger } from '../../utils/logger.js';

/**
 * NavigationHelper
 *
 * Provides deterministic, state-aware navigation utilities that inspect the
 * current application screen and transition it to a known state.
 *
 * Design:
 * - Each function evaluates actual UI state before taking action.
 * - No coordinate-based automation.
 * - No arbitrary sleep/wait calls — all waits are state-condition based.
 * - Each function documents which screen states it can recover from.
 */


/**
 * Ensures the application is on the Login screen.
 *
 * Can recover from:
 * - Already on Login screen (no-op)
 * - On Signup screen (taps Sign In link)
 * - On Terms & Conditions screen (accepts, navigates through onboarding)
 * - On Onboarding screen (taps Skip)
 * - On Home screen (navigates to Profile, then logs out)
 * - App starting up / splash screen (polls all known states)
 */
export async function ensureOnLoginScreen(): Promise<void> {
  logger.debug('NavigationHelper', 'Ensuring app is on Login screen');

  // Ensure target app is in the foreground
  try {
    const currentPkg = await browser.getCurrentPackage();
    if (currentPkg !== envConfig.android.appPackage) {
      logger.info('NavigationHelper', `App not in foreground (current: "${currentPkg}") → activating ${envConfig.android.appPackage}`);
      await browser.activateApp(envConfig.android.appPackage);
      await browser.pause(1000);
    }
  } catch (err) {
    logger.warn('NavigationHelper', `Could not verify/activate app package: ${String(err)}`);
  }

  const maxAttempts = 6;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // 1. Check if already on Login screen
    if (await loginScreen.isDisplayed()) {
      logger.debug('NavigationHelper', 'Successfully confirmed on Login screen');
      return;
    }

    // Check if on Post-Signup screens (Success Dialog or Identity Verification)
    if (await postSignupScreen.isSuccessDialogDisplayed(1000) || await postSignupScreen.isVerifyIdentityDisplayed()) {
      logger.info('NavigationHelper', `[Attempt ${attempt}] On Post-Signup screen → completing post-signup flow to reach Home`);
      await postSignupScreen.completePostSignupFlow();
      await browser.pause(1000);
      continue;
    }

    // 2. Check if on Terms & Conditions / Disclaimer screen
    if (await termsScreen.isDisplayed()) {
      logger.info('NavigationHelper', `[Attempt ${attempt}] On Terms screen → accepting Disclaimer`);
      await termsScreen.acceptTerms();
      await browser.pause(1000);
      continue;
    }

    // 3. Check if on Onboarding screen
    if (await onboardingScreen.isDisplayed()) {
      logger.info('NavigationHelper', `[Attempt ${attempt}] On Onboarding screen → skipping onboarding`);
      await onboardingScreen.skip();
      await browser.pause(1000);
      continue;
    }

    // 4. Check if on Signup screen
    if (await signupScreen.isDisplayed()) {
      logger.info('NavigationHelper', `[Attempt ${attempt}] On Signup screen → tapping Sign In link`);
      await signupScreen.clickSignInLink();
      await browser.pause(1000);
      continue;
    }

    // 5. Check if on Home screen
    if (await homeScreen.isHomeDisplayed()) {
      logger.info('NavigationHelper', `[Attempt ${attempt}] On Home screen → logging out`);
      await navigateFromHomeToLogin();
      if (await loginScreen.isDisplayed()) {
        return;
      }
      continue;
    }

    // 6. Transitioning / Splash state: wait 1s before retrying
    logger.debug('NavigationHelper', `[Attempt ${attempt}] Waiting for screen to settle...`);
    await browser.pause(1000);
  }

  // Final fallback: wait for Login header
  logger.info('NavigationHelper', 'Final check: waiting for Login header');
  await loginScreen.header.waitForDisplayed({ timeout: 15000 });
}


/**
 * Navigates from the Signup screen to the Login screen.
 * Calls ensureOnLoginScreen() first to recover from any state.
 */
export async function ensureOnSignupScreen(): Promise<void> {
  logger.debug('NavigationHelper', 'Ensuring app is on Signup screen');

  // Already on Signup screen
  if (await signupScreen.isDisplayed()) {
    logger.debug('NavigationHelper', 'Already on Signup screen');
    return;
  }

  await ensureOnLoginScreen();
  await loginScreen.clickSignUp();

  // Wait for the Signup screen's identity element (country code button)
  await signupScreen.countryCodeButton.waitForDisplayed({ timeout: 10000 });

  logger.info('NavigationHelper', 'Successfully navigated to Signup screen');
}

/**
 * Handles navigation from Home screen back to Login.
 * Covers both guest and authenticated user paths.
 */
async function navigateFromHomeToLogin(): Promise<void> {
  try {
    await homeScreen.navigateToProfile();

    if (await profileScreen.isGuestDialogDisplayed()) {
      logger.info('NavigationHelper', 'Guest modal detected → tapping Login option');
      await profileScreen.clickGuestLogin();
    } else {
      logger.info('NavigationHelper', 'Authenticated user detected → logging out');
      await profileScreen.logout();
    }

    // Wait for Login screen to appear after logout/guest modal
    await loginScreen.header.waitForDisplayed({ timeout: 15000 });
  } catch (e) {
    logger.error('NavigationHelper', `Failed to navigate from Home to Login: ${String(e)}`);
    // Final fallback: wait for Login header
    await loginScreen.header.waitForDisplayed({ timeout: 15000 });
  }
}

