import request from 'supertest';
import chai from 'chai';
import app from '../src/server';

const should = chai.should();

describe('API Routes', () => {
  describe('GET /api/red-flags', () => {
    it('returns a list of red-flags', (done) => {
      request(app)
        .get('/api/red-flags')
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('data')
            .with.lengthOf(2);
          done(err);
        });
    });
  });
});
