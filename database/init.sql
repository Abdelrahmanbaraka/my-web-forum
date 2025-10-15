// /db/index.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('Unexpected PG error', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
