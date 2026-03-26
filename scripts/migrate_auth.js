const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  });

  try {
    console.log('Adding columns to staff table...');
    
    // Check if columns exist first (optional but safer)
    const [columns] = await connection.execute('SHOW COLUMNS FROM staff');
    const columnNames = columns.map(c => c.Field);

    if (!columnNames.includes('username')) {
      await connection.execute('ALTER TABLE staff ADD COLUMN username VARCHAR(50) UNIQUE');
      console.log('Added username column');
    }
    
    if (!columnNames.includes('password')) {
      await connection.execute('ALTER TABLE staff ADD COLUMN password VARCHAR(255)');
      console.log('Added password column');
    }

    if (!columnNames.includes('role')) {
      await connection.execute('ALTER TABLE staff ADD COLUMN role VARCHAR(20) DEFAULT "stylist"');
      console.log('Added role column');
    }

    // Set a default owner if none exists
    const [owners] = await connection.execute('SELECT * FROM staff WHERE role = "owner"');
    if (owners.length === 0) {
      console.log('Creating default owner account...');
      // We'll check if there's any staff member to promote, otherwise insert a new one
      const [staff] = await connection.execute('SELECT * FROM staff LIMIT 1');
      if (staff.length > 0) {
        await connection.execute(
          'UPDATE staff SET username = ?, password = ?, role = ? WHERE id = ?',
          ['admin', 'luxe123', 'owner', staff[0].id]
        );
        console.log(`Promoted staff ID ${staff[0].id} to owner`);
      } else {
        await connection.execute(
          'INSERT INTO staff (name, username, password, role) VALUES (?, ?, ?, ?)',
          ['System Admin', 'admin', 'luxe123', 'owner']
        );
        console.log('Created new admin staff member');
      }
    }

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

migrate();
