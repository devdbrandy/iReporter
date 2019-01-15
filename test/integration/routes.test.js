import request from 'supertest';
import chai from 'chai';
import app from '../../src/server';
import { User, Record } from '../../src/models';
import { config } from '../../src/utils/helpers';

const should = chai.should();

const version = config('app:version');
const baseURI = `/api/${version}`;

/**
 * Authenticate user
 *
 * @param {User} user User object
 * @returns {string} user access token
 */
async function auth(user) {
  const { username } = user;

  const { body: { data: [payload] } } = await request(app)
    .post('/auth/login')
    .set('Accept', 'application/json')
    .send({
      username,
      password: 'secret',
    })
    .expect(200);

  return payload.token;
}

describe('GET /', () => {
  it('should render the index page', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('/404', () => {
  it('should throw an error for invalid route', (done) => {
    request(app)
      .get('/404')
      .expect(404, {
        status: 404,
        error: 'Provided route is invalid',
      }, done);
  });
});

describe('routes: /auth', () => {
  context('POST /auth/signup', () => {
    const userData = {
      firstname: 'John',
      lastname: 'Doe',
      othernames: 'Posnan',
      phoneNumber: '6221329283',
      email: 'johnd@email.com',
      username: 'johnd',
      password: 'secret',
      passwordConfirmation: 'secret',
    };

    it('should create a new user account', (done) => {
      request(app)
        .post('/auth/signup')
        .send(userData)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(201)
        .then((res) => {
          const { body: { data } } = res;
          data[0].should.have.property('user');
          data[0].should.have.property('token');
          done();
        })
        .catch(done);
    });

    specify('error for already existing user with email', (done) => {
      request(app)
        .post('/auth/signup')
        .send(userData)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(409, {
          status: 409,
          error: 'Email address already taken',
        }, done);
    });

    specify('error for already existing user with username', (done) => {
      userData.email = 'dummyemail@email.com';
      request(app)
        .post('/auth/signup')
        .send(userData)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(409, {
          status: 409,
          error: 'Username already taken',
        }, done);
    });

    specify('error for password mismatch', (done) => {
      userData.passwordConfirmation = 'bacons';
      request(app)
        .post('/auth/signup')
        .send(userData)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(400, done);
    });
  });

  context('/auth/login', () => {
    it('should authenticate a user and respond with a token', (done) => {
      request(app)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          username: 'johnd',
          password: 'secret',
        })
        .expect(200)
        .then((res) => {
          const { body: { data } } = res;
          data[0].should.have.property('token');
          data[0].should.have.property('user');
          done();
        })
        .catch(done);
    });

    it('should throw an error on invalid credentials', (done) => {
      request(app)
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          username: 'johnd',
          password: 'bacons',
        })
        .expect(401, {
          status: 401,
          error: 'Invalid credentials',
        }, done);
    });
  });
});

