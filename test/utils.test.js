import chai from 'chai';
import appConfig from '../src/config/app';
import { config } from '../src/utils/helpers';

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
