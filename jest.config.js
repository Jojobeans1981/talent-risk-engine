export default {
  preset: 'default',
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  transformIgnorePatterns: [
    'node_modules/(?!(chai)/)'
  ],
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests'
  ],
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },
  setupFilesAfterEnv: [
    '<rootDir>/tests/setupTests.js'
  ],
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/api/index.js',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1.js',
    '^@normalizers/(.*)$': '<rootDir>/src/normalizers/$1.js',
    '^@data/(.*)$': '<rootDir>/src/data/$1.js'
  },
  fakeTimers: {
    enableGlobally: true
  },
  testTimeout: 15000
};