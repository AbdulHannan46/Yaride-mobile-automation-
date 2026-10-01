import fs from 'node:fs';
import path from 'node:path';
import { browser } from '@wdio/globals';
import { logger } from './logger.js';
import { ensureDirectoryExists, formatDateForFilename, sanitizeFileName } from './helpers.js';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'screenshots');

/**
 * Captures and persists a screenshot to the screenshots directory,
 * and attaches it to the current Allure report if Allure is active.
 *
 * @param label A descriptive name (e.g. scenario or step name)
 * @returns The full path to the saved screenshot, or null if capture failed
 */
export async function captureScreenshot(label: string): Promise<string | null> {
  try {
    ensureDirectoryExists(SCREENSHOT_DIR);
    const sanitizedLabel = sanitizeFileName(label);
    const timestamp = formatDateForFilename();
    const fileName = `${sanitizedLabel}_${timestamp}.png`;
    const filePath = path.join(SCREENSHOT_DIR, fileName);

    await browser.saveScreenshot(filePath);
    logger.info('Screenshot', `Saved failure screenshot to: ${filePath}`);

    // Attach to Allure report if reporter is active
    try {
      const allureModule = await import('@wdio/allure-reporter');
      const allure = allureModule.default || allureModule;
      if (allure && typeof allure.addAttachment === 'function') {
        const screenshotBuffer = fs.readFileSync(filePath);
        allure.addAttachment(sanitizedLabel, screenshotBuffer, 'image/png');
        logger.debug('Screenshot', `Attached screenshot "${sanitizedLabel}" to Allure report`);
      }
    } catch {
      // Allure reporter not installed or not currently active; ignore silently
    }

    return filePath;
  } catch (error) {
    logger.error('Screenshot', `Failed to capture screenshot for "${label}"`, error);
    return null;
  }
}
