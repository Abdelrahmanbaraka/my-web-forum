const db = require('../config/db');

const Post = {
  async create(postData) {
    try {
      console.log('🔄 Creating post in database:', {
        title: postData.title,
        author_id: postData.author_id,
        category: postData.category,
        is_anonymous: postData.is_anonymous
      });

      const result = await db.query(
        `INSERT INTO posts (title, content, author_id, category, is_anonymous, created_at) 
         VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
        [postData.title, postData.content, postData.author_id, postData.category, postData.is_anonymous || false]
      );

      console.log('✅ Post created successfully');
      return result.rows[0];
    } catch (error) {
      console.error('❌ Database error creating post:', error);
      throw error;
    }
  },

  async findAll(category = 'all', searchQuery = '') {
    try {
      console.log('🔍 [POST MODEL] Finding posts - Category:', category, 'Search:', searchQuery);
      
      let query;
      const params = [];

      // ✅ الإصلاح: query منفصلة لكل حالة
      if (category && category !== 'all') {
        query = `SELECT p.*, u.username FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.category = $1`;
        params.push(category);
        
        if (searchQuery && searchQuery.trim() !== '') {
          query += ` AND (p.title ILIKE $2 OR p.content ILIKE $2)`;
          params.push(`%${searchQuery}%`);
        }
        
        console.log(`✅ [POST MODEL] Query for specific category: ${category}`);
      } else {
        query = `SELECT p.*, u.username FROM posts p LEFT JOIN users u ON p.author_id = u.id`;
        
        if (searchQuery && searchQuery.trim() !== '') {
          query += ` WHERE (p.title ILIKE $1 OR p.content ILIKE $1)`;
          params.push(`%${searchQuery}%`);
        }
        
        console.log(`✅ [POST MODEL] Query for all categories`);
      }

      query += ` ORDER BY p.created_at DESC`;
      
      console.log('📝 [POST MODEL] Final query:', query);
      console.log('🔢 [POST MODEL] Query params:', params);

      const result = await db.query(query, params);
      
      console.log(`✅ [POST MODEL] Found ${result.rows.length} posts for category: "${category}"`);
      
      // تحقق إضافي
      if (category && category !== 'all') {
        const filteredCategories = {};
        result.rows.forEach(post => {
          filteredCategories[post.category] = (filteredCategories[post.category] || 0) + 1;
        });
        console.log('🎯 [POST MODEL] Filter verification:', filteredCategories);
      }
      
      return result.rows;
    } catch (error) {
      console.error('❌ [POST MODEL] Database error:', error);
      return [];
    }
  },

  async findById(id) {
    try {
      const result = await db.query(
        `SELECT p.*, u.username FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.id = $1`,
        [id]
      );

      if (result.rows.length > 0) {
        console.log('✅ Post found');
        return result.rows[0];
      }

      console.log('❌ Post not found');
      return null;
    } catch (error) {
      console.error('❌ Database error in findById:', error);
      return null;
    }
  }
};

module.exports = Post;