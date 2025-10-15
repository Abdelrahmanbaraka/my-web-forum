const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// تأكد من أن المسارات مضبوطة
router.get('/login', authController.getLoginPage);
router.post('/login', authController.login);  // ← هذا هو السطر 6 الذي فيه المشكلة
router.get('/register', authController.getRegisterPage);
router.post('/register', authController.register);
router.post('/anonymous-login', authController.anonymousLogin);
router.post('/logout', authController.logout);

module.exports = router;