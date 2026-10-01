import { $, $$ } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import { BaseScreen } from '../core/BaseScreen.js';
import { logger } from '../utils/logger.js';

/**
 * SignupScreen
 *
 * Encapsulates all locators and actions for the YRide Signup / Registration screen.
 *
 * === Locator Strategy ===
 *
 * Priority 1 (preferred): Accessibility ID (content-desc) via `~` prefix.
 * Priority 2: Native Android class + index for Flutter EditText fields.
 * Priority 3: XPath — only used when no stable alternative exists.
 *
 * === Flutter EditText Notes ===
 *
 * The YRide app is Flutter-based. Flutter does not assign individual
 * accessibility IDs to text input fields by default. On the Signup screen,
 * the five text inputs are rendered as android.widget.EditText in order:
 *
 *   Index 0 → Full Name
 *   Index 1 → Email
 *   Index 2 → Phone (subscriber number only; +1 876 prefix is pre-set)
 *   Index 3 → Password
 *   Index 4 → Referral Code (optional)
 *
 * This index-based approach is a documented fallback. If the UI order changes,
 * these getters must be re-verified against the live device.
 *
 * === Currency Selection ===
 *
 * Currency defaults to USD. Selecting JMD opens a dropdown/modal. The
 * accessibility IDs for the dropdown options are documented inline.
 *
 * === Post-Signup ===
 *
 * Signup submission and success/error detection are handled here.
 * Post-signup navigation (success dialog, identity verification) is
 * delegated to PostSignupScreen.
 */
export class SignupScreen extends BaseScreen {
  // ---------------------------------------------------------------------------
  // Locators
  // ---------------------------------------------------------------------------

  public static readonly LOCATORS = {
    // Screen identity — unique element that confirms we are on the Signup screen
    COUNTRY_CODE: '~+1876',

    // Navigation links
    SIGN_UP_BUTTON: '~Sign Up',
    SIGN_IN_LINK: '~Sign In',

    // Legal statement links (informational — not a checkbox)
    TERMS_LINK: '~Terms of Service ',  // Note: trailing space in Flutter content-desc
    PRIVACY_LINK: '~Privacy Policy.',

    // Currency selector defaults
    CURRENCY_USD: '~USD',
    CURRENCY_JMD: '~JMD',

    // Currency dropdown option accessibility IDs (visible when dropdown is open)
    CURRENCY_OPTION_USD: '~USD',
    CURRENCY_OPTION_JMD: '~JMD',
  } as const;

  // ---------------------------------------------------------------------------
  // Element getters — screen indicator
  // ---------------------------------------------------------------------------

  public get countryCodeButton(): ChainablePromiseElement {
    return $(SignupScreen.LOCATORS.COUNTRY_CODE);
  }

  // ---------------------------------------------------------------------------
  // Element getters — input fields (index-based Flutter EditText fallback)
  // ---------------------------------------------------------------------------

  /**
   * Full Name input — EditText at index 0.
   */
  public get fullNameInput(): ChainablePromiseElement {
    return $$('android.widget.EditText')[0];
  }

  /**
   * Email input — EditText at index 1.
   */
  public get emailInput(): ChainablePromiseElement {
    return $$('android.widget.EditText')[1];
  }

  /**
   * Phone subscriber number input — EditText at index 2.
   * The +1 876 country code is pre-populated; only the subscriber number
   * is entered into this field.
   */
  public get phoneInput(): ChainablePromiseElement {
    return $$('android.widget.EditText')[2];
  }

  /**
   * Password input — EditText at index 3.
   */
  public get passwordInput(): ChainablePromiseElement {
    return $$('android.widget.EditText')[3];
  }

  /**
   * Referral Code input — EditText at index 4 (optional field).
   */
  public get referralCodeInput(): ChainablePromiseElement {
    return $$('android.widget.EditText')[4];
  }

  // ---------------------------------------------------------------------------
  // Element getters — currency
  // ---------------------------------------------------------------------------

  /**
   * Currency selector button (shows current selection: USD or JMD).
   * Uses the current currency value as the content-desc.
   */
  public get currencyButton(): ChainablePromiseElement {
    return $(SignupScreen.LOCATORS.CURRENCY_USD);
  }

