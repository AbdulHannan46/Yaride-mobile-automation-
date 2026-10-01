/**
 * Post-Signup UI Discovery — captures content-desc values after successful signup.
 * Uses ADB shell input to avoid Appium locking the UI dump.
 */
import { remote } from 'webdriverio';

const DEVICE_UDID = '082653335C001041';

async function main() {
  console.log('Connecting...');
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
    }
  });

  console.log('Session started');
  
  // If on Login, navigate to Signup
  try {
    const signUp = await driver.$('~Sign Up');
    if (await signUp.isDisplayed()) {
      console.log('On Login — tapping Sign Up');
      await signUp.click();
      await driver.pause(2000);
    }
  } catch { /* already on Signup */ }

  // Print all elements with content-desc to understand Signup screen
  console.log('\n=== SIGNUP SCREEN: elements with content-desc ===');
  const allViews = await driver.$$('android.view.View');
  for (const v of allViews) {
    try {
      const cd = await v.getAttribute('content-desc');
      const bounds = await v.getAttribute('bounds');
      if (cd && cd.length > 1) {
        console.log(`View: "${cd}" @ ${bounds}`);
      }
    } catch { /* skip */ }
  }
  
  const allBtns = await driver.$$('android.widget.Button');
  for (const b of allBtns) {
    try {
      const cd = await b.getAttribute('content-desc');
      const bounds = await b.getAttribute('bounds');
      if (cd && cd.length >= 1) {
        console.log(`Button: "${cd}" @ ${bounds}`);
      }
    } catch { /* skip */ }
  }

  // Fill and submit
  const suffix = Date.now().toString().slice(-6);
  const email = `qa.post.${suffix}@yride.qa`;
  const phone = `3${suffix}`;

  const inputs = await driver.$$('android.widget.EditText');
  console.log(`\nEditText count: ${inputs.length}`);
  
  await inputs[0].setValue('QA Post Signup');
  await inputs[1].setValue(email);
  await inputs[2].setValue(phone);
  await inputs[3].setValue('Test@123');
  console.log(`Filled: email=${email}, phone=${phone}`);

  // Find Sign Up submit button (same content-desc as header but it's a button)
  const submitBtn = await driver.$('~Sign Up');
  await submitBtn.click();
  console.log('Submitted');

  // Wait for response (up to 10 seconds)
  await driver.pause(8000);

  // Capture all elements on screen
  console.log('\n=== POST-SUBMIT SCREEN STATE ===');
  const allElements = await driver.$$('*');
  const seen = new Set<string>();
  for (const el of allElements) {
    try {
      const cd = await el.getAttribute('content-desc');
      const text = await el.getText().catch(() => '');
      const cls = await el.getAttribute('class');
      if (cd && cd.length > 1 && !seen.has(cd)) {
        seen.add(cd);
        console.log(`[${cls}] content-desc: "${cd}"`);
      }
      if (text && text.length > 1 && !seen.has(text)) {
        seen.add(text);
        console.log(`[${cls}] text: "${text}"`);
      }
    } catch { /* skip */ }
  }

  await driver.deleteSession();
  console.log('\nDone.');
}

main().catch(e => { console.error('Error:', e); process.exit(1); });
