import chai from 'chai';
import db from '../../src/config/database';

const should = chai.should();

const hostname = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_DATABASE;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
process.env.DATABASE_URL = `postgres://${username}:${password}@${hostname}:${port}/${database}`;

describe('Database Config', () => {
  it('should establish connection using DATABASE_URL', (done) => {
    db.getClient()
      .then((client) => {
        client.database.should.equal(database);
        done();
      })
      .catch(done);
  });
});
