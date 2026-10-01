import { $ } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import { BaseScreen } from '../core/BaseScreen.js';
import { logger } from '../utils/logger.js';

/**
 * PostSignupScreen
 *
 * Represents the post-account-creation flow after successful Signup.
 *
 * Observed flow:
 *   Successful Signup
 *     → Success dialog: "Account successfully created. Awesome! Your account is ready to use."
 *     → Start Exploring button
 *     → Identity verification prompt: "Verify your identity"
 *       → Options: [Verify Identity] | [Later]
 *     → (Later) → Home screen
 *
 * For automation scope:
 * - We tap "Start Exploring" to dismiss the success dialog.
 * - We tap "Later" to skip identity verification and reach Home.
 *
 * Locator strategy:
 * - Accessibility ID (content-desc) preferred.
 * - Exact content-desc values should be verified against the live device.
 */
export class PostSignupScreen extends BaseScreen {
  public static readonly LOCATORS = {
    // Success dialog elements
    SUCCESS_TITLE: '~Account successfully created.',
    SUCCESS_SUBTITLE: '~Awesome! Your account is ready to use.',
    START_EXPLORING_BUTTON: '~Start Exploring',

    // Identity verification prompt
    VERIFY_IDENTITY_TITLE: '~Verify your identity',
    VERIFY_IDENTITY_BUTTON: '~Verify Identity',
    LATER_BUTTON: '~Later',
  } as const;

  // Success dialog
  public get successTitle(): ChainablePromiseElement {
    return $('android=new UiSelector().descriptionStartsWith("Account Successfully")');
  }

  public get successSubtitle(): ChainablePromiseElement {
    return $('android=new UiSelector().descriptionStartsWith("Awesome")');
  }

  public get startExploringButton(): ChainablePromiseElement {
    return $('android=new UiSelector().descriptionMatches("(?i)start exploring")');
  }

  // Identity verification
  public get verifyIdentityTitle(): ChainablePromiseElement {
    return $('android=new UiSelector().descriptionStartsWith("Verify your identity")');
  }

  public get verifyIdentityButton(): ChainablePromiseElement {
    return $('android=new UiSelector().descriptionMatches("(?i)verify identity")');
  }

  public get laterButton(): ChainablePromiseElement {
    return $('android=new UiSelector().descriptionMatches("(?i)later")');
  }

  /**
   * Checks if the signup success dialog is currently displayed within the given timeout.
   */
  public async isSuccessDialogDisplayed(timeout: number = this.defaultTimeout): Promise<boolean> {
    logger.debug('PostSignupScreen', `Checking if Signup success dialog is displayed (timeout: ${timeout}ms)`);
    try {
      await browser.waitUntil(
        async () => {
          return (
            (await super.isDisplayed(this.successTitle)) ||
            (await super.isDisplayed(this.startExploringButton)) ||
            (await super.isDisplayed(this.successSubtitle))
          );
        },
        {
          timeout,
          interval: 500,
          timeoutMsg: 'Signup success dialog was not displayed within timeout',
        }
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if the identity verification prompt is displayed.
   */
  public async isVerifyIdentityDisplayed(): Promise<boolean> {
    logger.debug('PostSignupScreen', 'Checking if identity verification prompt is displayed');
    return (
      (await super.isDisplayed(this.verifyIdentityTitle)) ||
      (await super.isDisplayed(this.laterButton))
    );
  }

  /**
   * Reads the success title text for assertion purposes.
   */
  public async getSuccessTitleText(): Promise<string> {
    return await this.getText(this.successTitle);
  }

  /**
   * Taps "Start Exploring" on the signup success dialog.
   */
  public async tapStartExploring(): Promise<void> {
    logger.info('PostSignupScreen', 'Tapping Start Exploring button');
    await this.safeClick(this.startExploringButton, 'Start Exploring Button');
  }

  /**
   * Taps "Later" to skip identity verification and proceed to Home.
   */
  public async tapLater(): Promise<void> {
    logger.info('PostSignupScreen', 'Tapping Later to skip identity verification');
    await this.safeClick(this.laterButton, 'Later Button');
  }

  /**
   * Completes the full post-signup flow:
   * Dismisses success dialog → skips identity verification → reaches Home.
   */
  public async completePostSignupFlow(): Promise<void> {
    logger.info('PostSignupScreen', 'Completing post-signup flow (Start Exploring → Later)');

    if (await this.isSuccessDialogDisplayed(10000)) {
      if (await super.isDisplayed(this.startExploringButton)) {
        await this.tapStartExploring();
        await browser.pause(1000);
      }
    }

    try {
      await this.laterButton.waitForDisplayed({ timeout: 10000 });
      await this.tapLater();
      await browser.pause(1000);
    } catch {
      logger.warn('PostSignupScreen', 'Later button not displayed or already bypassed');
    }
  }

}

export const postSignupScreen = new PostSignupScreen();