  /**
   * USD option in the currency dropdown (used after dropdown is open).
   */
  public get currencyOptionUSD(): ChainablePromiseElement {
    return $(SignupScreen.LOCATORS.CURRENCY_OPTION_USD);
  }

  /**
   * JMD option in the currency dropdown (used after dropdown is open).
   */
  public get currencyOptionJMD(): ChainablePromiseElement {
    return $(SignupScreen.LOCATORS.CURRENCY_OPTION_JMD);
  }

  // ---------------------------------------------------------------------------
  // Element getters — legal links and action buttons
  // ---------------------------------------------------------------------------

  public get termsLink(): ChainablePromiseElement {
    return $(SignupScreen.LOCATORS.TERMS_LINK);
  }

  public get privacyLink(): ChainablePromiseElement {
    return $(SignupScreen.LOCATORS.PRIVACY_LINK);
  }

  public get signUpButton(): ChainablePromiseElement {
    // Target the clickable submit button at the bottom (header has clickable=false)
    return $('android=new UiSelector().description("Sign Up").clickable(true)');
  }

  public get signInLink(): ChainablePromiseElement {
    return $(SignupScreen.LOCATORS.SIGN_IN_LINK);
  }

  // ---------------------------------------------------------------------------
  // State queries
  // ---------------------------------------------------------------------------

  /**
   * Returns true if the Signup screen is currently visible.
   * Uses the country code button (+1876) as the screen identity anchor
   * because it is unique to the Signup screen and always visible.
   */
  public async isDisplayed(): Promise<boolean> {
    logger.debug('SignupScreen', 'Checking if Signup screen is displayed');
    return await super.isDisplayed(this.countryCodeButton);
  }

