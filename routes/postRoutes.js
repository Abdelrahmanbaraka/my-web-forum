const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// تأكد من أن المسارات مضبوطة بالترتيب الصحيح
router.get('/new', postController.getCreatePostPage);
router.post('/new', postController.createPost);  // هذا اللي بيستقبل بيانات البوست
router.get('/:id', postController.getPostPage);
router.post('/:id/comments', postController.addComment);

module.exports = router;