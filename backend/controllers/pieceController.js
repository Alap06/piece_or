const Piece = require('../models/Piece');
const cloudinary = require('../config/cloudinary');
const { fillPieceTranslations } = require('../utils/translateI18n');

// GET /api/pieces
const getAllPieces = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, search = '', lang = 'fr', published, category } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (published !== undefined) query.isPublished = published === 'true';
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { [`name.fr`]: { $regex: search, $options: 'i' } },
        { [`name.en`]: { $regex: search, $options: 'i' } },
        { [`name.ar`]: { $regex: search, $options: 'i' } },
        { material: { $regex: search, $options: 'i' } },
      ];
    }

    const [pieces, total] = await Promise.all([
      Piece.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Piece.countDocuments(query),
    ]);

    res.json({
      pieces,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/pieces/:id
const getPieceById = async (req, res, next) => {
  try {
    const piece = await Piece.findById(req.params.id);
    if (!piece) return res.status(404).json({ message: 'Pièce introuvable' });

    // Increment view count
    piece.viewCount = (piece.viewCount || 0) + 1;
    await piece.save({ validateBeforeSave: false });

    res.json({ piece });
  } catch (error) {
    next(error);
  }
};

// POST /api/pieces
const createPiece = async (req, res, next) => {
  try {
    const piece = await Piece.create(req.body);
    res.status(201).json({ message: 'Pièce créée avec succès', piece });
  } catch (error) {
    next(error);
  }
};

// PUT /api/pieces/:id
const updatePiece = async (req, res, next) => {
  try {
    const piece = await Piece.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!piece) return res.status(404).json({ message: 'Pièce introuvable' });
    res.json({ message: 'Pièce mise à jour', piece });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/pieces/:id
const deletePiece = async (req, res, next) => {
  try {
    const piece = await Piece.findById(req.params.id);
    if (!piece) return res.status(404).json({ message: 'Pièce introuvable' });

    // Delete images from Cloudinary
    for (const img of piece.images) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId).catch(() => {});
      }
    }
    
    if (piece.technicalImage && piece.technicalImage.publicId) {
      await cloudinary.uploader.destroy(piece.technicalImage.publicId).catch(() => {});
    }
    
    if (piece.symbolicData && piece.symbolicData.visualSymbols) {
      for (const sym of piece.symbolicData.visualSymbols) {
        if (sym.image && sym.image.publicId) {
           await cloudinary.uploader.destroy(sym.image.publicId).catch(() => {});
        }
      }
    }

    await piece.deleteOne();
    res.json({ message: 'Pièce supprimée avec succès' });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/pieces/:id/publish
const togglePublish = async (req, res, next) => {
  try {
    const piece = await Piece.findById(req.params.id);
    if (!piece) return res.status(404).json({ message: 'Pièce introuvable' });

    piece.isPublished = !piece.isPublished;
    await piece.save();

    res.json({
      message: piece.isPublished ? 'Pièce publiée' : 'Pièce dépubliée',
      isPublished: piece.isPublished,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/pieces/reorder
const reorderPieces = async (req, res, next) => {
  try {
    const { items } = req.body; // [{ id, order }]
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Format invalide' });
    }
    const updates = items.map(({ id, order }) =>
      Piece.findByIdAndUpdate(id, { order })
    );
    await Promise.all(updates);
    res.json({ message: 'Ordre mis à jour' });
  } catch (error) {
    next(error);
  }
};

// POST /api/pieces/:id/images — Upload images
const uploadPieceImages = async (req, res, next) => {
  try {
    const piece = await Piece.findById(req.params.id);
    if (!piece) return res.status(404).json({ message: 'Pièce introuvable' });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucun fichier reçu' });
    }

    const newImages = req.files.map((file, i) => ({
      url: file.path,
      publicId: file.filename,
      alt: piece.name?.fr || '',
      isMain: piece.images.length === 0 && i === 0,
    }));

    piece.images.push(...newImages);
    if (!piece.thumbnailUrl && newImages[0]) {
      piece.thumbnailUrl = newImages[0].url;
    }

    await piece.save();
    res.json({ message: 'Images uploadées', images: piece.images });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/pieces/:id/images/:imageId
const deletePieceImage = async (req, res, next) => {
  try {
    const piece = await Piece.findById(req.params.id);
    if (!piece) return res.status(404).json({ message: 'Pièce introuvable' });

    const imageIndex = piece.images.findIndex(
      (img) => img._id.toString() === req.params.imageId
    );
    if (imageIndex === -1) return res.status(404).json({ message: 'Image introuvable' });

    const [removed] = piece.images.splice(imageIndex, 1);
    if (removed.publicId) {
      await cloudinary.uploader.destroy(removed.publicId).catch(() => {});
    }

    if (piece.thumbnailUrl === removed.url && piece.images.length > 0) {
      piece.thumbnailUrl = piece.images[0].url;
    }

    await piece.save();
    res.json({ message: 'Image supprimée' });
  } catch (error) {
    next(error);
  }
};

// GET /api/pieces/stats
const getStats = async (req, res, next) => {
  try {
    const [total, published, totalViews] = await Promise.all([
      Piece.countDocuments(),
      Piece.countDocuments({ isPublished: true }),
      Piece.aggregate([{ $group: { _id: null, total: { $sum: '$viewCount' } } }]),
    ]);

    res.json({
      totalPieces: total,
      publishedPieces: published,
      draftPieces: total - published,
      totalViews: totalViews[0]?.total || 0,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/pieces/auto-translate-all — Remplit EN/AR pour toutes les pièces
const autoTranslateAllPieces = async (req, res, next) => {
  try {
    const pieces = await Piece.find({});
    let count = 0;
    for (const piece of pieces) {
      const plain = piece.toObject();
      const filled = await fillPieceTranslations(plain);
      piece.name = filled.name;
      piece.origin = filled.origin;
      piece.period = filled.period;
      piece.description = filled.description;
      piece.symbol = filled.symbol;
      piece.historicalData = filled.historicalData;
      piece.technicalData = filled.technicalData;
      piece.subPieces = filled.subPieces;
      await piece.save();
      count += 1;
    }
    res.json({ message: `${count} pièce(s) traduite(s)`, count });
  } catch (error) {
    next(error);
  }
};

// POST /api/pieces/:id/auto-translate — Remplit EN/AR depuis le français
const autoTranslatePiece = async (req, res, next) => {
  try {
    const piece = await Piece.findById(req.params.id);
    if (!piece) return res.status(404).json({ message: 'Pièce introuvable' });

    const plain = piece.toObject();
    const filled = await fillPieceTranslations(plain);

    piece.name = filled.name;
    piece.origin = filled.origin;
    piece.period = filled.period;
    piece.description = filled.description;
    piece.symbol = filled.symbol;
    piece.historicalData = filled.historicalData;
    piece.technicalData = filled.technicalData;
    piece.subPieces = filled.subPieces;

    await piece.save();
    res.json({ message: 'Traductions générées', piece });
  } catch (error) {
    next(error);
  }
};

// POST /api/pieces/upload-single — Generic image upload (for sub-pieces or rich text)
const uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucun fichier reçu' });
    }
    const file = req.files[0];
    res.json({ url: file.path, publicId: file.filename });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPieces,
  getPieceById,
  createPiece,
  updatePiece,
  deletePiece,
  togglePublish,
  reorderPieces,
  uploadPieceImages,
  deletePieceImage,
  getStats,
  uploadSingleImage,
  autoTranslatePiece,
  autoTranslateAllPieces,
};
