import request from 'supertest';
import chai from 'chai';
import dotenv from 'dotenv';
import app from '../src/server';
import { User, Record } from '../src/models';
import mock from './setup/mock';
import { config } from '../src/utils/helpers';

dotenv.config();
const should = chai.should();

const apiVersion = config('app:version');
const prefix = `/api/${apiVersion}`;

describe('routes: index', () => {
  describe('GET /', () => {
    it('should render the index page', (done) => {
      request(app)
        .get('/')
        .expect(200, done);
    });
  });

  describe('/404', () => {
    it('should throw an error', (done) => {
      request(app)
        .get('/404')
        .expect(404, {
          status: 404,
          error: 'Provided route is invalid',
        }, done);
    });
  });
});

describe('routes: auth', () => {
  beforeEach((done) => {
    User.resetTable();
    mock.users.forEach(data => User.create(data));
    done();
  });

  describe(`${prefix}/auth`, () => {
    it('should authenticate a user and respond with a token', (done) => {
      const user = User.table[0];

      request(app)
        .post(`${prefix}/auth`)
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

    it('should throw an error on invalid credentials', (done) => {
      const user = User.table[0];

      request(app)
        .post(`${prefix}/auth`)
        .send({
          username: user.username,
          password: 'bacons',
        })
        .set('Accept', 'application/json')
        .expect(401, {
          status: 401,
          error: 'Unauthorized',
        }, done);
    });
  });
});

describe('routes: users', () => {
  beforeEach((done) => {
    User.resetTable();
    mock.users.forEach(data => User.create(data));
    done();
  });

  describe(`GET ${prefix}/users`, () => {
    it('should fetch a list of users', (done) => {
      request(app)
        .get(`${prefix}/users`)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('data')
            .with.lengthOf(2);
          done();
        });
    });
  });
  describe(`GET ${prefix}/users/{id}`, () => {
    it('should fetch a specific user', (done) => {
      const user = User.table[1];
      const { id } = user;

      request(app)
        .get(`${prefix}/users/${id}`)
        .set('Accept', 'application/json')
        .expect(200, {
          status: 200,
          data: [{
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            othernames: user.othernames,
            email: user.email,
            phoneNumber: user.phoneNumber,
            registered: user.registered,
            isAdmin: user.isAdmin,
            username: user.username,
          }],
        }, done);
    });

    it('should throw an error for non-existing resource', (done) => {
      const id = 1000;

      request(app)
        .get(`${prefix}/users/${id}`)
        .set('Accept', 'application/json')
        .expect(404, {
          status: 404,
          error: 'Resource not found',
        }, done);
    });

    it('should throw an error on validation failure', (done) => {
      const id = null;

      request(app)
        .get(`${prefix}/users/null`)
        .set('Accept', 'application/json')
        .expect(422, done);
    });
  });

  describe(`POST ${prefix}/users`, () => {
    it('should create a new user', (done) => {
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        othernames: 'Posnan',
        phoneNumber: '622-132-9283',
        email: 'john@email.com',
        password: 'secret',
      };

      request(app)
        .post(`${prefix}/users`)
        .send(userData)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          res.body.data[0].should.have.property('id');
          done();
        });
    });
  });
});

