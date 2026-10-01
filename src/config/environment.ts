import dotenv from 'dotenv';
import path from 'node:path';

// Load environment variables from .env file if present
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface EnvironmentConfig {
  appium: {
    host: string;
    port: number;
    path: string;
  };
  android: {
    udid: string;
    automationName: string;
    appPackage: string;
    appActivity: string;
    noReset: boolean;
    newCommandTimeout: number;
  };
  timeouts: {
    explicitWait: number;
    cucumberStep: number;
  };
  logging: {
    level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
  };
  testUser: {
    email?: string;
    password?: string;
  };
}

export const config: EnvironmentConfig = {
  appium: {
    host: process.env.APPIUM_HOST || '127.0.0.1',
    port: Number.parseInt(process.env.APPIUM_PORT || '4723', 10),
    path: process.env.APPIUM_PATH || '/',
  },
  android: {
    udid: process.env.ANDROID_DEVICE_UDID || '',
    automationName: process.env.ANDROID_AUTOMATION_NAME || 'UiAutomator2',
    appPackage: process.env.ANDROID_APP_PACKAGE || 'com.jarental.jarental',
    appActivity: process.env.ANDROID_APP_ACTIVITY || 'com.jarental.jarental.MainActivity',
    noReset: process.env.ANDROID_NO_RESET !== 'false',
    newCommandTimeout: Number.parseInt(process.env.NEW_COMMAND_TIMEOUT || '240', 10),
  },
  timeouts: {
    explicitWait: Number.parseInt(process.env.EXPLICIT_WAIT_TIMEOUT || '15000', 10),
    cucumberStep: Number.parseInt(process.env.CUCUMBER_STEP_TIMEOUT || '60000', 10),
  },
  logging: {
    level: (process.env.LOG_LEVEL as EnvironmentConfig['logging']['level']) || 'info',
  },
  testUser: {
    email: process.env.YRIDE_TEST_EMAIL || process.env['YRID\u0415_TEST_EMAIL'],
    password: process.env.YRIDE_TEST_PASSWORD || process.env['YRID\u0415_TEST_PASSWORD'],
  },
};
