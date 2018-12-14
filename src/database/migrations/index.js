import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

(async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    // Drop tables
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    await client.query('DROP TABLE IF EXISTS records');

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
      DROP TYPE IF EXISTS record_type;
      DROP TYPE IF EXISTS record_status;
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
  }
})().catch(e => console.error(e.stack));
