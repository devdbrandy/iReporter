const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  database: 'ireporter',
  user: 'postgres',
  password: '',
  port: 5432,
});

(async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const insertUser = `
      INSERT INTO users(
        firstname, lastname, othernames, phone_number, email, username, password
      )
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    const password = '$2a$08$dEaZzY9fp1BkawSQnQ9xnukRx/Z03Us/RB2vZbP/H9xqm4fsIarXy';
    const userValues = ['Mike', 'Philip', 'Eyin', '622-132-9283', 'luiz@email.com', 'dbrandy', password];
    const { rows } = await client.query(insertUser, userValues);

    const insertRecord = `
      INSERT INTO records(
        user_id, type, location, images, videos, comment
      )
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const recordValues = [rows[0].id, 'red-flag', 'location', [], [], 'comment'];
    await client.query(insertRecord, recordValues);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
})().catch(e => console.error(e.stack));