describe('API routes', () => {
  let user1;
  let user2;
  let record;
  let user1Token;
  let user2Token;

  before(async () => {
    // create users
    user1 = await User.create({
      firstname: 'Miracle',
      lastname: 'Boi',
      othernames: 'Posnan',
      phoneNumber: '6221329283',
      email: 'dicy@email.com',
      username: 'dicy',
      password: 'secret',
    });

    user2 = await User.create({
      firstname: 'Jane',
      lastname: 'Doe',
      othernames: 'Dolly',
      phoneNumber: '6200329283',
      email: 'jane@email.com',
      username: 'janeh',
      password: 'secret',
    });

    // create record for user1
    record = await Record.create({
      createdBy: user1.id,
      type: 'red-flag',
      location: '-81.2078,138.02',
      images: [],
      videos: [],
      title: 'Record title',
      comment: 'some comment',
      status: 'draft',
    });

    user1Token = await auth(user1);
    user2Token = await auth(user2);

    return user2Token;
  });

  describe('routes: /users', () => {
    context(`GET ${baseURI}/users`, () => {
      it('should fetch all users', (done) => {
        request(app)
          .get(`${baseURI}/users`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${user1Token}`)
          .expect(200)
          .then((res) => {
            res.body.should.have.property('data')
              .with.lengthOf(5);
            done();
          })
          .catch(done);
      });
    });

    context(`GET ${baseURI}/users/:id`, () => {
      it('should fetch a specific user', (done) => {
        request(app)
          .get(`${baseURI}/users/${user1.id}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${user1Token}`)
          .expect(200)
          .then((res) => {
            const [data] = res.body.data;
            data.should.have.property('id');
            done();
          })
          .catch(done);
      });
    });
  });

  describe('routes: /red-flags', () => {
    context(`GET ${baseURI}/red-flags`, () => {
      it('should fetch all red-flag records', (done) => {
        request(app)
          .get(`${baseURI}/red-flags`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${user1Token}`)
          .expect(200)
          .then((res) => {
            res.body.should.have.property('data')
              .with.lengthOf(3);
            done();
          })
          .catch(done);
      });
    });

    context(`GET ${baseURI}/red-flags/:id`, () => {
      it('should fetch a specific red-flag record.', (done) => {
        request(app)
          .get(`${baseURI}/red-flags/1`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${user1Token}`)
          .expect(200)
          .then((res) => {
            const [data] = res.body.data;
            data.should.have.property('id');
            done();
          })
          .catch(done);
      });

      specify('error for non-existing resource', (done) => {
        request(app)
          .get(`${baseURI}/red-flags/1000`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${user1Token}`)
          .expect(404, {
            status: 404,
            error: 'Resource not found',
          }, done);
      });

      specify('error on validation failure', (done) => {
        const id = null;

        request(app)
          .get(`${baseURI}/red-flags/${id}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${user1Token}`)
          .expect(400, done);
      });
    });

    context(`POST ${baseURI}/red-flags`, () => {
      const recordData = {
        location: '-42.2078,138.0694',
        title: 'Record title',
        comment: 'Est omnis nostrum in. nobis nisi sapiente modi qui corrupti cum fuga. Quis quo corrupti.',
        media: '["https://via.placeholder.com/650x450.jpg", "https://res.cloudinary.com/devdb/video/upload/v1543497333/sample/video.flv"]',
        status: 'draft',
      };

      it('should create a new red-flag record', (done) => {
        request(app)
          .post(`${baseURI}/red-flags`)
          .send(recordData)
          .set('Authorization', `Bearer ${user1Token}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(201)
          .then((res) => {
            const [data] = res.body.data;
            data.should.have.property('id');
            done();
          })
          .catch(done);
      });

      specify('error on validation failure', (done) => {
        const recordData = {
          type: 'red-flag',
          location: 'invalid data',
          title: 'Record title',
          comment: 'Est omnis nostrum in. nobis nisi sapiente modi qui corrupti cum fuga. Quis quo corrupti.',
        };

        request(app)
          .post(`${baseURI}/red-flags`)
          .send(recordData)
          .set('Authorization', `Bearer ${user1Token}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(400)
          .end(done);
      });

      specify('error for unauthenticated user', (done) => {
        request(app)
          .post(`${baseURI}/red-flags`)
          .send(recordData)
          .set('Authorization', 'Bearer pefkewmffwefewfef')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(401, done);
      });
    });

    context(`PATCH ${baseURI}/red-flags/:id/location`, () => {
      const data = {
        location: '-81.2078,138.0233',
      };

      it('should edit the location of a specific red-flag record', (done) => {
        request(app)
          .patch(`${baseURI}/red-flags/${record.id}/location`)
          .send(data)
          .set('Authorization', `Bearer ${user1Token}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .then((res) => {
            const { body: { data } } = res;
            data[0].should.have.property('id');
            done();
          })
          .catch(done);
      });

      specify('error on validation failure', (done) => {
        request(app)
          .patch(`${baseURI}/red-flags/${record.id}/location`)
          .send({})
          .set('Authorization', `Bearer ${user1Token}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(400, done);
      });

      specify('error for non-existing resource', (done) => {
        request(app)
          .patch(`${baseURI}/red-flags/1000/location`)
          .send(data)
          .set('Authorization', `Bearer ${user1Token}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(404, {
            status: 404,
            error: 'Resource not found',
          }, done);
      });

      specify('error for unauthenticated user', (done) => {
        const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiTWlrZSIsImxhc3RuYW1lIjoiUGhpbGlwIiwib3RoZXJuYW1lcyI6IkV5aW4iLCJwaG9uZU51bWJlciI6IjYyMi0xMzItOTI4MyIsImVtYWlsIjoibHVpekBlbWFpbC5jb20iLCJ1c2VybmFtZSI6ImRicmFuZHkiLCJyZWdpc3RlcmVkIjoiMjAxOC0xMi0xM1QyMToyNjozMC45MDhaIiwiaXNBZG1pbiI6ZmFsc2V';

        request(app)
          .patch(`${baseURI}/red-flags/${record.id}/location`)
          .send(data)
          .set('Authorization', token)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(401, {
            status: 401,
            error: 'Failed authentication',
          }, done);
      });

      specify('error for unauthorized user', (done) => {
        request(app)
          .patch(`${baseURI}/red-flags/${record.id}/location`)
          .send(data)
          .set('Authorization', `Bearer ${user2Token}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(403, {
            status: 403,
            error: 'Forbidden',
          }, done);
      });
    });

    context(`PATCH ${baseURI}/red-flags/:id/comment`, () => {
      it('should edit the comment of a specific red-flag record', (done) => {
        const data = {
          comment: 'This is an updated comment',
        };

        request(app)
          .patch(`${baseURI}/red-flags/${record.id}/comment`)
          .send(data)
          .set('Authorization', `Bearer ${user1Token}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .then((res) => {
            const { body: { data } } = res;
            data[0].should.have.property('id');
            done();
          })
          .catch(done);
      });
    });

    context(`DELETE ${baseURI}/red-flags/:id`, () => {
      it('should delete a specific red-flag record', (done) => {
        request(app)
          .delete(`${baseURI}/red-flags/${record.id}`)
          .set('Authorization', `Bearer ${user1Token}`)
          .set('Accept', 'application/json')
          .expect(200)
          .then((res) => {
            const { data } = res.body;
            data[0].should.have.property('id');
            done();
          })
          .catch(done);
      });

      specify('error for non-existing resource', (done) => {
        request(app)
          .delete(`${baseURI}/red-flags/10`)
          .set('Authorization', `Bearer ${user1Token}`)
          .set('Accept', 'application/json')
          .expect(404, {
            status: 404,
            error: 'Resource not found',
          }, done);
      });

      specify('error for unauthenticated user', (done) => {
        const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiTWlrZSIsImxhc3RuYW1lIjoiUGhpbGlwIiwib3RoZXJuYW1lcyI6IkV5aW4iLCJwaG9uZU51bWJlciI6IjYyMi0xMzItOTI4MyIsImVtYWlsIjoibHVpekBlbWFpbC5jb20iLCJ1c2VybmFtZSI6ImRicmFuZHkiLCJyZWdpc3RlcmVkIjoiMjAxOC0xMi0xM1QyMToyNjozMC45MDhaIiwiaXNBZG1pbiI6ZmFsc2V9';

        request(app)
          .delete(`${baseURI}/red-flags/${record.id}`)
          .set('Authorization', token)
          .set('Accept', 'application/json')
          .expect(401, {
            status: 401,
            error: 'Failed authentication',
          }, done);
      });
    });
  });

  describe('/undefined', () => {
    it('should throw an error for invalid route', (done) => {
      request(app)
        .get(`${baseURI}/undefined`)
        .expect(404, {
          status: 404,
          error: 'Provided route is invalid',
        }, done);
    });
  });
});
