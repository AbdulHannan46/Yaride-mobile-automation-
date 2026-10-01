import { $ } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import { BaseScreen } from '../core/BaseScreen.js';
import { logger } from '../utils/logger.js';

/**
 * BottomNavComponent encapsulates the persistent bottom navigation bar
 * shared across Home, Explore, Favorites, and Profile sections.
 */
export class BottomNavComponent extends BaseScreen {
  /**
   * Verified Accessibility ID locators for bottom navigation tabs.
   * On Android UiAutomator2, the accessibility description contains a newline ("\n").
   */
  public static readonly LOCATORS = {
    HOME_TAB: '~Home\nTab 1 of 4',
    EXPLORE_TAB: '~Explore\nTab 2 of 4',
    FAVORITES_TAB: '~Favorites\nTab 3 of 4',
    PROFILE_TAB: '~Profile\nTab 4 of 4',
  } as const;

  public get homeTab(): ChainablePromiseElement {
    return $(BottomNavComponent.LOCATORS.HOME_TAB);
  }

  public get exploreTab(): ChainablePromiseElement {
    return $(BottomNavComponent.LOCATORS.EXPLORE_TAB);
  }

  public get favoritesTab(): ChainablePromiseElement {
    return $(BottomNavComponent.LOCATORS.FAVORITES_TAB);
  }

  public get profileTab(): ChainablePromiseElement {
    return $(BottomNavComponent.LOCATORS.PROFILE_TAB);
  }

  /**
   * Waits for the Home tab to be displayed within timeout.
   */
  public async waitForHomeDisplayed(timeout: number = this.defaultTimeout): Promise<boolean> {
    logger.debug('BottomNavComponent', `Waiting for Home tab to display within ${timeout}ms`);
    return await this.waitForDisplayed(this.homeTab, timeout);
  }

  /**
   * Verifies that the Home bottom navigation element is displayed on screen.
   */
  public async isHomeDisplayed(): Promise<boolean> {
    logger.debug('BottomNavComponent', 'Checking if Home tab is displayed');
    return await this.isDisplayed(this.homeTab);
  }

  /**
   * Verifies that the Home bottom navigation element is currently marked as selected.
   */
  public async isHomeSelected(): Promise<boolean> {
    logger.debug('BottomNavComponent', 'Checking if Home tab is selected');
    return await this.isSelected(this.homeTab);
  }

  /**
   * Navigates to the Home section via the bottom navigation bar.
   */
  public async navigateToHome(): Promise<void> {
    logger.info('BottomNavComponent', 'Navigating to Home tab');
    await this.safeClick(this.homeTab, 'Home Tab');
  }

  /**
   * Navigates to the Explore section via the bottom navigation bar.
   */
  public async navigateToExplore(): Promise<void> {
    logger.info('BottomNavComponent', 'Navigating to Explore tab');
    await this.safeClick(this.exploreTab, 'Explore Tab');
  }

  /**
   * Navigates to the Favorites section via the bottom navigation bar.
   */
  public async navigateToFavorites(): Promise<void> {
    logger.info('BottomNavComponent', 'Navigating to Favorites tab');
    await this.safeClick(this.favoritesTab, 'Favorites Tab');
  }

  /**
   * Navigates to the Profile section via the bottom navigation bar.
   */
  public async navigateToProfile(): Promise<void> {
    logger.info('BottomNavComponent', 'Navigating to Profile tab');
    await this.safeClick(this.profileTab, 'Profile Tab');
  }
}

export const bottomNavComponent = new BottomNavComponent();
