import { config } from '../../../config/environment.js';

export interface UserProfile {
  username: string;
  email: string;
  getPassword: () => string;
  role: 'standard' | 'admin' | 'guest';
}

/**
 * Test user models. Sensitive credentials are pulled dynamically from
 * environment configuration and never hardcoded in source control.
 */
export const testUsers: Record<string, UserProfile> = {
  standardUser: {
    username: 'yride_qa_user',
    email: config.testUser.email || 'qa_test@yride.internal',
    getPassword: () => {
      const password = config.testUser.password;
      if (!password) {
        throw new Error(
          'YRIDE_TEST_PASSWORD environment variable is not configured. Please supply it in your local .env file.'
        );
      }
      return password;
    },
    role: 'standard',
  },
  invalidUser: {
    username: 'invalid_qa_user',
    email: 'unregistered_qa@yride.internal',
    getPassword: () => 'InvalidPassword123!',
    role: 'standard',
  },
  guestUser: {
    username: 'guest_user',
    email: '',
    getPassword: () => '',
    role: 'guest',
  },
};
