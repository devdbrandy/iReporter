import 'babel-polyfill';
import { logger } from '../../helpers/utils';
import db from '../../config/database';

// Create users table
const createUsersTable = `
  CREATE TYPE user_gender AS ENUM ('male', 'female');
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    othernames VARCHAR(50),
    phone_number VARCHAR(50),
    email VARCHAR (255) UNIQUE NOT NULL,
    username VARCHAR (50) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    gender user_gender,
    avatar VARCHAR(255) DEFAULT 'https://res.cloudinary.com/devdb/image/upload/v1556782124/ireporter/yuibc08qscglcukoncaq.png',
    bio TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

// Create records table
const createRecordsTable = `
  CREATE TYPE record_type AS ENUM ('red-flag', 'intervention');
  CREATE TYPE record_status AS ENUM (
    'draft', 'published', 'under-investigation', 'resolved', 'rejected');
  CREATE TABLE IF NOT EXISTS records(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type record_type NOT NULL,
    location VARCHAR(100) NOT NULL,
    images text[],
    videos text[],
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    status record_status DEFAULT 'draft',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

const autoUpdateFunction = `
  CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';`;

const autoUpdateTrigger = table => (
  `CREATE TRIGGER update_${table}_moddatetime
  BEFORE UPDATE ON ${table} FOR EACH ROW EXECUTE PROCEDURE update_modified_column();`
);

export const migrate = async () => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');
    await client.query(createUsersTable);
    await client.query(createRecordsTable);
    await client.query(autoUpdateFunction);
    await client.query(autoUpdateTrigger('users'));
    await client.query(autoUpdateTrigger('records'));
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
    logger.log('Database migration completed successfully.');
    process.exit();
  }
};

export const reset = async () => {
  try {
    const client = await db.getClient();
    // Drop tables and types
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    await client.query('DROP TYPE IF EXISTS user_gender');
    await client.query('DROP TABLE IF EXISTS records');
    await client.query('DROP TYPE IF EXISTS record_type');
    await client.query('DROP TYPE IF EXISTS record_status');
  } catch (e) {
    throw e;
  } finally {
    process.exit();
  }
};

require('make-runnable');
