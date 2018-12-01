import request from 'supertest';
import chai from 'chai';
import dotenv from 'dotenv';
import app from '../src/server';
import mock from '../src/models/mock';

dotenv.config();
const should = chai.should();

const apiVersion = 'v1';
const apiBase = `/api/${apiVersion}`;

describe('API Routes', () => {
  describe(`${apiBase}/auth`, () => {
    it('Authenticates a user', (done) => {
      const user = mock.users[0];

      request(app)
        .post(`${apiBase}/auth`)
        .send({
          username: user.username,
          password: user.password,
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          res.body.data[0].should.have.property('token');
          done(err);
        });
    });
  });

  describe(`GET ${apiBase}/users`, () => {
    it('Fetch a list of users', (done) => {
      request(app)
        .get(`${apiBase}/users`)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('data')
            .with.lengthOf(2);
          done(err);
        });
    });
  });

  describe(`POST ${apiBase}/users`, () => {
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
        .post(`${apiBase}/users`)
        .send(userData)
        .set('Accept', 'application/json')
        .expect(201)
        .end((err, res) => {
          res.body.data[0].should.have.property('id');
          done(err);
        });
    });
  });

  describe(`GET ${apiBase}/red-flags`, () => {
    it('Fetch all red-flag records', (done) => {
      request(app)
        .get(`${apiBase}/red-flags`)
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('data')
            .with.lengthOf(2);
          done(err);
        });
    });
  });

  describe(`GET ${apiBase}/red-flags/:id`, () => {
    it('Fetch a specific red-flag record.', (done) => {
      request(app)
        .get(`${apiBase}/red-flags/1`)
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('data');
          done(err);
        });
    });
  });

  describe(`POST ${apiBase}/red-flags`, () => {
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
        .post(`${apiBase}/red-flags`)
        .send(recordData)
        .set('Accept', 'application/json')
        .expect(201)
        .end((err, res) => {
          res.body.data[0].should.have.property('id');
          done(err);
        });
    });
  });

  describe(`PATCH ${apiBase}/red-flags/:id/location`, () => {
    it('Edit the location of a specific red-flag record', (done) => {
      const data = {
        location: '-81.2078,138.0233',
      };

      request(app)
        .patch(`${apiBase}/red-flags/1/location`)
        .send(data)
        .set('Accept', 'application/json')
        .expect(201)
        .end((err, res) => {
          res.body.data[0].should.have.property('id');
          done(err);
        });
    });
  });

  describe(`PATCH ${apiBase}/red-flags/:id`, () => {
    it('Edit the comment of a specific red-flag record', (done) => {
      const data = {
        comment: 'This is an updated comment',
      };

      request(app)
        .patch(`${apiBase}/red-flags/1`)
        .send(data)
        .set('Accept', 'application/json')
        .expect(201)
        .end((err, res) => {
          res.body.data[0].should.have.property('id');
          done(err);
        });
    });
  });

  describe(`DELETE ${apiBase}/red-flags/:id`, () => {
    it('Delete a specific red-flag record', (done) => {
      request(app)
        .delete(`${apiBase}/red-flags/1`)
        .expect(200)
        .end((err, res) => {
          res.body.data[0].should.have.property('id');
          done(err);
        });
    });
  });
});
