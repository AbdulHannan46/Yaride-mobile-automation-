import { $ } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import { BaseScreen } from '../core/BaseScreen.js';
import { logger } from '../utils/logger.js';

/**
 * OnboardingScreen
 *
 * Represents the "List • Protect • Retire" onboarding carousel that appears
 * after T&C acceptance on first launch.
 *
 * Flow position:
 *   TermsScreen (Accept) → OnboardingScreen → (Skip | Get Started) → LoginScreen
 *
 * Both "Skip" and "Get Started" lead to the Sign In screen.
 *
 * Locator strategy:
 * - Accessibility ID (content-desc) preferred.
 * - The Skip/Get Started buttons are the primary interaction targets here.
 */
export class OnboardingScreen extends BaseScreen {
  public static readonly LOCATORS = {
    SKIP_BUTTON: '~Skip',
    GET_STARTED_BUTTON: '~Get Started',
    // Onboarding content indicator — used to detect if we are on this screen
    ONBOARDING_INDICATOR: '~List',
  } as const;

  public get skipButton(): ChainablePromiseElement {
    return $(OnboardingScreen.LOCATORS.SKIP_BUTTON);
  }

  public get getStartedButton(): ChainablePromiseElement {
    return $(OnboardingScreen.LOCATORS.GET_STARTED_BUTTON);
  }

  public get onboardingIndicator(): ChainablePromiseElement {
    return $(OnboardingScreen.LOCATORS.ONBOARDING_INDICATOR);
  }

  /**
   * Checks if the onboarding screen is currently displayed.
   */
  public async isDisplayed(): Promise<boolean> {
    logger.debug('OnboardingScreen', 'Checking if Onboarding screen is displayed');
    return (
      (await super.isDisplayed(this.skipButton)) ||
      (await super.isDisplayed(this.getStartedButton))
    );
  }

  /**
   * Skips the onboarding flow and proceeds to the Sign In screen.
   */
  public async skip(): Promise<void> {
    logger.info('OnboardingScreen', 'Skipping onboarding to Login screen');
    await this.safeClick(this.skipButton, 'Skip Button');
  }

  /**
   * Taps "Get Started" to proceed to the Sign In screen.
   */
  public async getStarted(): Promise<void> {
    logger.info('OnboardingScreen', 'Tapping Get Started to proceed to Login screen');
    await this.safeClick(this.getStartedButton, 'Get Started Button');
  }
}

export const onboardingScreen = new OnboardingScreen();
