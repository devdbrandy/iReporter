import * as log from 'loglevel';
import db from '../../config/database';

(async () => {
  const client = await db.getClient();

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

    const adminValues = ['James', 'Bond', 'Administrator', '622-132-9223', 'admin@ireporter.com', 'admin', password];
    await client.query(insertUser, adminValues);

    const userValues = ['Mike', 'Posnan', 'Eyin', '622-132-9283', 'luiz@email.com', 'mikepos', password];
    const { rows: [row] } = await client.query(insertUser, userValues);
    const { id: userId } = row;

    const insertRecord = `
      INSERT INTO records(
        user_id, type, location, images, videos, comment
      )
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const recordValues1 = [userId, 'red-flag', '-42.2078,98.33', [], [], 'Bad roads'];
    const recordValues2 = [userId, 'red-flag', '-33.2078,18.023', [], [], 'Leader tips street thugs'];
    const recordValues3 = [userId, 'intervention', '-45.2078,138.441', [], [], 'Bridge contruction needed'];
    await client.query(insertRecord, recordValues1);
    await client.query(insertRecord, recordValues2);
    await client.query(insertRecord, recordValues3);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
    log.warn('Seed complete!');
    process.exit();
  }
})().catch(e => log.warn(e.stack));
