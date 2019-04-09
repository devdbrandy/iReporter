import 'babel-polyfill';
import { logger } from '../../helpers/utils';
import db from '../../config/database';

(async () => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');
    const insertUser = `
      INSERT INTO users(
        firstname, lastname, othernames, phone_number, email, username, is_admin, password
      )
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    const password = '$2a$08$dEaZzY9fp1BkawSQnQ9xnukRx/Z03Us/RB2vZbP/H9xqm4fsIarXy';

    const admin = [
      'James',
      'Bond',
      'Administrator',
      '622-132-9223',
      'admin@admin.com',
      'admin',
      true,
      password,
    ];
    await client.query(insertUser, admin);

    const user = [
      'John',
      'Doe',
      'Bravo',
      '602-362-9283',
      'user@user.com',
      'user123',
      false,
      password,
    ];
    const { rows: [row] } = await client.query(insertUser, user);
    const { id: userId } = row;

    const insertRecord = `
      INSERT INTO records(
        user_id, type, location, images, videos, title, comment, status
      )
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    const record1 = [
      userId,
      'red-flag',
      '-42.2078,98.33',
      [],
      [],
      'Record 1 title',
      'Bad roads',
      'draft',
    ];
    const record2 = [
      userId,
      'red-flag',
      '-33.2078,18.023',
      [],
      [],
      'Record 2 title',
      'Leader tips street thugs',
      'under-investigation',
    ];
    const record3 = [
      userId,
      'intervention',
      '-45.2078,138.441',
      [],
      [],
      'Record 3 title',
      'Bridge contruction needed',
      'resolved',
    ];
    await client.query(insertRecord, record1);
    await client.query(insertRecord, record2);
    await client.query(insertRecord, record3);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
    logger.log('Database seeding completed successfully.');
    process.exit();
  }
})();
