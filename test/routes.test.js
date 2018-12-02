import request from 'supertest';
import chai from 'chai';
import dotenv from 'dotenv';
import app from '../src/server';
import mock from '../src/models/mock';

dotenv.config();
const should = chai.should();

const apiVersion = 'v1';
const apiBase = `/api/${apiVersion}`;

describe('routes: index', () => {
  describe('GET /', () => {
    it('should render the index page', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .end(done);
    });
  });

  describe('/404', () => {
    it('should throw an error', (done) => {
      request(app)
        .get('/404')
        .expect(404)
        .end(done);
    });
  });
});

describe('routes: auth', () => {
  describe(`${apiBase}/auth`, () => {
    it('should authenticate a user and respond with a token', (done) => {
      const user = mock.users[0];

      request(app)
        .post(`${apiBase}/auth`)
        .send({
          username: user.username,
          password: 'secret',
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          res.body.data[0].should.have.property('token');
          done();
        });
    });
  });
});

describe('routes: users', () => {
  describe(`GET ${apiBase}/users`, () => {
    it('should fetch a list of users', (done) => {
      request(app)
        .get(`${apiBase}/users`)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('data')
            .with.lengthOf(2);
          done();
        });
    });
  });

  describe(`POST ${apiBase}/users`, () => {
    it('should create a new user', (done) => {
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
          done();
        });
    });
  });
});

describe('routes: red-flags', () => {
  describe(`GET ${apiBase}/red-flags`, () => {
    it('should fetch all red-flag records', (done) => {
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
    it('should fetch a specific red-flag record.', (done) => {
      request(app)
        .get(`${apiBase}/red-flags/1`)
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('data');
          done();
        });
    });

    it('should throw an error for non-existing resource', (done) => {
      request(app)
        .get(`${apiBase}/red-flags/${null}`)
        .expect(404)
        .end((err, res) => {
          res.body.should.have.property('error');
          done();
        });
    });
  });

  describe(`POST ${apiBase}/red-flags`, () => {
    it('should create a red-flag record', (done) => {
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
          done();
        });
    });
  });

  describe(`PATCH ${apiBase}/red-flags/:id/location`, () => {
    it('should edit the location of a specific red-flag record', (done) => {
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
          done();
        });
    });
  });

  describe(`PATCH ${apiBase}/red-flags/:id`, () => {
    it('should edit the comment of a specific red-flag record', (done) => {
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
          done();
        });
    });
  });

  describe(`DELETE ${apiBase}/red-flags/:id`, () => {
    it('should delete a specific red-flag record', (done) => {
      request(app)
        .delete(`${apiBase}/red-flags/1`)
        .expect(200)
        .end((err, res) => {
          res.body.data[0].should.have.property('id');
          done();
        });
    });
  });
});
