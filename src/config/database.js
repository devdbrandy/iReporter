import { Pool } from 'pg';
import { env } from '../helpers';

if (env('DATABASE_URL')) {
  const url = new URL(env('DATABASE_URL'));
  const {
    hostname,
    port,
    username,
    password,
  } = url;
  const [database] = url.pathname.split('/').slice(1);

  process.env.DB_HOST = hostname;
  process.env.DB_PORT = port;
  process.env.DB_DATABASE = database;
  process.env.DB_USERNAME = username;
  process.env.DB_PASSWORD = password;
}

const pool = new Pool({
  host: env('DB_HOST', 'localhost'),
  port: env('DB_PORT', 5432),
  database: env('DB_DATABASE', 'postgres'),
  user: env('DB_USERNAME', 'user'),
  password: env('DB_PASSWORD', 'password'),
});

export default {
  query(text, params) {
    return pool.query(text, params);
  },
  getClient() {
    return pool.connect();
  },
};
