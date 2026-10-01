import { remote } from 'webdriverio';

async function main() {
  const driver = await remote({
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    logLevel: 'error' as const,
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': '082653335C001041',
      'appium:udid': '082653335C001041',
      'appium:appPackage': 'com.jarental.jarental',
      'appium:appActivity': 'com.jarental.jarental.MainActivity',
      'appium:noReset': true,
    },
  });

  const source = await driver.getPageSource();
  const re = /(?:content-desc|text)="([^"]{2,})"/g;
  const labels: string[] = [];
  let m;
  while ((m = re.exec(source)) !== null) {
    if (m[1] !== 'null') labels.push(m[1]);
  }
  console.log('LABELS ON SCREEN:');
  [...new Set(labels)].forEach((l) => console.log('  ' + l));
  await driver.deleteSession();
}

main().catch(console.error);
