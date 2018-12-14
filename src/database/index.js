import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
