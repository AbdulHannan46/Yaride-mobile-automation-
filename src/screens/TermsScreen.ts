import { $ } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import { BaseScreen } from '../core/BaseScreen.js';
import { logger } from '../utils/logger.js';

/**
 * TermsScreen
 *
 * Represents the initial Disclaimer / Terms & Conditions acceptance screen
 * that appears on initial application launch (before onboarding).
 *
 * Confirmed UI elements from live-device UIAutomator inspection:
 * - Title: android.view.View content-desc="Disclaimer"
 * - Checkbox: android.widget.CheckBox checkable="true" checked="false"
 * - Label: android.view.View content-desc="Accept Terms & Conditions"
 * - Action: android.view.View content-desc="Continue" (enabled after checkbox is checked)
 */
export class TermsScreen extends BaseScreen {
  public static readonly LOCATORS = {
    DISCLAIMER_TITLE: '~Disclaimer',
    TERMS_LABEL: '~Accept Terms & Conditions',
    CONTINUE_BUTTON: '~Continue',
  } as const;

  public get disclaimerTitle(): ChainablePromiseElement {
    return $(TermsScreen.LOCATORS.DISCLAIMER_TITLE);
  }

  public get termsCheckbox(): ChainablePromiseElement {
    return $('android.widget.CheckBox');
  }

  public get termsLabel(): ChainablePromiseElement {
    return $(TermsScreen.LOCATORS.TERMS_LABEL);
  }

  public get continueButton(): ChainablePromiseElement {
    return $(TermsScreen.LOCATORS.CONTINUE_BUTTON);
  }

  /**
   * Checks if the Disclaimer screen is currently displayed.
   */
  public async isDisplayed(): Promise<boolean> {
    logger.debug('TermsScreen', 'Checking if Disclaimer screen is displayed');
    return await super.isDisplayed(this.disclaimerTitle);
  }

  /**
   * Checks whether the terms checkbox is currently checked.
   */
  public async isTermsChecked(): Promise<boolean> {
    const cb = this.termsCheckbox;
    if (await super.isDisplayed(cb)) {
      const isChecked = await cb.getAttribute('checked');
      return isChecked === 'true';
    }
    return false;
  }

  /**
   * Checks whether the Continue button is displayed.
   */
  public async isContinueButtonDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.continueButton);
  }

  /**
   * Accepts the Terms & Conditions:
   * 1. Checks the CheckBox if unchecked (which enables the Continue button).
   * 2. Taps the Continue button to transition to Onboarding.
   */
  public async acceptTerms(): Promise<void> {
    logger.info('TermsScreen', 'Accepting Terms & Conditions (checking box + tapping Continue)');

    const cb = this.termsCheckbox;
    if (await super.isDisplayed(cb)) {
      const isChecked = await cb.getAttribute('checked');
      if (isChecked !== 'true') {
        logger.info('TermsScreen', 'Tapping terms checkbox to check it');
        await this.safeClick(cb, 'Terms CheckBox');
        await browser.pause(500);
      }
    }

    await this.safeClick(this.continueButton, 'Continue Button');
  }
}

export const termsScreen = new TermsScreen();