describe('routes: red-flags', () => {
  let token;
  beforeEach((done) => {
    // Refresh tables and seed data
    User.resetTable();
    Record.resetTable();
    mock.users.forEach(data => User.create(data));
    mock.records.forEach(data => Record.create(data));

    const user = User.table[0];

    request(app)
      .post(`${prefix}/auth`)
      .send({
        username: user.username,
        password: 'secret',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end((err, res) => {
        const response = res.body.data[0].token;
        token = response;
        done();
      });
  });

  describe(`GET ${prefix}/red-flags`, () => {
    it('should fetch all red-flag records', (done) => {
      request(app)
        .get(`${prefix}/red-flags`)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('data')
            .with.lengthOf(2);
          done();
        });
    });
  });

  describe(`GET ${prefix}/red-flags/:id`, () => {
    it('should fetch a specific red-flag record.', (done) => {
      const redFlag = Record.table[0];

      request(app)
        .get(`${prefix}/red-flags/${redFlag.id}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.body.should.have.property('data');
          done();
        });
    });

    it('should throw an error for non-existing resource', (done) => {
      request(app)
        .get(`${prefix}/red-flags/1000`)
        .set('Accept', 'application/json')
        .expect(404, {
          status: 404,
          error: 'Resource not found',
        }, done);
    });

    it('should throw an error on validation failure', (done) => {
      const id = null;

      request(app)
        .get(`${prefix}/red-flags/${id}`)
        .set('Accept', 'application/json')
        .expect(422, done);
    });
  });

  describe(`POST ${prefix}/red-flags`, () => {
    it('should create a new red-flag record', (done) => {
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
        .post(`${prefix}/red-flags`)
        .send(recordData)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(201)
        .end((err, res) => {
          res.body.data[0].should.have.property('id');
          done();
        });
    });

    it('should throw an error on validation failure', (done) => {
      const recordData = {
        type: 'red-flag',
        location: 'invalid data',
        comment: 'Est omnis nostrum in. nobis nisi sapiente modi qui corrupti cum fuga. Quis quo corrupti.',
      };

      request(app)
        .post(`${prefix}/red-flags`)
        .send(recordData)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(422)
        .end(done);
    });

    it('should throw an error for unauthenticated user', (done) => {
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

      token = 'jefowjfojwjfjewoji0j';

      request(app)
        .post(`${prefix}/red-flags`)
        .send(recordData)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(401, {
          status: 401,
          error: 'Unauthenticated',
        }, done);
    });
  });

  describe(`PATCH ${prefix}/red-flags/:id/location`, () => {
    const data = {
      location: '-81.2078,138.0233',
    };

    it('should edit the location of a specific red-flag record', (done) => {
      request(app)
        .patch(`${prefix}/red-flags/1/location`)
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(201)
        .end((err, res) => {
          res.body.data[0].should.have.property('id');
          done();
        });
    });

    it('should throw an error on validation failure', (done) => {
      request(app)
        .patch(`${prefix}/red-flags/1/location`)
        .send({})
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(422, done);
    });

    it('should throw an error for non-existing resource', (done) => {
      request(app)
        .patch(`${prefix}/red-flags/10/location`)
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(404, {
          status: 404,
          error: 'Resource not found',
        }, done);
    });

    it('should throw an error for unauthorized user', (done) => {
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJmaXJzdG5hbWUiOiJNaWtlIiwibGFzdG5hbWUiOiJTcGluZSIsIm90aGVybmFtZXMiOiJUb20iLCJlbWFpbCI6Im1pa2VAZW1haWwuY29tIiwicGhvbmVOdW1iZXIiOiI2MjItMTMyLTkyODMiLCJyZWdpc3RlcmVkIjoiU3VuIERlYyAwOSAyMDE4IDE5OjUxOjQ3IEdNVCswMTAwIChXZXN0IEFmcmljYSBTdGFuZGFyZCBUaW1lKSIsImlzQWRtaW4iOmZhbHNlLCJ1c2VybmFtZSI6IlNwaW5lTWlrMSJ9LCJpYXQiOjE1NDQzODE1MzB9.w34D916p7N12lUjsTTICx0g4GDOLNRMnSCq-u07Jarw';

      request(app)
        .patch(`${prefix}/red-flags/1/location`)
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(403, {
          status: 403,
          error: 'Unauthorized',
        }, done);
    });

    it('should throw an error for unauthenticated user', (done) => {
      token = 'wefwefwwfewfewf';

      request(app)
        .patch(`${prefix}/red-flags/1/location`)
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(401, {
          status: 401,
          error: 'Unauthenticated',
        }, done);
    });
  });

  describe(`PATCH ${prefix}/red-flags/:id/comment`, () => {
    it('should edit the comment of a specific red-flag record', (done) => {
      const data = {
        comment: 'This is an updated comment',
      };

      request(app)
        .patch(`${prefix}/red-flags/1/comment`)
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(201, {
          status: 201,
          data: [
            {
              id: 1,
              message: "Updated red-flag record's comment",
            },
          ],
        }, done);
    });
  });

  describe(`DELETE ${prefix}/red-flags/:id`, () => {
    it('should delete a specific red-flag record', (done) => {
      request(app)
        .delete(`${prefix}/red-flags/1`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          res.body.data[0].should.have.property('id');
          done();
        });
    });

    it('should throw an error for non-existing resource', (done) => {
      request(app)
        .delete(`${prefix}/red-flags/10`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect(404, {
          status: 404,
          error: 'Resource not found',
        }, done);
    });

    it('should throw an error for unauthorized user', (done) => {
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJmaXJzdG5hbWUiOiJNaWtlIiwibGFzdG5hbWUiOiJTcGluZSIsIm90aGVybmFtZXMiOiJUb20iLCJlbWFpbCI6Im1pa2VAZW1haWwuY29tIiwicGhvbmVOdW1iZXIiOiI2MjItMTMyLTkyODMiLCJyZWdpc3RlcmVkIjoiU3VuIERlYyAwOSAyMDE4IDE5OjUxOjQ3IEdNVCswMTAwIChXZXN0IEFmcmljYSBTdGFuZGFyZCBUaW1lKSIsImlzQWRtaW4iOmZhbHNlLCJ1c2VybmFtZSI6IlNwaW5lTWlrMSJ9LCJpYXQiOjE1NDQzODE1MzB9.w34D916p7N12lUjsTTICx0g4GDOLNRMnSCq-u07Jarw';

      request(app)
        .delete(`${prefix}/red-flags/1`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect(403, {
          status: 403,
          error: 'Unauthorized',
        }, done);
    });
  });
});
