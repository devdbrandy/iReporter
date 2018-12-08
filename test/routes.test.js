import request from 'supertest';
import chai from 'chai';
import dotenv from 'dotenv';
import app from '../src/server';
import mock from '../src/models/mock';

dotenv.config();
const should = chai.should();

const apiVersion = 'v1';
const prefix = `/api/${apiVersion}`;

let db = JSON.parse(JSON.stringify(mock));

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
  const user = db.users[0];

  describe(`${prefix}/auth`, () => {
    it('should authenticate a user and respond with a token', (done) => {
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
      const user = db.users[0];
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
        .get(`${prefix}/users/${id}`)
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
        password: 'abc123',
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
    db = JSON.parse(JSON.stringify(mock));
    const user = db.users[0];

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
          done(err);
        });
    });
  });

  describe(`GET ${prefix}/red-flags/:id`, () => {
    it('should fetch a specific red-flag record.', (done) => {
      const redFlag = db.records[0];

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
  });

  describe(`PATCH ${prefix}/red-flags/:id/location`, () => {
    it('should edit the location of a specific red-flag record', (done) => {
      const data = {
        location: '-81.2078,138.0233',
      };

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
  });

  describe(`PATCH ${prefix}/red-flags/:id`, () => {
    it('should edit the comment of a specific red-flag record', (done) => {
      const data = {
        comment: 'This is an updated comment',
      };

      request(app)
        .patch(`${prefix}/red-flags/1`)
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
  });
});
