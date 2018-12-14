import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
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
