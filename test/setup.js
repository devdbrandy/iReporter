import prepare from 'mocha-prepare';
import runAll from 'npm-run-all';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

/**
 * Called before loading of test cases
 * @param {Function} done mocha async done method
 */
const setupDB = (done) => {
  runAll(['migrate', 'seed'])
    .then(() => done())
    .catch(done);
};

/**
 * Called after all test completes (regardless of errors)
 * @param {Function} done mocha async done method
 */
const tearDownDB = (done) => {
  runAll(['migrate'])
    .then(() => done())
    .catch(done);
};

prepare(setupDB, tearDownDB);
