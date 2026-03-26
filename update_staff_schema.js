
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  });
  try {
    console.log('Altering table staff...');
    await pool.query('ALTER TABLE staff MODIFY COLUMN photo_url TEXT');
    console.log('Successfully changed staff.photo_url to TEXT');
    
    const [columns] = await pool.query('DESCRIBE staff');
    console.table(columns);
  } catch (e) {
    console.error('Error during schema update:', e);
  } finally {
    await pool.end();
  }
}
run();
