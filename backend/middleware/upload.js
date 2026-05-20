const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Image storage on Cloudinary
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'piece_dor_mahdia/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
    ],
    public_id: `piece_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }),
});

// PDF storage on Cloudinary
const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'piece_dor_mahdia/documents',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
    public_id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }),
});

const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Seules les images sont autorisées'), false);
  }
  cb(null, true);
};

const pdfFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Seuls les PDF sont autorisés'), false);
  }
  cb(null, true);
};

const uploadImages = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 }, // 10MB, max 10 files
});

const uploadPDF = multer({
  storage: pdfStorage,
  fileFilter: pdfFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

module.exports = { uploadImages, uploadPDF };
