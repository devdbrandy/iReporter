import chai from 'chai';
import lint from 'mocha-eslint';
import appConfig from '../../src/config/app';
import { config } from '../../src/utils/helpers';

const should = chai.should();

describe('Utilities and Helpers Function', () => {
  context("config('name:value')", () => {
    it('returns the value of the configuration variable', (done) => {
      config('app:name').should.equal(appConfig.name);
      done();
    });

    it('returns a default value if config var is invalid', (done) => {
      config('app:debug', true).should.equal(true);
      done();
    });
  });
});

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
