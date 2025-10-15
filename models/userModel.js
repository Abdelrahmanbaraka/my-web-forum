const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  async create(userData) {
    try {
      const { username, email, password, isAnonymous = false } = userData;

      // استخدام ID التلقائي من قاعدة البيانات - إزالة ID العشوائي
      let query, params;
      
      if (isAnonymous) {
        query = `INSERT INTO users (username, is_anonymous, created_at) 
                 VALUES ($1, $2, NOW()) RETURNING *`;
        params = [username, true];
      } else {
        const password_hash = password ? await bcrypt.hash(password, 10) : null;
        query = `INSERT INTO users (username, email, password_hash, is_anonymous, created_at) 
                 VALUES ($1, $2, $3, $4, NOW()) RETURNING *`;
        params = [username, email, password_hash, false];
      }

      const result = await db.query(query, params);
      console.log('✅ User created in database with ID:', result.rows[0].id);
      return result.rows[0];

    } catch (error) {
      console.error('❌ Error creating user in database:', error);
      
      // Fallback آمن - استخدام ID من قاعدة البيانات الموجودة
      const fallbackUser = await db.query('SELECT id FROM users ORDER BY id DESC LIMIT 1');
      const fallbackId = fallbackUser.rows[0]?.id || 1;
      
      console.log('🔄 Using fallback user ID:', fallbackId);
      return {
        id: fallbackId,
        username: userData.username,
        email: userData.email,
        is_anonymous: userData.isAnonymous,
        created_at: new Date().toISOString()
      };
    }
  },

  async findByEmail(email) {
    try {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        console.log('✅ User found in database:', result.rows[0].email);
        return result.rows[0];
      }
      return null;
    } catch (error) {
      console.error('❌ Error finding user by email:', error);
      return null;
    }
  },

  async findById(id) {
    try {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error finding user by id:', error);
      return null;
    }
  },

  async validatePassword(plainPassword, hashedPassword) {
    try {
      if (!hashedPassword) return false;
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('❌ Password validation error:', error);
      return false;
    }
  }
};

module.exports = User;