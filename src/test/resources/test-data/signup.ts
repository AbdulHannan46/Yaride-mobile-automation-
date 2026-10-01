/**
 * SignupTestData
 *
 * Centralised test-data factory for the YRide Signup automation suite.
 *
 * Design principles:
 * - No personal/real email addresses or phone numbers.
 * - Unique values per run are achieved through timestamp suffixes.
 * - Duplicate scenarios require paired accounts; isolation is achieved by
 *   varying only the field under test between Account A and Account B.
 * - Sensitive values (passwords) are never logged.
 *
 * Observed application rules (derived from device testing, NOT invented):
 * - Password minimum length: 6 characters
 * - Phone format accepted: +1 876 XXXXXXX (7 subscriber digits)
 * - Phone format rejected: +1 876 XXXXXX  (6 subscriber digits)
 * - Special characters entered in phone field are accepted by the UI
 *   but rejected on submission ("invalid mobile number")
 * - Currency options: USD (default), JMD
 * - Referral code: optional
 */

import { config } from '../../../config/environment.js';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface SignupPayload {
  fullName: string;
  email: string;
  phone: string;
  currency: 'USD' | 'JMD';
  password: string;
  referralCode?: string;
}

// ---------------------------------------------------------------------------
// Generators — unique-per-run values
// ---------------------------------------------------------------------------

/**
 * Returns a short numeric suffix based on the current timestamp.
 * Produces 6-character suffix adequate for email/phone uniqueness within
 * a test run without exceeding practical field length limits.
 */
function runSuffix(): string {
  return Date.now().toString().slice(-6);
}

/**
 * Generates a unique valid test email for a given purpose label.
 * Uses the yride.qa domain which does not correspond to any real MX record.
 */
function uniqueEmail(label: string): string {
  return `qa.${label}.${runSuffix()}@yride.qa`;
}

/**
 * Generates a unique 7-digit subscriber number.
 * Observed rule: +1 876 + 7 digits is accepted by the YRide signup API.
 * The leading digit is kept non-zero to avoid a leading-zero edge case.
 */
function uniquePhone(): string {
  const suffix = runSuffix();
  // Pad to 7 digits; prefix with '2' to ensure non-zero leading digit
  return `2${suffix.padStart(6, '0')}`;
}

// ---------------------------------------------------------------------------
// Valid signup data
// ---------------------------------------------------------------------------

/**
 * Generates a complete, valid signup payload unique to the current test run.
 */
export function generateValidSignupData(label = 'user'): SignupPayload {
  return {
    fullName: `QA Test User ${runSuffix()}`,
    email: uniqueEmail(label),
    phone: uniquePhone(),
    currency: 'USD',
    password: 'Test@123', // 8 chars — safely above the observed 6-char minimum
  };
}

// ---------------------------------------------------------------------------
// Duplicate-isolation test data
// ---------------------------------------------------------------------------

/**
 * Generates two paired account payloads for the "existing email" scenario.
 *
 * Account A (primary): registered first with a unique email and unique phone.
 * Account B (conflict): uses the same EMAIL as A but a different phone.
 *
 * This isolates email duplication; the phone field does not trigger the
 * "already exists" condition in the second submission.
 */
export function generateExistingEmailScenarioData(): {
  accountA: SignupPayload;
  accountB: SignupPayload;
} {
  const sharedEmail = uniqueEmail('dup-email');
  const accountA: SignupPayload = {
    fullName: `QA Dup Email A ${runSuffix()}`,
    email: sharedEmail,
    phone: uniquePhone(),
    currency: 'USD',
    password: 'Test@123',
  };
  const accountB: SignupPayload = {
    fullName: `QA Dup Email B ${runSuffix()}`,
    email: sharedEmail,               // Same email — triggers duplicate email error
    phone: uniquePhone(),             // Different phone — not the conflicting field
    currency: 'USD',
    password: 'Test@123',
  };
  return { accountA, accountB };
}

/**
 * Generates two paired account payloads for the "existing phone" scenario.
 *
 * Account A (primary): registered first with a unique email and unique phone.
 * Account B (conflict): uses a different email but the same PHONE as A.
 *
 * This isolates phone duplication; the email field does not trigger the
 * "already exists" condition in the second submission.
 */
export function generateExistingPhoneScenarioData(): {
  accountA: SignupPayload;
  accountB: SignupPayload;
} {
  const sharedPhone = uniquePhone();
  const accountA: SignupPayload = {
    fullName: `QA Dup Phone A ${runSuffix()}`,
    email: uniqueEmail('dup-phone-a'),
    phone: sharedPhone,
    currency: 'USD',
    password: 'Test@123',
  };
  const accountB: SignupPayload = {
    fullName: `QA Dup Phone B ${runSuffix()}`,
    email: uniqueEmail('dup-phone-b'), // Different email — not the conflicting field
    phone: sharedPhone,                // Same phone — triggers "already exists" error
    currency: 'USD',
    password: 'Test@123',
  };
  return { accountA, accountB };
}

// ---------------------------------------------------------------------------
// Invalid data fixtures
// ---------------------------------------------------------------------------

export const invalidSignupData = {
  /**
   * Email that does not conform to RFC 5322 format.
   * Verified to be rejected by the application's client-side validation.
   */
  email: {
    missingAtSign: 'notanemail.yride.qa',
    missingDomain: 'qa@',
    missingLocal: '@yride.qa',
  },

  /**
   * Phone numbers expected to be rejected by the application.
   *
   * Observed: 6 subscriber digits → "invalid phone number"
   * Observed: special chars → field accepts but submission rejects
   * NOTE: 1234567 is NOT used here — it has returned "already exists"
   *       on the known device, meaning it maps to a real account.
   */
  phone: {
    tooShort: '234567',       // 6 digits — one below the observed 7-digit minimum
    withSpecialChars: '123#456', // special char — submission-level rejection
    leadingZero: '0123456',   // leading zero — boundary case from Lead scenarios
    tooLong: '12345678',      // 8 digits — above the observed 7-digit acceptance
  },

  /**
   * Passwords that violate the observed minimum-length rule (6 chars).
   */
  password: {
    tooShort: '12345', // 5 chars — one below observed minimum
  },
} as const;

// ---------------------------------------------------------------------------
// Known duplicate data (DO NOT use for creating new accounts)
// ---------------------------------------------------------------------------

/**
 * A phone number confirmed by prior testing to exist in the YRide database.
 * This is used ONLY to verify the "already exists" error message without
 * needing to create a new duplicate account within the same run.
 *
 * WARNING: This number may change if the account is deleted. If this scenario
 * fails with an unexpected error, generate a fresh duplicate instead.
 */
export const knownExistingPhone = '1234567';

// ---------------------------------------------------------------------------
// Login test accounts (existing registered users)
// ---------------------------------------------------------------------------

export const loginTestUser = {
  email: config.testUser.email ?? 'qa_test@yride.internal',
  getPassword: (): string => {
    const password = config.testUser.password;
    if (!password) {
      throw new Error(
        'YRIDE_TEST_PASSWORD environment variable is not configured. ' +
        'Please supply it in your local .env file.'
      );
    }
    return password;
  },
};
