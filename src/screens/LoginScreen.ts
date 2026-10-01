import { $, $$ } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import { BaseScreen } from '../core/BaseScreen.js';
import { logger } from '../utils/logger.js';

export class LoginScreen extends BaseScreen {
  /**
   * Accessibility ID locators for the Login screen.
   * Priority 1: Accessibility ID (content-desc)
   */
  public static readonly LOCATORS = {
    HEADER: '~Sign in to Yaride',
    SUBTITLE: '~Welcome back! Please enter your details.',
    FORGOT_PASSWORD_LINK: '~Forgot password? Reset it',
    SIGN_IN_BUTTON: '~Sign In',
    SIGN_UP_BUTTON: '~Sign Up',
    ENTER_AS_GUEST_BUTTON: '~Enter as Guest',
  } as const;

  // Header & Subtitle
  public get header(): ChainablePromiseElement {
    return $(LoginScreen.LOCATORS.HEADER);
  }

  public get subtitle(): ChainablePromiseElement {
    return $(LoginScreen.LOCATORS.SUBTITLE);
  }

  // Input Fields
  // Note: Flutter renders text inputs as android.widget.EditText without individual accessibility IDs.
  // We use stable native class indexing: index 0 = Email, index 1 = Password.
  public get emailInput(): ChainablePromiseElement {
    return $$('android.widget.EditText')[0];
  }

  public get passwordInput(): ChainablePromiseElement {
    return $$('android.widget.EditText')[1];
  }

  // Password visibility toggle
  // Note: Flutter renders the eye toggle as an unlabelled ImageView sibling to the password field.
  // XPath is used here as a last resort because no accessibility ID or resource ID is exposed by Flutter.
  public get passwordVisibilityToggle(): ChainablePromiseElement {
    return $('//android.widget.EditText[2]/following-sibling::android.widget.ImageView[2]');
  }

  // Interactive buttons and links
  public get forgotPasswordLink(): ChainablePromiseElement {
    return $(LoginScreen.LOCATORS.FORGOT_PASSWORD_LINK);
  }

  public get signInButton(): ChainablePromiseElement {
    return $(LoginScreen.LOCATORS.SIGN_IN_BUTTON);
  }

  public get signUpButton(): ChainablePromiseElement {
    return $(LoginScreen.LOCATORS.SIGN_UP_BUTTON);
  }

  public get enterAsGuestButton(): ChainablePromiseElement {
    return $(LoginScreen.LOCATORS.ENTER_AS_GUEST_BUTTON);
  }

  /**
   * Checks whether the Login screen header is currently displayed.
   */
  public async isDisplayed(): Promise<boolean> {
    logger.debug('LoginScreen', 'Checking if Login screen header is displayed');
    return await super.isDisplayed(this.header);
  }

  /**
   * Checks whether the subtitle is displayed.
   */
  public async isSubtitleDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.subtitle);
  }

  /**
   * Checks whether the email input is displayed.
   */
  public async isEmailInputDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.emailInput);
  }

  /**
   * Checks whether the password input is displayed.
   */
  public async isPasswordInputDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.passwordInput);
  }

  /**
   * Checks whether the Sign In button is displayed.
   */
  public async isSignInButtonDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.signInButton);
  }

  /**
   * Checks whether the Sign Up button is displayed.
   */
  public async isSignUpButtonDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.signUpButton);
  }

  /**
   * Checks whether the Enter as Guest button is displayed.
   */
  public async isEnterAsGuestDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.enterAsGuestButton);
  }

  /**
   * Checks whether the Forgot Password link is displayed.
   */
  public async isForgotPasswordLinkDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.forgotPasswordLink);
  }

  /**
   * Enters email into the email input field.
   */
  public async enterEmail(email: string): Promise<void> {
    logger.info('LoginScreen', `Entering email: ${email}`);
    await this.setValue(this.emailInput, email, 'EmailInput', false);
  }

  /**
   * Enters password into the password input field.
   * Value is masked in logs.
   */
  public async enterPassword(password: string): Promise<void> {
    logger.info('LoginScreen', 'Entering password (masked)');
    await this.setValue(this.passwordInput, password, 'PasswordInput', true);
  }

  /**
   * Clicks the Sign In button.
   */
  public async clickSignIn(): Promise<void> {
    logger.info('LoginScreen', 'Clicking Sign In button');
    await this.safeClick(this.signInButton, 'Sign In Button');
  }

  /**
   * Clicks the Sign Up button to navigate to Registration.
   */
  public async clickSignUp(): Promise<void> {
    logger.info('LoginScreen', 'Clicking Sign Up button');
    await this.safeClick(this.signUpButton, 'Sign Up Button');
  }

  /**
   * Clicks the Enter as Guest button to enter guest mode.
   */
  public async clickEnterAsGuest(): Promise<void> {
    logger.info('LoginScreen', 'Clicking Enter as Guest button');
    await this.safeClick(this.enterAsGuestButton, 'Enter as Guest Button');
  }

  /**
   * Clicks the Forgot Password link.
   */
  public async clickForgotPassword(): Promise<void> {
    logger.info('LoginScreen', 'Clicking Forgot Password link');
    await this.safeClick(this.forgotPasswordLink, 'Forgot Password Link');
  }

  /**
   * Toggles password visibility by tapping the eye icon.
   */
  public async togglePasswordVisibility(): Promise<void> {
    logger.info('LoginScreen', 'Toggling password visibility');
    await this.safeClick(this.passwordVisibilityToggle, 'Password Visibility Toggle');
  }

  /**
   * Verifies if the password input has password masking enabled.
   */
  public async isPasswordMasked(): Promise<boolean> {
    await this.passwordInput.waitForDisplayed({ timeout: this.defaultTimeout });
    const isMasked = await this.passwordInput.getAttribute('password');
    return isMasked === 'true';
  }

  /**
   * High-level helper to perform login with specified credentials.
   */
  public async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSignIn();
  }
}

export const loginScreen = new LoginScreen();
