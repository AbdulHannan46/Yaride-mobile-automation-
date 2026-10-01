import { globSync } from 'glob';
import path from 'node:path';
import { config as envConfig } from '../src/config/environment.js';
import { getAndroidCapabilities } from '../src/config/capabilities.js';
import { logger } from '../src/utils/logger.js';

const stepDefinitions = globSync('./src/test/step-definitions/**/*.ts').map((f) => f.replace(/\\/g, '/'));
const cucumberHooks = globSync('./src/test/hooks/**/*.ts').map((f) => f.replace(/\\/g, '/'));
const supportFiles = globSync('./src/test/support/**/*.ts').map((f) => f.replace(/\\/g, '/'));
const featureFiles = path.join(process.cwd(), 'src/test/resources/features/**/*.feature').replace(/\\/g, '/');

export const config: WebdriverIO.Config = {
  // Runner configuration
  runner: 'local',

  // Appium Server Connection
  hostname: envConfig.appium.host,
  port: envConfig.appium.port,
  path: envConfig.appium.path,

  // Test Specifications
  specs: [featureFiles],
  exclude: [],

  // Execution Capabilities
  maxInstances: 1,
  capabilities: getAndroidCapabilities(),

  // Test Runner Settings
  logLevel: envConfig.logging.level,
  bail: 0,
  waitforTimeout: envConfig.timeouts.explicitWait,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 1,

  // Framework setup
  framework: 'cucumber',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
        useCucumberStepReporter: true,
      },
    ],
  ],

  cucumberOpts: {
    require: [...supportFiles, ...stepDefinitions, ...cucumberHooks],
    backtrace: true,
    requireModule: [],
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: true,
    tags: 'not @defect',
    timeout: envConfig.timeouts.cucumberStep,
    ignoreUndefinedDefinitions: false,
  },

  // Lifecycle Hooks
  beforeSession: async function () {
    logger.info('WDIO', `Initializing Appium session against device: ${envConfig.android.udid}`);
    logger.info(
      'WDIO',
      `Target app: ${envConfig.android.appPackage} / ${envConfig.android.appActivity} (noReset: ${envConfig.android.noReset})`
    );
  },

  before: async function () {
    logger.info('WDIO', 'Test execution starting on Appium session');
  },

  afterScenario: async function (world, result) {
    const scenarioName = world.pickle.name || 'unnamed-scenario';
    if (!result.passed) {
      logger.error('WDIO', `Scenario failed: "${scenarioName}". Failure screenshot captured in AfterStep hook.`);
    } else {
      logger.info('WDIO', `Scenario passed: "${scenarioName}"`);
    }
  },

  after: async function (result) {
    logger.info('WDIO', `Test execution completed with exit code: ${result}`);
  },

  afterSession: async function () {
    logger.info('WDIO', 'Appium session terminated cleanly');
  },
};
