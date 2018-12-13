import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  database: 'ireporter',
  user: 'postgres',
  password: '',
  port: 5432,
});

export default {
  query(text, params, callback) {
    return pool.query(text, params, callback);
  },
  queryAsync(text, params) {
    return pool.query(text, params);
  },
  getClient(callback) {
    pool.connect((err, client, done) => {
      callback(err, client, done);
    });
  },
};
