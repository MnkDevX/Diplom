const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const query = (text, params) => pool.query(text, params);

const testConnection = async () => {
  await pool.query('SELECT 1');
  console.log('PostgreSQL connection successful');
};

module.exports = { pool, query, testConnection };
