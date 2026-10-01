/**
 * Diagnostic observation script for reproducing the Happy Path Signup flow
 * and capturing detailed timeline & UI hierarchy transitions.
 */
import { remote } from 'webdriverio';
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';

function runSuffix(): string {
  return Date.now().toString().slice(-6);
}

function generateValidSignupData(label = 'user') {
  const suffix = runSuffix();
  return {
    fullName: `QA Test User ${suffix}`,
    email: `qa.${label}.${suffix}@yride.qa`,
    phone: `2${suffix.padStart(6, '0')}`,
    currency: 'USD' as const,
    password: 'Test@123',
  };
}

const DEVICE_UDID = '082653335C001041';

interface UISnapshot {
  timestampMs: number;
  activity: string;
  elements: Array<{ class: string; cd: string; text: string; bounds: string; clickable: boolean }>;
}

async function captureSnapshot(driver: WebdriverIO.Browser): Promise<UISnapshot> {
  let activity = 'unknown';
  try {
    const focusStr = execSync(`adb -s ${DEVICE_UDID} shell dumpsys window | grep mCurrentFocus`, { encoding: 'utf-8' });
    activity = focusStr.trim();
  } catch { /**/ }

  const elements: UISnapshot['elements'] = [];
  try {
    const els = await driver.$$('//*');
    for (const el of els) {
      try {
        const cd = await el.getAttribute('content-desc') || '';
        const text = await el.getText() || '';
        const className = await el.getAttribute('className') || '';
        const bounds = await el.getAttribute('bounds') || '';
        const clickable = (await el.getAttribute('clickable')) === 'true';

        if ((cd && cd.length > 0) || (text && text.length > 0)) {
          elements.push({ class: className, cd, text, bounds, clickable });
        }
      } catch { /**/ }
    }
  } catch { /**/ }

  return {
    timestampMs: Date.now(),
    activity,
    elements,
  };
}

