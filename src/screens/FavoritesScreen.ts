import { $ } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import { BaseScreen } from '../core/BaseScreen.js';
import { logger } from '../utils/logger.js';

export class FavoritesScreen extends BaseScreen {
  public static readonly LOCATOR = '~Favorites\nTab 3 of 4';

  public get favoritesTab(): ChainablePromiseElement {
    return $(FavoritesScreen.LOCATOR);
  }

  /**
   * Verifies if the Favorites section indicator/tab is displayed.
   */
  public async isDisplayed(): Promise<boolean> {
    logger.debug('FavoritesScreen', 'Verifying Favorites tab is displayed');
    return await super.isDisplayed(this.favoritesTab);
  }

  /**
   * Verifies if the Favorites section is active (tab is selected).
   */
  public async isSelected(): Promise<boolean> {
    logger.debug('FavoritesScreen', 'Verifying Favorites tab is selected');
    return await super.isSelected(this.favoritesTab);
  }
}

export const favoritesScreen = new FavoritesScreen();
