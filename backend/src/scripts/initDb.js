const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  // Create a pool using the DATABASE_URL from .env
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Read the init.sql file
    const sqlPath = path.join(__dirname, '../../../database/init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Initializing database...');
    await pool.query(sql);
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
