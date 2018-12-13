import request from 'supertest';
import chai from 'chai';
import dotenv from 'dotenv';
import childProcesses from 'child_process';
import app from '../src/server';
import { User } from '../src/models';
import { config } from '../src/utils/helpers';

dotenv.config();
const should = chai.should();
const { exec } = childProcesses;

const apiVersion = config('app:version');
const prefix = `/api/${apiVersion}`;
const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiTWlrZSIsImxhc3RuYW1lIjoiUGhpbGlwIiwib3RoZXJuYW1lcyI6IkV5aW4iLCJwaG9uZU51bWJlciI6IjYyMi0xMzItOTI4MyIsImVtYWlsIjoibHVpekBlbWFpbC5jb20iLCJ1c2VybmFtZSI6ImRicmFuZHkiLCJyZWdpc3RlcmVkIjoiMjAxOC0xMi0xM1QxOToyMToyNi4wMzNaIiwiaXNBZG1pbiI6ZmFsc2V9.XxUv7TWw03xeR-H7LNdR5ODh_bedwq5iSUD5DT_RZ-U';

const token2 = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwiZmlyc3RuYW1lIjoiSm9obiIsImxhc3RuYW1lIjoiUGhpbGlwIiwib3RoZXJuYW1lcyI6IlBvc25hbiIsInBob25lTnVtYmVyIjoiNjIyLTEzMi05MjIzIiwiZW1haWwiOiJ0aWdlckBlbWFpbC5jb20iLCJ1c2VybmFtZSI6InVwdG9uZSIsInJlZ2lzdGVyZWQiOiIyMDE4LTEyLTEzVDIxOjUxOjMyLjU3OVoiLCJpc0FkbWluIjpmYWxzZX0.xxUD-wrdJNN-e5BN5SCJYeXkZ6urmJrXHH0bkuO8ubc';

before(() => {
  // reset database tables
  exec('npm run migrate');
  // insert dummy data
  exec('npm run seed');
});

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
  describe('/auth/login', () => {
    it('should authenticate a user and respond with a token', (done) => {
      User.find(1)
        .then((user) => {
          const { username } = user;

          request(app)
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send({
              username: 'uptone',
              password: 'secret',
            })
            .end((err, res) => {
              const { data } = res.body;
              res.statusCode.should.equal(200);
              data[0].should.have.property('token');
              done();
            });
        })
        .catch(done);
    });

    it('should throw an error on invalid credentials', (done) => {
      User.find(1)
        .then((user) => {
          const { username } = user;

          request(app)
            .post('/auth/login')
            .send({
              username,
              password: 'bacons',
            })
            .set('Accept', 'application/json')
            .expect(401, {
              status: 401,
              error: 'Wrong username or password',
            }, done);
        });
    });
  });
});

describe('routes: users', () => {
  describe(`GET ${prefix}/users`, () => {
    it('should fetch list of users', (done) => {
      request(app)
        .get(`${prefix}/users`)
        .set('Accept', 'application/json')
        .set('Authorization', token)
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
      request(app)
        .get(`${prefix}/users/1`)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect(200, done);
    });

    it('should throw an error for non-existing resource', (done) => {
      const id = 1000;

      request(app)
        .get(`${prefix}/users/${id}`)
        .set('Authorization', token)
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

  describe('POST /auth/signup', () => {
    it('should create a new user', (done) => {
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        othernames: 'Posnan',
        phoneNumber: '6221329283',
        username: 'johnny',
        email: 'john@email.com',
        password: 'secret',
      };

      request(app)
        .post('/auth/signup')
        .send(userData)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          res.body.data[0].should.have.property('token');
          res.body.data[0].should.have.property('user');
          done();
        });
    });
  });
});

describe('routes: red-flags', () => {
  describe(`GET ${prefix}/red-flags`, () => {
    it('should fetch all red-flag records', (done) => {
      request(app)
        .get(`${prefix}/red-flags`)
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('data')
            .with.lengthOf(1);
          done();
        });
    });
  });

  describe(`GET ${prefix}/red-flags/:id`, () => {
    it('should fetch a specific red-flag record.', (done) => {
      request(app)
        .get(`${prefix}/red-flags/1`)
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .end((err, res) => {
          const [data] = res.body.data;
          data.should.have.property('id');
          done();
        });
    });

    it('should throw an error for non-existing resource', (done) => {
      request(app)
        .get(`${prefix}/red-flags/1000`)
        .set('Accept', 'application/json')
        .set('Authorization', token)
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
        .set('Authorization', token)
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
        .set('Authorization', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(201)
        .end((err, res) => {
          const [data] = res.body.data;
          data.should.have.property('id');
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
        .set('Authorization', token)
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

      request(app)
        .post(`${prefix}/red-flags`)
        .send(recordData)
        .set('Authorization', 'Bearer pefkewmffwefewfef')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(403, done);
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
        .set('Authorization', token)
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
        .set('Authorization', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(422, done);
    });

    it('should throw an error for non-existing resource', (done) => {
      request(app)
        .patch(`${prefix}/red-flags/1000/location`)
        .send(data)
        .set('Authorization', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(404, {
          status: 404,
          error: 'Resource not found',
        }, done);
    });

    it('should throw an error for unauthorized user', (done) => {
      request(app)
        .patch(`${prefix}/red-flags/1/location`)
        .send(data)
        .set('Authorization', 'Bearer ')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(400, done);
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
        .set('Authorization', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(202, {
          status: 202,
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
        .set('Authorization', token)
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
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect(404, {
          status: 404,
          error: 'Resource not found',
        }, done);
    });

    it('should throw an error for unauthorized user', (done) => {
      request(app)
        .delete(`${prefix}/red-flags/1`)
        .set('Authorization', `Bearer ${token2}`)
        .set('Accept', 'application/json')
        .expect(403, {
          status: 403,
          error: 'Failed authentication',
        }, done);
    });
  });
});
