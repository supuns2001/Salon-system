
import pool from './src/lib/db';

async function checkSchema() {
  try {
    const [tables]: any = await pool.query('SHOW TABLES');
    console.log('Tables in database:', tables);
    
    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      const [columns]: any = await pool.query(`DESCRIBE \`${tableName}\``);
      console.log(`\nSchema for table ${tableName}:`);
      console.table(columns);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking schema:', error);
    process.exit(1);
  }
}

checkSchema();
