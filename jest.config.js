const jestJunitConfig = {
  outputDirectory: '<rootDir>/coverage',
  outputName: 'unit-results.xml'
};

// eslint-disable-next-line
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/src/tsconfig.spec.json'
    }
  },

  name: 'cypress-contract-stubs',
  roots: ['<rootDir>/src/'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],

  testMatch: ['**/*+(spec|test).+(ts|js)?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  collectCoverage: true,
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**'],
  coverageReporters: ['lcovonly', 'html', 'text-summary'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', 'index.ts', 'types.d.ts'],
  coverageDirectory: '<rootDir>/coverage',

  reporters: ['default', ['jest-junit', jestJunitConfig]],
  cacheDirectory: '<rootDir>/node_modules/.cache/jest'
};