async function main() {
  console.log('=== STARTING OBSERVATION OF HAPPY PATH SIGNUP ===');

  // Ensure app is in foreground
  try {
    execSync(`adb -s ${DEVICE_UDID} shell am start -n com.jarental.jarental/.MainActivity`);
  } catch { /**/ }

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
      'appium:autoGrantPermissions': true,
    },
  });

  console.log('Connected to Appium.');
  await driver.pause(3000);

  // Robust navigation state loop (up to 5 attempts)
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const countryCode = await driver.$('~+1876');
      if (await countryCode.isDisplayed()) {
        console.log('On Signup screen.');
        break;
      }
    } catch { /**/ }

    try {
      const disc = await driver.$('~Disclaimer');
      if (await disc.isDisplayed()) {
        console.log('Detected Disclaimer screen.');
        const cb = await driver.$('android.widget.CheckBox');
        if (await cb.isDisplayed()) {
          const isChecked = await cb.getAttribute('checked');
          if (isChecked !== 'true') await cb.click();
          await driver.pause(500);
        }
        const cont = await driver.$('~Continue');
        await cont.click();
        await driver.pause(1500);
        continue;
      }
    } catch { /**/ }

    try {
      const skip = await driver.$('~Skip');
      if (await skip.isDisplayed()) {
        console.log('Detected Onboarding screen. Skipping...');
        await skip.click();
        await driver.pause(1500);
        continue;
      }
    } catch { /**/ }

    try {
      const loginHeader = await driver.$('~Sign in to Yaride');
      if (await loginHeader.isDisplayed()) {
        console.log('Detected Login screen. Tapping Sign Up...');
        const signUpBtn = await driver.$('~Sign Up');
        await signUpBtn.click();
        await driver.pause(1500);
        continue;
      }
    } catch { /**/ }

    await driver.pause(1000);
  }

  // Confirm on Signup
  const countryCode = await driver.$('~+1876');
  await countryCode.waitForDisplayed({ timeout: 10000 });
  console.log('Confirmed on Signup screen.');

  // 2. Prepare valid test data
  const testData = generateValidSignupData('happy');
  console.log(`Test Data generated:
    FullName: ${testData.fullName}
    Email:    ${testData.email}
    Phone:    ${testData.phone}
    Currency: ${testData.currency}
    Password: ${testData.password}
  `);

  // 3. Fill the form
  const inputs = await driver.$$('android.widget.EditText');
  console.log(`Found ${inputs.length} EditText input fields.`);

  await inputs[0].setValue(testData.fullName);
  await inputs[1].setValue(testData.email);
  await inputs[2].setValue(testData.phone);
  await inputs[3].setValue(testData.password);
  console.log('Form inputs populated.');

  // 4. State immediately before tapping Signup
  console.log('Dismissing keyboard...');
  try { await driver.hideKeyboard(); } catch { /**/ }
  await driver.pause(500);

  const preClickSnapshot = await captureSnapshot(driver);
  console.log('\n--- PRE-CLICK SNAPSHOT ---');
  console.log(`Activity: ${preClickSnapshot.activity}`);
  console.log(`Visible labels (${preClickSnapshot.elements.length} items):`);
  preClickSnapshot.elements.forEach(e => {
    console.log(`  [${e.class}] cd="${e.cd.slice(0, 60)}" text="${e.text.slice(0, 60)}" bounds=${e.bounds} click=${e.clickable}`);
  });

  // Clear device logcat buffer
  try { execSync(`adb -s ${DEVICE_UDID} logcat -c`); } catch { /**/ }

  // 5. Locate and click submit button
  const submitButton = await driver.$('android=new UiSelector().description("Sign Up").clickable(true)');
  const submitBounds = await submitButton.getAttribute('bounds');
  console.log(`\nClicking Sign Up submit button @ bounds: ${submitBounds}...`);
  const clickStartTime = Date.now();
  await submitButton.click();
  console.log('Sign Up button clicked.');

  // 6. Polling timeline: 0.5s, 1s, 2s, 3s, 5s, 8s, 12s, 16s, 20s
  const checkIntervalsMs = [500, 1000, 2000, 3000, 5000, 8000, 12000, 16000, 20000];
  const snapshots: Array<{ offsetMs: number; snapshot: UISnapshot }> = [];

  for (const targetOffset of checkIntervalsMs) {
    const elapsed = Date.now() - clickStartTime;
    const waitNeeded = targetOffset - elapsed;
    if (waitNeeded > 0) {
      await driver.pause(waitNeeded);
    }
    const currentElapsed = Date.now() - clickStartTime;
    const snap = await captureSnapshot(driver);
    snapshots.push({ offsetMs: currentElapsed, snapshot: snap });

    console.log(`\n--- SNAPSHOT AT +${Math.round(currentElapsed / 1000)}s ---`);
    console.log(`Activity: ${snap.activity}`);
    const keyLabels = snap.elements.map(e => e.cd || e.text).filter(t => t.length > 0);
    console.log(`Labels found (${keyLabels.length}): ${JSON.stringify(keyLabels.slice(0, 15))}`);

    // Check if modal or post-signup text detected
    const matched = snap.elements.filter(e => {
      const str = (e.cd + ' ' + e.text).toLowerCase();
      return str.includes('account') || str.includes('created') || str.includes('awesome') ||
             str.includes('exploring') || str.includes('verify') || str.includes('identity') ||
             str.includes('later');
    });

    if (matched.length > 0) {
      console.log(`>>> KEY TARGET ELEMENTS DETECTED AT +${Math.round(currentElapsed / 1000)}s:`);
      matched.forEach(m => console.log(`    [${m.class}] cd="${m.cd}" text="${m.text}" bounds=${m.bounds}`));
    }
  }

  // Dump XML at final state
  console.log('\nDumping UI hierarchy at terminal state...');
  try {
    const pageSource = await driver.getPageSource();
    fs.writeFileSync('scripts/terminal_state.xml', pageSource, 'utf-8');
    console.log('Saved page source to scripts/terminal_state.xml');
  } catch (e) {
    console.error('Failed to dump page source:', e);
  }

  // Dump relevant logcat
  console.log('\nChecking logcat for com.jarental.jarental...');
  try {
    const logcatOutput = execSync(`adb -s ${DEVICE_UDID} logcat -d -t 150`, { encoding: 'utf-8' });
    const relevantLines = logcatOutput.split('\n').filter(l =>
      l.includes('jarental') || l.includes('flutter') || l.includes('Http') || l.includes('signup') || l.includes('Error')
    );
    console.log(`Relevant logcat lines (${relevantLines.length}):`);
    relevantLines.slice(-25).forEach(l => console.log(`  ${l.trim()}`));
  } catch { /**/ }

  await driver.deleteSession();
  console.log('\n=== OBSERVATION COMPLETE ===');
}

main().catch(e => {
  console.error('FATAL IN OBSERVATION SCRIPT:', e);
  process.exit(1);
});
