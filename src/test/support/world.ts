import { setWorldConstructor, World } from '@wdio/cucumber-framework';
import type { SignupPayload } from '../resources/test-data/signup.js';

/**
 * ScenarioState
 *
 * Typed, scenario-scoped state bag. Eliminates global mutable variables.
 * Each scenario receives a fresh instance — state does not leak between scenarios.
 *
 * Add new keys here as new test scenarios require them.
 */
export interface ScenarioState {
  // Login scenarios
  initialPasswordMaskedState?: boolean;

  // Signup scenarios — generated per-run to ensure uniqueness
  signupData?: SignupPayload;
  duplicateAccountA?: SignupPayload;
  duplicateAccountB?: SignupPayload;

  // General purpose — error/validation message captured during a step
  lastValidationMessage?: string | null;

  // Index signature — allows arbitrary additional state
  [key: string]: unknown;
}

/**
 * CustomWorld
 *
 * Provides strongly-typed scenario-scoped state management.
 * WebdriverIO's Cucumber integration makes this available as `this`
 * inside step definitions that use `function` (not arrow function) syntax.
 */
export class CustomWorld extends World {
  public scenarioState: ScenarioState = {};
}

setWorldConstructor(CustomWorld);
