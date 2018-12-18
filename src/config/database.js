import { Pool } from 'pg';
import * as log from 'loglevel';
import { env } from '../utils';

if (process.env.DATABASE_URL) {
  const url = new URL(env('DATABASE_URL'));
  const {
    hostname,
    port,
    username,
    password,
  } = url;
  const [database] = url.pathname.split('/').slice(1);

  process.env.PGHOST = hostname;
  process.env.PGPORT = port;
  process.env.PGDATABASE = database;
  process.env.PGUSER = username;
  process.env.PGPASSWORD = password;
}

const pool = new Pool();

export default {
  query(text, params) {
    return pool.query(text, params);
  },
  getClient(callback) {
    pool.connect((err, client, done) => {
      callback(err, client, done);
    });
  },
};
