import request from 'supertest';
import chai from 'chai';
import app from '../src/server';

const should = chai.should();

describe('API Routes', () => {
  describe('GET /api/users', () => {
    it('retrieve a list of users', (done) => {
      request(app)
        .get('/api/users')
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('data')
            .with.lengthOf(2);
          done(err);
        });
    });
  });

  describe('POST /api/users', () => {
    it('creates a new user', (done) => {
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        othernames: 'Posnan',
        email: 'john@email.com',
        phoneNumber: '622-132-9283',
      };

      request(app)
        .post('/api/users')
        .send(userData)
        .set('Accept', 'application/json')
        .expect(201)
        .end((err, res) => {
          res.body.data.should.have.property('id');
          done(err);
        });
    });
  });

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
