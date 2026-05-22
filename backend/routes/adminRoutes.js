const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleCheck');

router.use(protect);
router.use(requireAdmin);

// Dashboard
router.get('/stats', adminController.getDashboardStats);

// Médiathèque
router.get('/media', adminController.getAllMedia);
router.delete('/media/:publicId', adminController.deleteMedia);

// Gestion Admins
router.get('/users', adminController.getAdmins);
router.post('/users', adminController.createAdmin);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users/:id/reset-password', adminController.resetUserPasswordEmail);

module.exports = router;
