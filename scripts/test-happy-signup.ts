import { remote } from 'webdriverio';
import * as fs from 'node:fs';

const DEVICE_UDID = '082653335C001041';

function runSuffix(): string {
  return Date.now().toString().slice(-6);
}

async function main() {
  console.log('=== TEST HAPPY SIGNUP WITH TIMELINE CAPTURE ===');

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

  // Check if on Disclaimer screen
  const disclaimer = await driver.$('~Disclaimer');
  if (await disclaimer.isDisplayed().catch(() => false)) {
    console.log('On Disclaimer screen, accepting terms...');
    const cb = await driver.$('android.widget.CheckBox');
    await cb.click();
    await driver.pause(500);
    const cont = await driver.$('~Continue');
    await cont.click();
    await driver.pause(1000);
  }

  // Check if on Onboarding screen
  const skipBtn = await driver.$('~Skip');
  if (await skipBtn.isDisplayed().catch(() => false)) {
    console.log('On Onboarding screen, skipping...');
    await skipBtn.click();
    await driver.pause(1000);
  }

  // Check if on Login screen
  const ccCheck = await driver.$('~+1876');
  if (!(await ccCheck.isDisplayed().catch(() => false))) {
    const signUpLink = await driver.$('~Sign Up');
    if (await signUpLink.isDisplayed().catch(() => false)) {
      console.log('On Login screen, navigating to Signup...');
      await signUpLink.click();
      await driver.pause(1000);
    }
  }

  // Ensure on Signup screen
  const countryCode = await driver.$('~+1876');
  await countryCode.waitForDisplayed({ timeout: 10000 });
  console.log('Confirmed on Signup screen.');

  // Generate unique test data
  // Note: we test with standard @gmail.com domain to ensure domain format is 100% standard
  const suffix = runSuffix();
  const testData = {
    fullName: `QA User ${suffix}`,
    email: `qa.user.${suffix}@gmail.com`,
    phone: `2${suffix}`,
    password: 'Test@123',
  };

  console.log(`Filling form with:
    Full Name: ${testData.fullName}
    Email:     ${testData.email}
    Phone:     ${testData.phone}
    Password:  ${testData.password}
  `);

  const inputs = await driver.$$('android.widget.EditText');
  
  // Full Name
  await inputs[0].click();
  await driver.pause(300);
  await inputs[0].setValue(testData.fullName);
  await driver.pause(300);

  // Email
  await inputs[1].click();
  await driver.pause(300);
  await inputs[1].setValue(testData.email);
  await driver.pause(300);

  // Phone
  await inputs[2].click();
  await driver.pause(300);
  await inputs[2].setValue(testData.phone);
  await driver.pause(300);

  // Password
  await inputs[3].click();
  await driver.pause(300);
  await inputs[3].setValue(testData.password);
  await driver.pause(300);

  try { await driver.hideKeyboard(); } catch { /**/ }
  await driver.pause(500);

  // Screenshot 1: Form Filled
  await driver.saveScreenshot('screenshots/TIMELINE_0_FORM_FILLED.png');
  console.log('Saved screenshots/TIMELINE_0_FORM_FILLED.png');

  // Submit
  const submitBtn = await driver.$('android=new UiSelector().description("Sign Up").clickable(true)');
  console.log('Clicking Sign Up submit button...');
  await submitBtn.click();
  const clickTime = Date.now();
  console.log('Submit button clicked.');

  // Timeline intervals: 1s, 3s, 6s, 10s, 15s
  const checkpoints = [1000, 3000, 6000, 10000, 15000];

  for (let i = 0; i < checkpoints.length; i++) {
    const target = checkpoints[i];
    const elapsed = Date.now() - clickTime;
    if (target > elapsed) {
      await driver.pause(target - elapsed);
    }
    const currentSec = Math.round((Date.now() - clickTime) / 1000);
    const ssPath = `screenshots/TIMELINE_${currentSec}S_AFTER_SUBMIT.png`;
    await driver.saveScreenshot(ssPath);
    console.log(`Saved ${ssPath}`);

    const source = await driver.getPageSource();
    fs.writeFileSync(`screenshots/TIMELINE_${currentSec}S_SOURCE.xml`, source, 'utf-8');

    // Extract all visible labels
    const re = /(?:content-desc|text)="([^"]{2,})"/g;
    const labels: string[] = [];
    let m;
    while ((m = re.exec(source)) !== null) {
      if (m[1] !== 'null') labels.push(m[1]);
    }
    console.log(`[+${currentSec}s] Unique labels (${labels.length}):`, [...new Set(labels)]);
  }

  await driver.deleteSession();
  console.log('=== TEST TIMELINE COMPLETE ===');
}

main().catch(console.error);
