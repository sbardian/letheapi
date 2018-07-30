module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['dist', 'node_modules'],
  testPathIgnorePatterns: ['dist'],
  setupTestFrameworkScriptFile: '<rootDir>/src/setupTests.js',
};
