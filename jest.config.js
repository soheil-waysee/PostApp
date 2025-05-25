const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/cdk.out/',
    '<rootDir>/.cdk.staging/',
    '<rootDir>/coverage/',
    '<rootDir>/.aws/',
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/cdk.out/',
    '<rootDir>/.cdk.staging/',
    '<rootDir>/coverage/',
    '<rootDir>/.aws/',
  ],
};
