import { remote } from 'webdriverio';

const DEVICE_UDID = '082653335C001041';

async function main() {
  console.log('=== DIAGNOSE FLUTTER INPUT STRATEGIES ===');

  const driver = await remote({
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    logLevel: 'error' as const,
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': DEVICE_UDID,
      'appium:udid': DEVICE_UDID,
      'appium:appPackage': 'com.jarental.jarental',
      'appium:appActivity': 'com.jarental.jarental.MainActivity',
      'appium:noReset': true,
      'appium:newCommandTimeout': 180,
    },
  });

  console.log('Connected to Appium.');

  const countryCode = await driver.$('~+1876');
  await countryCode.waitForDisplayed({ timeout: 10000 });
  console.log('Confirmed on Signup screen.');

  const inputs = await driver.$$('android.widget.EditText');
  const nameInput = inputs[0];

  console.log('\n--- Strategy A: Click first, then setValue ---');
  await nameInput.click();
  await driver.pause(500);
  await nameInput.setValue('Strategy A Name');
  await driver.pause(500);
  await driver.saveScreenshot('screenshots/DIAG_STRATEGY_A.png');
  console.log('Saved DIAG_STRATEGY_A.png. Text in UI tree:', await nameInput.getText());

  console.log('\n--- Strategy B: Click, clear via keys or adb, then sendKeys/keys ---');
  await nameInput.click();
  await driver.pause(500);
  // Send keys using driver.keys
  await driver.keys(['S', 't', 'r', 'a', 't', 'e', 'g', 'y', ' ', 'B']);
  await driver.pause(500);
  await driver.saveScreenshot('screenshots/DIAG_STRATEGY_B.png');
  console.log('Saved DIAG_STRATEGY_B.png. Text in UI tree:', await nameInput.getText());

  console.log('\n--- Strategy C: Click, then adb shell input text ---');
  // We can test adb input text via driver execute or child_process
  
  await driver.deleteSession();
  console.log('Done diagnosis.');
}

main().catch(console.error);
