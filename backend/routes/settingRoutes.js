const express = require('express');
const router = express.Router();
const { getSettings, updateSetting } = require('../controllers/settingController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleCheck');

router.get('/', protect, getSettings);
router.put('/:key', protect, requireAdmin, updateSetting);

module.exports = router;