  public async isFullNameInputDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.fullNameInput);
  }

  public async isEmailInputDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.emailInput);
  }

  public async isPhoneInputDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.phoneInput);
  }

  public async isPasswordInputDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.passwordInput);
  }

  public async isReferralCodeInputDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.referralCodeInput);
  }

  public async isTermsLinkDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.termsLink);
  }

  public async isPrivacyLinkDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.privacyLink);
  }

  public async isSignUpButtonDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.signUpButton);
  }

  public async isSignInLinkDisplayed(): Promise<boolean> {
    return await super.isDisplayed(this.signInLink);
  }

  // ---------------------------------------------------------------------------
  // Actions — field entry
  // ---------------------------------------------------------------------------

  public async enterFullName(fullName: string): Promise<void> {
    logger.info('SignupScreen', `Entering full name: ${fullName}`);
    await this.setValue(this.fullNameInput, fullName, 'FullNameInput', false);
  }

  public async enterEmail(email: string): Promise<void> {
    logger.info('SignupScreen', `Entering email: ${email}`);
    await this.setValue(this.emailInput, email, 'EmailInput', false);
  }

  public async enterPhone(phone: string): Promise<void> {
    logger.info('SignupScreen', `Entering phone subscriber number: ${phone}`);
    await this.setValue(this.phoneInput, phone, 'PhoneInput', false);
  }

  public async enterPassword(password: string): Promise<void> {
    logger.info('SignupScreen', 'Entering password (masked)');
    await this.setValue(this.passwordInput, password, 'PasswordInput', true);
  }

  public async enterReferralCode(code: string): Promise<void> {
    logger.info('SignupScreen', `Entering referral code: ${code}`);
    await this.setValue(this.referralCodeInput, code, 'ReferralCodeInput', false);
  }

  // ---------------------------------------------------------------------------
  // Actions — currency selection
  // ---------------------------------------------------------------------------

  /**
   * Selects USD currency.
   * If USD is already selected (default), this is a no-op after confirming state.
   */
  public async selectCurrencyUSD(): Promise<void> {
    logger.info('SignupScreen', 'Selecting USD currency');
    // Open the currency selector by tapping the current currency button
    await this.safeClick(this.currencyButton, 'Currency Button');
    // Select USD from the dropdown
    await this.safeClick(this.currencyOptionUSD, 'Currency USD Option');
  }

  /**
   * Selects JMD currency.
   * Opens the currency dropdown and taps the JMD option.
   */
  public async selectCurrencyJMD(): Promise<void> {
    logger.info('SignupScreen', 'Selecting JMD currency');
    await this.safeClick(this.currencyButton, 'Currency Button');
    await this.safeClick(this.currencyOptionJMD, 'Currency JMD Option');
  }

  // ---------------------------------------------------------------------------
  // Actions — navigation
  // ---------------------------------------------------------------------------

  public async clickSignUp(): Promise<void> {
    logger.info('SignupScreen', 'Clicking Sign Up submit button');
    try {
      await browser.hideKeyboard();
    } catch {
      // Keyboard may already be hidden
    }
    await browser.pause(500);
    await this.safeClick(this.signUpButton, 'Sign Up Submit Button');
  }

  public async clickSignInLink(): Promise<void> {
    logger.info('SignupScreen', 'Clicking Sign In link to return to Login screen');
    try {
      await browser.hideKeyboard();
    } catch {
      // Keyboard may already be hidden
    }
    await browser.pause(300);
    await this.safeClick(this.signInLink, 'Sign In Link');
  }

  // ---------------------------------------------------------------------------
  // Validation message reading
  // ---------------------------------------------------------------------------

  /**
   * Attempts to read a visible toast or validation message text.
   *
   * YRide displays server-side validation messages (e.g. "Invalid mobile number",
   * "Already exists mobile number") as transient toast-style alerts.
   *
   * Strategy:
   * - Flutter toasts are rendered as android.widget.Toast or within a FrameLayout.
   * - UiAutomator2 can read toast text if it appears within the capture window.
   *
   * NOTE: Toast visibility is transient. This method should be called
   * immediately after the triggering action (Submit click).
   *
   * If the toast cannot be captured within the timeout, returns null.
   * Callers should handle null gracefully and rely on secondary verification.
   */
  public async getValidationMessage(timeout = 3000): Promise<string | null> {
    // 1. Check for native Android Toast
    try {
      const toastEl = await $('//android.widget.Toast');
      await toastEl.waitForDisplayed({ timeout: Math.min(timeout, 2000) });
      const text = await toastEl.getText();
      if (text) return text;
    } catch {
      // No Toast
    }

    // 2. Check for Flutter inline validation messages (rendered as Views with error content-desc)
    try {
      const inlineError = await $('android=new UiSelector().descriptionMatches("(?i).*(invalid|already exist|please enter|error).*")');
      if (await inlineError.isDisplayed()) {
        return await inlineError.getAttribute('content-desc');
      }
    } catch {
      // No inline error
    }

    // 3. Fallback to Snackbar/FrameLayout
    try {
      const snackbarEl = await $('//android.widget.FrameLayout[@content-desc]');
      if (await snackbarEl.isDisplayed()) {
        return await snackbarEl.getAttribute('content-desc');
      }
    } catch {
      // Neither available
    }

    return null;
  }

  /**
   * Waits for and returns any on-screen validation or error message.
   * Returns null if no message appears within the timeout.
   */
  public async waitForValidationMessage(timeout = 8000): Promise<string | null> {
    logger.debug('SignupScreen', `Waiting up to ${timeout}ms for validation message`);
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const message = await this.getValidationMessage(1500);
      if (message) {
        logger.info('SignupScreen', `Validation message received: "${message}"`);
        return message;
      }
      await browser.pause(300);
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // High-level composite actions
  // ---------------------------------------------------------------------------

  /**
   * Fills the complete Signup form with provided data and submits.
   * Does not assert the outcome — the caller is responsible for verification.
   */
  public async fillAndSubmit(options: {
    fullName: string;
    email: string;
    phone: string;
    currency?: 'USD' | 'JMD';
    password: string;
    referralCode?: string;
  }): Promise<void> {
    logger.info('SignupScreen', 'Filling and submitting Signup form');

    await this.enterFullName(options.fullName);
    await this.enterEmail(options.email);
    await this.enterPhone(options.phone);

    if (options.currency === 'JMD') {
      await this.selectCurrencyJMD();
    }
    // USD is the default — no action needed unless explicitly switching

    await this.enterPassword(options.password);

    if (options.referralCode) {
      await this.enterReferralCode(options.referralCode);
    }

    await this.clickSignUp();
  }
}

export const signupScreen = new SignupScreen();
