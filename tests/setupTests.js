// tests/setupTests.js
const { configure } = require('@testing-library/react');
import jestMockNow from 'jest-mock-now';;

// Global mocks
jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid-1234'
}));

// Custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      message: () => `expected ${received} to be within range ${floor}-${ceiling}`,
      pass
    };
  }
});

// Test lifecycle hooks
beforeEach(() => {
  jest.clearAllMocks();
  jestMockNow(new Date('2025-07-20')); // Freeze time
});

afterAll(() => {
  jest.useRealTimers();
});

// Configure RTL if using React components
configure({
  testIdAttribute: 'data-test-id'
});