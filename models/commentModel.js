const db = require('../config/db');

const Comment = {
  async create(commentData) {
    try {
      console.log('🔄 Creating comment in database:', {
        post_id: commentData.post_id,
        author_id: commentData.author_id,
        anonymous: commentData.anonymous
      });

      const result = await db.query(
        `INSERT INTO comments (content, author_id, post_id, is_anonymous, created_at) 
         VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
        [commentData.body, commentData.author_id, commentData.post_id, commentData.anonymous || false]
      );

      console.log('✅ Comment created successfully');
      return result.rows[0];
    } catch (error) {
      console.error('❌ Database error creating comment:', error);
      throw error;
    }
  },

  async getCommentsForPost(postId) {
    try {
      const result = await db.query(
        `SELECT c.*, u.username 
         FROM comments c 
         LEFT JOIN users u ON c.author_id = u.id 
         WHERE c.post_id = $1 
         ORDER BY c.created_at ASC`,
        [postId]
      );

      console.log(`✅ Found ${result.rows.length} comments for post ${postId}`);
      return result.rows;
    } catch (error) {
      console.error('❌ Database error fetching comments:', error);
      return [];
    }
  }
};

module.exports = Comment;
