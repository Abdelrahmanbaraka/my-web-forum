const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/new', postController.getCreatePostPage);
router.post('/new', postController.createPost);  
router.get('/:id', postController.getPostPage);
router.post('/:id/comments', postController.addComment);

module.exports = router;