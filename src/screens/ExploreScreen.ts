import { $ } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import { BaseScreen } from '../core/BaseScreen.js';
import { logger } from '../utils/logger.js';

export class ExploreScreen extends BaseScreen {
  public static readonly LOCATOR = '~Explore\nTab 2 of 4';

  public get exploreTab(): ChainablePromiseElement {
    return $(ExploreScreen.LOCATOR);
  }

  /**
   * Verifies if the Explore section indicator/tab is displayed.
   */
  public async isDisplayed(): Promise<boolean> {
    logger.debug('ExploreScreen', 'Verifying Explore tab is displayed');
    return await super.isDisplayed(this.exploreTab);
  }

  /**
   * Verifies if the Explore section is active (tab is selected).
   */
  public async isSelected(): Promise<boolean> {
    logger.debug('ExploreScreen', 'Verifying Explore tab is selected');
    return await super.isSelected(this.exploreTab);
  }
}

export const exploreScreen = new ExploreScreen();
