import request from 'supertest';
import chai from 'chai';
import dotenv from 'dotenv';
import app from '../src/server';
import mock from '../src/models/mock';

dotenv.config();
const should = chai.should();

describe('API Routes', () => {
  describe('/api/auth', () => {
    it('Authenticates a user', (done) => {
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
    it('Fetch a list of users', (done) => {
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
    it('Create a new user', (done) => {
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
    it('Fetch all red-flag records', (done) => {
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

  describe('GET /api/red-flags/:id', () => {
    it('Fetch a specific red-flag record.', (done) => {
      request(app)
        .get('/api/red-flags/1')
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('data');
          done(err);
        });
    });
  });

  describe('POST /api/red-flags', () => {
    it('Create a red-flag record', (done) => {
      const recordData = {
        type: 'red-flag',
        location: '-42.2078,138.0694',
        images: [
          'https://via.placeholder.com/650x450',
          'https://via.placeholder.com/650x450',
          'https://via.placeholder.com/650x450',
        ],
        video: [
          'https://res.cloudinary.com/devdb/video/upload/v1543497333/sample/video.flv',
        ],
        comment: 'Est omnis nostrum in. nobis nisi sapiente modi qui corrupti cum fuga. Quis quo corrupti.',
      };

      request(app)
        .post('/api/red-flags')
        .send(recordData)
        .set('Accept', 'application/json')
        .expect(201)
        .end((err, res) => {
          res.body.data.should.have.property('id');
          done(err);
        });
    });
  });
});
