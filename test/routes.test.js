import request from 'supertest';
import chai from 'chai';
import dotenv from 'dotenv';
import app from '../src/server';
import mock from '../src/models/mock';

dotenv.config();
const should = chai.should();

describe('API Routes', () => {
  describe('/api/auth', () => {
    it('authenticates user', (done) => {
      const user = mock.users[0];

      request(app)
        .post('/api/auth')
        .send({
          username: user.username,
          password: user.password,
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          res.body.data.should.have.property('token');
          done(err);
        });
    });
  });

  describe('GET /api/users', () => {
    it('retrieve a list of users', (done) => {
      request(app)
        .get('/api/users')
        .set('Accept', 'application/json')
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
        phoneNumber: '622-132-9283',
        email: 'john@email.com',
        password: 'abc123',
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
