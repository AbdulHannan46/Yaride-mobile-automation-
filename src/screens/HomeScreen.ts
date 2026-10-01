import { BaseScreen } from '../core/BaseScreen.js';
import { bottomNavComponent } from '../components/BottomNavComponent.js';
import { logger } from '../utils/logger.js';

/**
 * HomeScreen represents the main dashboard/landing screen of the YRide application.
 */
export class HomeScreen extends BaseScreen {
  /**
   * Waits for the Home screen indicator to be displayed within timeout.
   */
  public async waitForHomeDisplayed(timeout: number = this.defaultTimeout): Promise<boolean> {
    logger.debug('HomeScreen', `Waiting for Home screen to display within ${timeout}ms`);
    return await bottomNavComponent.waitForHomeDisplayed(timeout);
  }

  /**
   * Verifies that the Home screen is displayed on screen.
   */
  public async isHomeDisplayed(): Promise<boolean> {
    logger.debug('HomeScreen', 'Checking if Home screen is displayed');
    return await bottomNavComponent.isHomeDisplayed();
  }

  /**
   * Verifies that the Home section is currently selected.
   */
  public async isHomeSelected(): Promise<boolean> {
    logger.debug('HomeScreen', 'Checking if Home tab is selected');
    return await bottomNavComponent.isHomeSelected();
  }

  /**
   * Navigates to the Home tab via bottom navigation.
   */
  public async navigateToHome(): Promise<void> {
    logger.info('HomeScreen', 'Navigating to Home tab');
    await bottomNavComponent.navigateToHome();
  }

  /**
   * Navigates to the Explore tab via bottom navigation.
   */
  public async navigateToExplore(): Promise<void> {
    logger.info('HomeScreen', 'Navigating to Explore tab');
    await bottomNavComponent.navigateToExplore();
  }

  /**
   * Navigates to the Favorites tab via bottom navigation.
   */
  public async navigateToFavorites(): Promise<void> {
    logger.info('HomeScreen', 'Navigating to Favorites tab');
    await bottomNavComponent.navigateToFavorites();
  }

  /**
   * Navigates to the Profile tab via bottom navigation.
   */
  public async navigateToProfile(): Promise<void> {
    logger.info('HomeScreen', 'Navigating to Profile tab');
    await bottomNavComponent.navigateToProfile();
  }
}

export const homeScreen = new HomeScreen();
