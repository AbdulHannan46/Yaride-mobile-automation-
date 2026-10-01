import { config as envConfig } from './environment.js';

/**
 * Generates typed WebdriverIO capabilities for Android UiAutomator2 automation.
 */
export function getAndroidCapabilities(): WebdriverIO.Capabilities[] {
  const capabilities: WebdriverIO.Capabilities = {
    platformName: 'Android',
    'appium:automationName': envConfig.android.automationName,
    'appium:appPackage': envConfig.android.appPackage,
    'appium:appActivity': envConfig.android.appActivity,
    'appium:noReset': envConfig.android.noReset,
    'appium:newCommandTimeout': envConfig.android.newCommandTimeout,
    'appium:autoGrantPermissions': false,
    'appium:ensureWebviewsHavePages': true,
    'appium:nativeWebScreenshot': true,
    'appium:waitForIdleTimeout': 0,
    'appium:skipServerInstallation': true,
    'appium:uiautomator2ServerLaunchTimeout': 60000,
    'appium:uiautomator2ServerInstallTimeout': 60000,
    'appium:adbExecTimeout': 60000,
  };

  if (envConfig.android.udid) {
    capabilities['appium:udid'] = envConfig.android.udid;
  }

  return [capabilities];
}
