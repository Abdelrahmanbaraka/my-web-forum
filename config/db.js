const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'web_forum',
  password: process.env.DB_PASSWORD || 'Tanta12345',
  port: process.env.DB_PORT || 5432,
});

// Test connection and create tables if they don't exist
const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE,
        password_hash VARCHAR(255),
        is_anonymous BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP WITH TIME ZONE,
        reputation INTEGER DEFAULT 0
      );
      
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(50) NOT NULL,
        is_anonymous BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        view_count INTEGER DEFAULT 0
      );
      
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        is_anonymous BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database tables verified/created');
    client.release();
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

initializeDatabase();

module.exports = pool;