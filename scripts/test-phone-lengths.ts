import { remote } from 'webdriverio';

const DEVICE_UDID = '082653335C001041';

async function main() {
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

  // If on post signup or dialog, handle it
  const later = await driver.$('android=new UiSelector().descriptionMatches("(?i)later")');
  if (await later.isDisplayed().catch(() => false)) {
    await later.click();
    await driver.pause(1000);
  }

  const startExp = await driver.$('android=new UiSelector().descriptionMatches("(?i)start exploring")');
  if (await startExp.isDisplayed().catch(() => false)) {
    await startExp.click();
    await driver.pause(1000);
    const later2 = await driver.$('android=new UiSelector().descriptionMatches("(?i)later")');
    if (await later2.isDisplayed().catch(() => false)) {
      await later2.click();
      await driver.pause(1000);
    }
  }

  // Check if on Home
  const homeTab = await driver.$('~Home\nTab 1 of 4');
  if (await homeTab.isDisplayed().catch(() => false)) {
    console.log('On Home, navigating to Profile to logout...');
    const profTab = await driver.$('~Profile\nTab 4 of 4');
    await profTab.click();
    await driver.pause(1500);
    const scrollable = await driver.$('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("Log Out"))');
    await scrollable.click();
    await driver.pause(500);
    const confirm = await driver.$('android=new UiSelector().description("Log Out")');
    await confirm.click();
    await driver.pause(1500);
  }

  // Check if on Login
  const signUpLink = await driver.$('~Sign Up');
  if (await signUpLink.isDisplayed().catch(() => false)) {
    await signUpLink.click();
    await driver.pause(1500);
  }

  console.log('Now on Signup screen. Testing phone input length validation...');

  const inputs = await driver.$$('android.widget.EditText');
  const phoneInput = inputs[2];
  await phoneInput.click();
  await driver.pause(300);
  await phoneInput.setValue('12345'); // 5 digits
  await driver.pause(300);

  try { await driver.hideKeyboard(); } catch { /**/ }
  await driver.pause(500);

  const submitBtn = await driver.$('android=new UiSelector().description("Sign Up").clickable(true)');
  await submitBtn.click();
  await driver.pause(1000);

  // Check what happened
  const currentSource = await driver.getPageSource();
  const re = /(?:content-desc|text)="([^"]{2,})"/g;
  const labels: string[] = [];
  let m;
  while ((m = re.exec(currentSource)) !== null) {
    if (m[1] !== 'null') labels.push(m[1]);
  }
  console.log('Resulting screen labels with 5 digits:', [...new Set(labels)]);

  await driver.deleteSession();
}

main().catch(console.error);
