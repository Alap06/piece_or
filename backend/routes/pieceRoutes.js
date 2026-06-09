const express = require('express');
const router = express.Router();
const {
  getAllPieces, getPieceById, createPiece, updatePiece, deletePiece,
  togglePublish, reorderPieces, uploadPieceImages, deletePieceImage, getStats, uploadSingleImage,
  autoTranslatePiece, autoTranslateAllPieces,
} = require('../controllers/pieceController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleCheck');
const { uploadImages } = require('../middleware/upload');

// Public routes
router.get('/', getAllPieces);
router.get('/stats', getStats);
router.get('/:id', getPieceById);

// Admin routes
router.post('/upload-single', protect, requireAdmin, uploadImages.array('image', 1), uploadSingleImage);
router.post('/auto-translate-all', protect, requireAdmin, autoTranslateAllPieces);
router.post('/', protect, requireAdmin, createPiece);
router.put('/reorder', protect, requireAdmin, reorderPieces);
router.put('/:id', protect, requireAdmin, updatePiece);
router.delete('/:id', protect, requireAdmin, deletePiece);
router.patch('/:id/publish', protect, requireAdmin, togglePublish);
router.post('/:id/auto-translate', protect, requireAdmin, autoTranslatePiece);

// Image upload
router.post('/:id/images', protect, requireAdmin, uploadImages.array('images', 10), uploadPieceImages);
router.delete('/:id/images/:imageId', protect, requireAdmin, deletePieceImage);

module.exports = router;
