import request from 'supertest';
import chai from 'chai';
import app from '../src/server';

const should = chai.should();

describe('Mocha Test', () => {
  it('/api', (done) => {
    request(app)
      .get('/api')
      .expect(200)
      .end((err, res) => {
        res.body.status.should.equal('OK');
        done(err);
      });
  });
});
