const express = require('express');
const router = express.Router();
const { createMessage, getAllMessages, markAsRead, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleCheck');

// Public
router.post('/', createMessage);

// Admin
router.get('/', protect, requireAdmin, getAllMessages);
router.patch('/:id/read', protect, requireAdmin, markAsRead);
router.delete('/:id', protect, requireAdmin, deleteMessage);

module.exports = router;
