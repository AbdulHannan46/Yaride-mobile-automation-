import { Before, After, AfterStep } from '@wdio/cucumber-framework';
import { logger } from '../../utils/logger.js';
import { captureScreenshot } from '../../utils/screenshot.js';

/**
 * Cucumber lifecycle hooks.
 *
 * Responsibilities:
 * - Log scenario lifecycle events (start/end).
 * - Capture and attach failure screenshots to Allure.
 * - Provide clean, concise diagnostics without flooding the console.
 *
 * Screenshot policy:
 * - Screenshots are captured ONLY on step failure.
 * - No screenshots are taken during successful step execution.
 */

Before(async (scenario) => {
  logger.info(
    'CucumberHook',
    `==================== SCENARIO START: "${scenario.pickle.name}" ====================`
  );
});

AfterStep(async (step) => {
  if (step.result.status === 'FAILED') {
    const scenarioName = step.pickle.name;
    const stepText = step.pickleStep.text;
    const label = `FAIL_${scenarioName}_${stepText}`;

    logger.error(
      'CucumberHook',
      `Step FAILED: "${stepText}" in scenario "${scenarioName}"`
    );

    // Capture failure screenshot and attach to Allure
    const screenshotPath = await captureScreenshot(label);
    if (screenshotPath) {
      logger.info('CucumberHook', `Failure screenshot saved: ${screenshotPath}`);
    } else {
      logger.warn('CucumberHook', 'Failure screenshot could not be captured');
    }
  }
});

let scenarioCount = 0;

After(async (scenario) => {
  scenarioCount++;
  const status = scenario.result?.status ?? 'UNKNOWN';
  if (status === 'PASSED') {
    logger.info(
      'CucumberHook',
      `==================== SCENARIO PASSED: "${scenario.pickle.name}" ====================`
    );
  } else {
    logger.error(
      'CucumberHook',
      `==================== SCENARIO ${status}: "${scenario.pickle.name}" ====================`
    );
  }

  // Periodic session recycle every 4 scenarios or on failure to maintain memory hygiene,
  // ensure clean scenario isolation, and prevent OEM background process termination
  if (status !== 'PASSED' || scenarioCount % 4 === 0) {
    logger.info(
      'CucumberHook',
      `Recycling Appium session after scenario #${scenarioCount} (status: ${status}) for memory & state hygiene`
    );
    try {
      await browser.reloadSession();
    } catch (err) {
      logger.warn('CucumberHook', `Session reload encountered error: ${String(err)}`);
    }
  }
});
