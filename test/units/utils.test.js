import chai from 'chai';
import sinon from 'sinon';
import appConfig from '../../src/config/app';
import { config } from '../../src/utils/helpers';
import { storageConfig } from '../../src/config/storage';

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

  context('storageConfig', () => {
    const { fileFilter } = storageConfig;
    const request = {};

    it('efficiently filters media types', (done) => {
      const callback = sinon.spy();
      const file = { originalname: '.jpg' };
      fileFilter(request, file, callback);
      callback.calledOnce.should.equal(true);
      done();
    });
    it('throws error for unsupported media types', (done) => {
      const callback = sinon.spy();
      const file = { originalname: '.dat' };
      fileFilter(request, file, callback);
      callback.calledOnce.should.equal(true);
      done();
    });
  });
});
