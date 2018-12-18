import request from 'supertest';
import chai from 'chai';
import childProcesses from 'child_process';
import app from '../src/server';
import { User, Record } from '../src/models';
import { config } from '../src/utils/helpers';
import { env } from '../src/utils';

// dotenv.config();
const should = chai.should();
const { exec } = childProcesses;

const apiVersion = config('app:version');
const prefix = `/api/${apiVersion}`;

// Setup database prefix for test environment
process.env.PGDATABASE = `${env('PGDATABASE')}_test`;

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
  before(async () => {
    // refresh database
    const cleanDB = await exec('npm run migrate');
    return cleanDB;
  });

  after(async () => {
    // refresh database
    const cleanDB = await exec('npm run migrate');
    return cleanDB;
  });

  describe('POST /auth/signup', () => {
    it('should create a new user account', (done) => {
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        othernames: 'Posnan',
        phoneNumber: '6221329283',
        username: 'johnd',
        email: 'johnd@email.com',
        password: 'secret',
      };

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
  });

  describe('/auth/login', () => {
    it('should authenticate a user and respond with a token', (done) => {
      request(app)
        .post('/auth/login')
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
          error: 'Wrong username or password',
        }, done);
    });
  });
});

describe('routes: /red-flags', () => {
  let resToken;
  let user;
  let record;

  before(async () => {
    // migrate database tables & seed dummy data
    const setupDB = await exec('npm run migrate');

    // create user
    user = await User.create({
      firstname: 'Miracle',
      lastname: 'Boi',
      othernames: 'Posnan',
      phoneNumber: '6221329283',
      username: 'dicy',
      email: 'dicy@email.com',
      password: 'secret',
    });

    record = await Record.create({
      createdBy: user.id,
      type: 'red-flag',
      location: '-81.2078,138.02',
      images: [],
      videos: [],
      comment: 'some comment',
    });

    const { body: { data: [response] } } = await request(app)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send({
        username: 'dicy',
        password: 'secret',
      })
      .expect(200);

    const { token } = response;
    resToken = token;

    return setupDB;
  });

  after(async () => {
    // refresh database
    const cleanDB = await exec('npm run migrate');
    return cleanDB;
  });

  describe(`GET ${prefix}/red-flags`, () => {
    it('should fetch all red-flag records', (done) => {
      request(app)
        .get(`${prefix}/red-flags`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${resToken}`)
        .expect(200)
        .then((res) => {
          res.body.should.have.property('data')
            .with.lengthOf(1);
          done();
        })
        .catch(done);
    });
  });

  describe(`GET ${prefix}/red-flags/:id`, () => {
    it('should fetch a specific red-flag record.', (done) => {
      request(app)
        .get(`${prefix}/red-flags/1`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${resToken}`)
        .expect(200)
        .then((res) => {
          const [data] = res.body.data;
          data.should.have.property('id');
          done();
        })
        .catch(done);
    });

    it('should throw an error for non-existing resource', (done) => {
      request(app)
        .get(`${prefix}/red-flags/1000`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${resToken}`)
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
        .set('Authorization', `Bearer ${resToken}`)
        .expect(400, done);
    });
  });

  describe(`POST ${prefix}/red-flags`, () => {
    it('should create a new red-flag record', (done) => {
      const recordData = {
        location: '-42.2078,138.0694',
        images: [
          'https://via.placeholder.com/650x450',
          'https://via.placeholder.com/650x450',
          'https://via.placeholder.com/650x450',
        ],
        videos: [
          'https://res.cloudinary.com/devdb/video/upload/v1543497333/sample/video.flv',
        ],
        comment: 'Est omnis nostrum in. nobis nisi sapiente modi qui corrupti cum fuga. Quis quo corrupti.',
      };

      request(app)
        .post(`${prefix}/red-flags`)
        .send(recordData)
        .set('Authorization', `Bearer ${resToken}`)
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

    it('should throw an error on validation failure', (done) => {
      const recordData = {
        type: 'red-flag',
        location: 'invalid data',
        comment: 'Est omnis nostrum in. nobis nisi sapiente modi qui corrupti cum fuga. Quis quo corrupti.',
      };

      request(app)
        .post(`${prefix}/red-flags`)
        .send(recordData)
        .set('Authorization', `Bearer ${resToken}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(400)
        .end(done);
    });

    it('should throw an error for unauthenticated user', (done) => {
      const recordData = {
        location: '-42.2078,138.0694',
        images: [
          'https://via.placeholder.com/650x450',
          'https://via.placeholder.com/650x450',
          'https://via.placeholder.com/650x450',
        ],
        videos: [
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
        .patch(`${prefix}/red-flags/${record.id}/location`)
        .send(data)
        .set('Authorization', `Bearer ${resToken}`)
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

    it('should throw an error on validation failure', (done) => {
      request(app)
        .patch(`${prefix}/red-flags/${record.id}/location`)
        .send({})
        .set('Authorization', `Bearer ${resToken}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(400, done);
    });

    it('should throw an error for non-existing resource', (done) => {
      request(app)
        .patch(`${prefix}/red-flags/1000/location`)
        .send(data)
        .set('Authorization', `Bearer ${resToken}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(404, {
          status: 404,
          error: 'Resource not found',
        }, done);
    });

    it('should throw an error for unauthorized user', (done) => {
      const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiTWlrZSIsImxhc3RuYW1lIjoiUGhpbGlwIiwib3RoZXJuYW1lcyI6IkV5aW4iLCJwaG9uZU51bWJlciI6IjYyMi0xMzItOTI4MyIsImVtYWlsIjoibHVpekBlbWFpbC5jb20iLCJ1c2VybmFtZSI6ImRicmFuZHkiLCJyZWdpc3RlcmVkIjoiMjAxOC0xMi0xM1QyMToyNjozMC45MDhaIiwiaXNBZG1pbiI6ZmFsc2V9';

      request(app)
        .patch(`${prefix}/red-flags/${record.id}/location`)
        .send(data)
        .set('Authorization', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(403, done);
    });
  });

  describe(`PATCH ${prefix}/red-flags/:id/comment`, () => {
    it('should edit the comment of a specific red-flag record', (done) => {
      const data = {
        comment: 'This is an updated comment',
      };

      request(app)
        .patch(`${prefix}/red-flags/${record.id}/comment`)
        .send(data)
        .set('Authorization', `Bearer ${resToken}`)
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

  describe(`DELETE ${prefix}/red-flags/:id`, () => {
    it('should delete a specific red-flag record', (done) => {
      request(app)
        .delete(`${prefix}/red-flags/1`)
        .set('Authorization', `Bearer ${resToken}`)
        .set('Accept', 'application/json')
        .expect(200)
        .then((res) => {
          const { data } = res.body;
          data[0].should.have.property('id');
          done();
        })
        .catch(done);
    });

    it('should throw an error for non-existing resource', (done) => {
      request(app)
        .delete(`${prefix}/red-flags/10`)
        .set('Authorization', `Bearer ${resToken}`)
        .set('Accept', 'application/json')
        .expect(404, {
          status: 404,
          error: 'Resource not found',
        }, done);
    });

    it('should throw an error for unauthorized user', (done) => {
      const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiTWlrZSIsImxhc3RuYW1lIjoiUGhpbGlwIiwib3RoZXJuYW1lcyI6IkV5aW4iLCJwaG9uZU51bWJlciI6IjYyMi0xMzItOTI4MyIsImVtYWlsIjoibHVpekBlbWFpbC5jb20iLCJ1c2VybmFtZSI6ImRicmFuZHkiLCJyZWdpc3RlcmVkIjoiMjAxOC0xMi0xM1QyMToyNjozMC45MDhaIiwiaXNBZG1pbiI6ZmFsc2V9';

      request(app)
        .delete(`${prefix}/red-flags/${record.id}`)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect(403, {
          status: 403,
          error: 'Failed authentication',
        }, done);
    });
  });
});
