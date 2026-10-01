import { $ } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import { BaseScreen } from '../core/BaseScreen.js';
import { logger } from '../utils/logger.js';

export class ProfileScreen extends BaseScreen {
  public static readonly LOCATORS = {
    PROFILE_TAB: '~Profile\nTab 4 of 4',
    // Guest modal elements
    GUEST_DIALOG_TITLE: '~Guest User',
    GUEST_LOG_IN_BUTTON: '~Log In',
    GUEST_SIGN_UP_BUTTON: '~Sign Up',
    GUEST_CONTINUE_BUTTON: '~Continue as Guest',
    // Authenticated profile elements
    LOGOUT_BUTTON: '~Log Out',
    CONFIRM_LOGOUT_TITLE: '~Confirm Logout',
    CONFIRM_LOGOUT_BUTTON: '~Log Out',
    CANCEL_LOGOUT_BUTTON: '~Cancel',
  } as const;

  public get profileTab(): ChainablePromiseElement {
    return $(ProfileScreen.LOCATORS.PROFILE_TAB);
  }

  // Guest modal getters
  public get guestDialogTitle(): ChainablePromiseElement {
    return $(ProfileScreen.LOCATORS.GUEST_DIALOG_TITLE);
  }

  public get guestLogInButton(): ChainablePromiseElement {
    return $(ProfileScreen.LOCATORS.GUEST_LOG_IN_BUTTON);
  }

  public get guestSignUpButton(): ChainablePromiseElement {
    return $(ProfileScreen.LOCATORS.GUEST_SIGN_UP_BUTTON);
  }

  public get guestContinueButton(): ChainablePromiseElement {
    return $(ProfileScreen.LOCATORS.GUEST_CONTINUE_BUTTON);
  }

  // Logout modal getters
  public get logOutButton(): ChainablePromiseElement {
    return $(ProfileScreen.LOCATORS.LOGOUT_BUTTON);
  }

  public get confirmLogOutButton(): ChainablePromiseElement {
    return $(ProfileScreen.LOCATORS.CONFIRM_LOGOUT_BUTTON);
  }

  public get cancelLogOutButton(): ChainablePromiseElement {
    return $(ProfileScreen.LOCATORS.CANCEL_LOGOUT_BUTTON);
  }

  /**
   * Verifies if the Profile section indicator/tab is displayed.
   */
  public async isDisplayed(): Promise<boolean> {
    logger.debug('ProfileScreen', 'Verifying Profile tab is displayed');
    return await super.isDisplayed(this.profileTab);
  }

  /**
   * Verifies if the Profile section is active (tab is selected).
   */
  public async isSelected(): Promise<boolean> {
    logger.debug('ProfileScreen', 'Verifying Profile tab is selected');
    return await super.isSelected(this.profileTab);
  }

  /**
   * Checks if the guest user prompt dialog is currently displayed.
   */
  public async isGuestDialogDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.guestDialogTitle);
  }

  /**
   * Clicks Log In from the guest user prompt dialog.
   */
  public async clickGuestLogin(): Promise<void> {
    logger.info('ProfileScreen', 'Clicking Log In from Guest prompt dialog');
    await this.safeClick(this.guestLogInButton, 'Guest Modal Log In Button');
  }

  /**
   * Clicks Sign Up from the guest user prompt dialog.
   */
  public async clickGuestSignUp(): Promise<void> {
    logger.info('ProfileScreen', 'Clicking Sign Up from Guest prompt dialog');
    await this.safeClick(this.guestSignUpButton, 'Guest Modal Sign Up Button');
  }

  /**
   * Clicks Continue as Guest from the guest user prompt dialog.
   */
  public async clickGuestContinue(): Promise<void> {
    logger.info('ProfileScreen', 'Clicking Continue as Guest from prompt dialog');
    await this.safeClick(this.guestContinueButton, 'Guest Modal Continue Button');
  }

  /**
   * Performs logout by clicking Log Out and confirming the confirmation dialog.
   */
  public async logout(): Promise<void> {
    logger.info('ProfileScreen', 'Initiating logout sequence');
    if (!(await super.isDisplayed(this.logOutButton))) {
      try {
        const scrollable = $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("Log Out"))');
        await scrollable.waitForDisplayed({ timeout: 5000 });
      } catch {
        // Continue if already in view
      }
    }
    await this.safeClick(this.logOutButton, 'Log Out Button');
    await this.safeClick(this.confirmLogOutButton, 'Confirm Log Out Button');
  }
}

export const profileScreen = new ProfileScreen();
