const express = require('express');
const router = express.Router();
const { optionalAuthenticate } = require('../middleware/authMiddleware');
const { sanitizeText } = require('../utils/sanitize');
const { createComment, getCommentsForPost } = require('../models/commentModel');
const { getPostById } = require('../models/postModel');

// جلب تعليقات لمنشور
router.get('/:postId', async (req, res) => {
  try {
    console.log('🔄 Fetching comments for post:', req.params.postId);
    const comments = await getCommentsForPost(req.params.postId);
    res.json(comments);
  } catch (err) {
    console.error('❌ Error fetching comments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// إنشاء تعليق (يسمح بالـ anonymous مثل المنشورات)
router.post('/:postId', optionalAuthenticate, async (req, res) => {
  try {
    console.log('🔄 Creating comment for post:', req.params.postId);
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    
    const { body, pseudonym, anonymous } = req.body;
    
    // تحقق من وجود المنشور
    const post = await getPostById(req.params.postId);
    if (!post) {
      console.log('❌ Post not found:', req.params.postId);
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (!body || !body.trim()) {
      console.log('❌ Body required');
      return res.status(400).json({ message: 'Body required' });
    }

    let author_id = null;
    if (req.user && !anonymous) {
      author_id = req.user.id;
      console.log('✅ Using authenticated user:', author_id);
    } else if (!req.user && !anonymous) {
      console.log('❌ Must be logged in for non-anonymous comments');
      return res.status(401).json({ message: 'Must be logged in to comment unless anonymous' });
    } else {
      console.log('✅ Creating anonymous comment');
    }

    const cleanBody = sanitizeText(body.trim());
    const cleanPseudo = pseudonym ? sanitizeText(pseudonym.trim()) : null;

    console.log('🔄 Creating comment with data:', {
      post_id: req.params.postId,
      author_id,
      body: cleanBody.substring(0, 50) + '...',
      pseudonym: cleanPseudo,
      anonymous: !!anonymous
    });

    const comment = await createComment({
      post_id: req.params.postId,
      author_id: author_id,
      body: cleanBody,
      pseudonym: cleanPseudo,
      anonymous: !!anonymous
    });

    console.log('✅ Comment created successfully:', comment);
    res.status(201).json(comment);
  } catch (err) {
    console.error('❌ Error creating comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;