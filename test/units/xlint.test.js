import lint from 'mocha-eslint';

// Array of paths to lint
const paths = ['src'];

const options = {
  // Specify style of output
  formatter: 'compact',
  // Only display warnings if a test is failing
  alwaysWarn: false,
  // Increase the timeout of the test if linting takes to long
  timeout: 5000,
  // Increase the time until a test is marked as slow
  slow: 1000,
  // Consider linting warnings as errors and return failure
  strict: true,
  // Specify the mocha context in which to run tests
  contextName: 'eslint',
};

// Run the tests
lint(paths, options);
