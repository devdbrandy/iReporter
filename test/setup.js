import prepare from 'mocha-prepare';
import runAll from 'npm-run-all';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

/**
 * Called before loading of test cases
 * @param {Function} done mocha async done method
 */
const initSetup = (done) => {
  runAll(['db:migrate', 'db:seed'])
    .then(() => done())
    .catch(done);
};

/**
 * Called after all test completes (regardless of errors)
 * @param {Function} done mocha async done method
 */
const tearDown = (done) => {
  runAll(['db:reset'])
    .then(() => done())
    .catch(done);
};

prepare(initSetup, tearDown);
