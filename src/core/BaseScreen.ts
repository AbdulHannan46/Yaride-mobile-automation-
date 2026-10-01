import type { ChainablePromiseElement } from 'webdriverio';
import { logger } from '../utils/logger.js';
import { captureScreenshot } from '../utils/screenshot.js';
import { config } from '../config/environment.js';

/**
 * BaseScreen provides foundational interaction methods, explicit synchronization,
 * and resilient logging for all application screen objects.
 */
export abstract class BaseScreen {
  protected defaultTimeout: number;

  constructor() {
    this.defaultTimeout = config.timeouts.explicitWait;
  }

  /**
   * Waits for an element to be displayed within the specified timeout.
   */
  public async waitForDisplayed(
    element: ChainablePromiseElement,
    timeout: number = this.defaultTimeout
  ): Promise<boolean> {
    try {
      await element.waitForDisplayed({ timeout });
      return true;
    } catch (error) {
      logger.error('BaseScreen', `Element failed to display within ${timeout}ms`, error);
      throw error;
    }
  }

  /**
   * Safely clicks an element after ensuring it is displayed on screen.
   */
  public async safeClick(
    element: ChainablePromiseElement,
    elementName: string = 'Element',
    timeout: number = this.defaultTimeout
  ): Promise<void> {
    logger.info('BaseScreen', `Clicking ${elementName}`);
    try {
      await element.waitForDisplayed({ timeout });
      await element.click();
    } catch (error) {
      logger.error('BaseScreen', `Failed to click ${elementName}`, error);
      throw error;
    }
  }

  /**
   * Verifies if an element is currently displayed without throwing immediately.
   */
  public async isDisplayed(element: ChainablePromiseElement): Promise<boolean> {
    try {
      return await element.isDisplayed();
    } catch (error) {
      const msg = (error as Error)?.message || '';
      if (
        msg.includes('instrumentation process is not running') ||
        msg.includes('NoSuchSession') ||
        msg.includes('session closed') ||
        msg.includes('A session is either terminated or not started')
      ) {
        throw error;
      }
      return false;
    }
  }

  /**
   * Verifies if an element is currently selected.
   */
  public async isSelected(element: ChainablePromiseElement): Promise<boolean> {
    try {
      return await element.isSelected();
    } catch {
      return false;
    }
  }

  /**
   * Gets text from an element safely after ensuring visibility.
   */
  public async getText(
    element: ChainablePromiseElement,
    timeout: number = this.defaultTimeout
  ): Promise<string> {
    await element.waitForDisplayed({ timeout });
    return await element.getText();
  }

  /**
   * Sets value into an input element after clearing existing content.
   */
  public async setValue(
    element: ChainablePromiseElement,
    value: string,
    elementName: string = 'InputField',
    isSecret: boolean = false
  ): Promise<void> {
    logger.info(
      'BaseScreen',
      `Entering value into ${elementName}: ${isSecret ? '***REDACTED***' : value}`
    );
    await element.waitForDisplayed({ timeout: this.defaultTimeout });
    // In Flutter on Android, tapping the field activates Flutter's TextInputPlugin/IME connection
    // so that setValue commits the text into Flutter's Dart TextEditingController.
    await element.click();
    await browser.pause(400);
    await element.clearValue();
    await element.setValue(value);
    await browser.pause(300);
  }

  /**
   * Captures a screenshot of the current screen state.
   */
  public async takeScreenshot(label: string): Promise<string | null> {
    return await captureScreenshot(label);
  }
}
