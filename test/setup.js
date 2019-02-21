import prepare from 'mocha-prepare';
import runAll from 'npm-run-all';
import dotenv from 'dotenv';
import { Done } from 'mocha';

dotenv.config({ path: '.env.test' });

/**
 * Called before loading of test cases
 *
 * @param {Done} done - mocha async done method
 */
const initSetup = (done) => {
  runAll(['migrate', 'db:seed'])
    .then(() => done())
    .catch(done);
};

/**
 * Called after all test completes (regardless of errors)
 *
 * @param {Done} done - mocha async done method
 */
const tearDown = (done) => {
  runAll(['migrate:reset'])
    .then(() => done())
    .catch(done);
};

prepare(initSetup, tearDown);
