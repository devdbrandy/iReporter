import * as log from 'loglevel';
import db from '../../config/database';

export const migrate = async () => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // Create users table
    const createUsersTable = `
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
        updated_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;
    await client.query(createUsersTable);

    // Create records table
    const createRecordsTable = `
      CREATE TYPE record_type AS ENUM ('red-flag', 'intervention');
      CREATE TYPE record_status AS ENUM (
        'draft', 'under-investigation', 'resolved', 'rejected');
      CREATE TABLE IF NOT EXISTS records(
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type record_type,
        location VARCHAR(100) NOT NULL,
        images text[],
        videos text[],
        comment TEXT NOT NULL,
        status record_status DEFAULT 'draft',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;
    await client.query(createRecordsTable);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
    log.warn('Migration complete!');
    process.exit();
  }
};

export const reset = async () => {
  try {
    const client = await db.getClient();
    // Drop tables and types
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    await client.query('DROP TABLE IF EXISTS records');
    await client.query('DROP TYPE IF EXISTS record_type');
    await client.query('DROP TYPE IF EXISTS record_status');
  } catch (e) {
    log.warn(e.stack);
  } finally {
    log.warn('DB reset complete!');
    process.exit();
  }
};

require('make-runnable');
