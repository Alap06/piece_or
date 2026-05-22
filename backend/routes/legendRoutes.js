const express = require('express');
const router = express.Router();
const legendController = require('../controllers/legendController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleCheck');

// Public routes
router.get('/piece/:pieceId', legendController.getLegendsByPiece);
router.get('/:slug', legendController.getLegendBySlug);

// Admin - list all
router.get('/', protect, requireAdmin, legendController.getAllLegends);

// Admin routes
router.post('/', protect, requireAdmin, legendController.createLegend);
router.put('/:id', protect, requireAdmin, legendController.updateLegend);
router.delete('/:id', protect, requireAdmin, legendController.deleteLegend);

module.exports = router;
