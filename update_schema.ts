
import pool from './src/lib/db.ts';

async function updateSchema() {
  try {
    console.log('Starting schema updates...');

    // 1. Update appointments table
    console.log('Updating appointments table...');
    await pool.query('ALTER TABLE appointments CHANGE COLUMN appointment_date date DATE NOT NULL');
    await pool.query('ALTER TABLE appointments CHANGE COLUMN appointment_time time TIME NOT NULL');
    await pool.query('ALTER TABLE appointments ADD COLUMN type ENUM("online", "walkin") DEFAULT "online"');
    await pool.query('ALTER TABLE appointments ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    
    // 2. Create working_hours table
    console.log('Creating working_hours table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS working_hours (
        id INT AUTO_INCREMENT PRIMARY KEY,
        day_of_week INT NOT NULL,
        open_time TIME NOT NULL,
        close_time TIME NOT NULL,
        is_closed BOOLEAN DEFAULT FALSE,
        UNIQUE(day_of_week)
      )
    `);

    // Insert default working hours if table is empty
    const [rows]: any = await pool.query('SELECT COUNT(*) as count FROM working_hours');
    if (rows[0].count === 0) {
      console.log('Inserting default working hours...');
      const defaultHours = [
        [0, '09:00:00', '18:00:00', false], // Sunday
        [1, '09:00:00', '20:00:00', false], // Monday
        [2, '09:00:00', '20:00:00', false], // Tuesday
        [3, '09:00:00', '20:00:00', false], // Wednesday
        [4, '09:00:00', '20:00:00', false], // Thursday
        [5, '09:00:00', '21:00:00', false], // Friday
        [6, '09:00:00', '21:00:00', false], // Saturday
      ];
      await pool.query(
        'INSERT INTO working_hours (day_of_week, open_time, close_time, is_closed) VALUES ?',
        [defaultHours]
      );
    }

    // 3. Create staff_schedule table
    console.log('Creating staff_schedule table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS staff_schedule (
        id INT AUTO_INCREMENT PRIMARY KEY,
        staff_id INT NOT NULL,
        day_of_week INT NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        is_available BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
        UNIQUE(staff_id, day_of_week)
      )
    `);

    console.log('Schema updates completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating schema:', error);
    process.exit(1);
  }
}

updateSchema();
