import sinon from 'sinon';
import chai from 'chai';
import { authenticate } from '../src/middleware';

const should = chai.should();

describe('middlewares', () => {
  context('authenticate()', () => {
    it('should throw error on missing Authorization Header', (done) => {
      const callback = sinon.spy();
      const request = {
        headers: {
          authorization: '',
        },
      };
      const response = {};
      authenticate(request, response, callback);
      callback.calledOnce.should.equal(true);
      done();
    });

    specify('error on invalid token format', (done) => {
      const callback = sinon.spy();
      const request = {
        headers: {
          authorization: 'Bearer',
        },
      };
      const response = {};
      authenticate(request, response, callback);
      callback.calledOnce.should.equal(true);
      done();
    });
  });
});
