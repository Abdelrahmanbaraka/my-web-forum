const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// المسارات الرئيسية
router.get('/', mainController.getHomePage);
router.get('/profile', mainController.getProfilePage);
router.post('/change-language', mainController.changeLanguage);

module.exports = router;