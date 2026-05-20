const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, refreshToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/refresh', refreshToken);

module.exports = router;
