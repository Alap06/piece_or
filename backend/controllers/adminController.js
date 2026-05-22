const Piece = require('../models/Piece');
const User = require('../models/User');
const Legend = require('../models/Legend');
const cloudinary = require('../config/cloudinary');
const crypto = require('crypto');
// const sendEmail = require('../utils/sendEmail'); // Assuming there might be a sendEmail utility, we'll mock it if it doesn't exist

// ─── 7.2 Dashboard ───────────────────────────────────────────
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalPieces = await Piece.countDocuments();
    const publishedPieces = await Piece.countDocuments({ isPublished: true });
    const draftPieces = totalPieces - publishedPieces;
    
    const totalLegends = await Legend.countDocuments();
    
    const piecesWithImages = await Piece.find({}, 'images technicalImage symbolicData.visualSymbols');
    let totalImages = 0;
    piecesWithImages.forEach(p => {
      totalImages += p.images ? p.images.length : 0;
      if (p.technicalImage && p.technicalImage.url) totalImages += 1;
      if (p.symbolicData && p.symbolicData.visualSymbols) {
        totalImages += p.symbolicData.visualSymbols.length;
      }
    });
    
    const latestPieces = await Piece.find().sort({ updatedAt: -1 }).limit(5);

    res.json({
      totalPieces,
      publishedPieces,
      draftPieces,
      totalLegends,
      totalImages,
      latestPieces
    });
  } catch (error) {
    next(error);
  }
};

// ─── 7.6 Médiathèque ──────────────────────────────────────
// GET /api/admin/media
exports.getAllMedia = async (req, res, next) => {
  try {
    const pieces = await Piece.find({}, 'name images technicalImage symbolicData.visualSymbols');
    let mediaList = [];
    
    pieces.forEach(piece => {
      if (piece.images && piece.images.length > 0) {
        piece.images.forEach(img => {
          mediaList.push({
            _id: img._id,
            url: img.url,
            publicId: img.publicId,
            filename: img.publicId ? img.publicId.split('/').pop() : 'Inconnu',
            type: 'image',
            category: 'gallery',
            linkedPieceId: piece._id,
            linkedPieceName: piece.name,
            uploadDate: img._id ? img._id.getTimestamp() : new Date()
          });
        });
      }
      
      if (piece.technicalImage && piece.technicalImage.url) {
        mediaList.push({
          _id: piece._id, // Just using piece id as identifier
          url: piece.technicalImage.url,
          publicId: piece.technicalImage.publicId,
          filename: piece.technicalImage.publicId ? piece.technicalImage.publicId.split('/').pop() : 'Inconnu',
          type: 'image',
          category: 'technical',
          linkedPieceId: piece._id,
          linkedPieceName: piece.name,
          uploadDate: new Date()
        });
      }

      if (piece.symbolicData && piece.symbolicData.visualSymbols) {
        piece.symbolicData.visualSymbols.forEach(sym => {
          if (sym.image && sym.image.url) {
            mediaList.push({
              _id: sym._id,
              url: sym.image.url,
              publicId: sym.image.publicId,
              filename: sym.image.publicId ? sym.image.publicId.split('/').pop() : 'Inconnu',
              type: 'image',
              category: 'symbolic',
              linkedPieceId: piece._id,
              linkedPieceName: piece.name,
              uploadDate: sym._id ? sym._id.getTimestamp() : new Date()
            });
          }
        });
      }
    });

    // Sort by newest first
    mediaList.sort((a, b) => b.uploadDate - a.uploadDate);

    res.json({ media: mediaList });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/media/:publicId
exports.deleteMedia = async (req, res, next) => {
  try {
    const { publicId } = req.params;
    const { type, pieceId, mediaId } = req.body; // Pass pieceId and mediaId to delete from DB

    if (publicId && publicId !== 'null') {
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    if (pieceId && mediaId) {
      const piece = await Piece.findById(pieceId);
      if (piece) {
        if (type === 'image' && req.body.category === 'gallery') {
          piece.images = piece.images.filter(img => img._id.toString() !== mediaId);
          if (piece.thumbnailUrl && piece.images.length === 0) {
            piece.thumbnailUrl = '';
          } else if (piece.thumbnailUrl && !piece.images.find(img => img.url === piece.thumbnailUrl)) {
            piece.thumbnailUrl = piece.images[0].url;
          }
        } else if (type === 'image' && req.body.category === 'technical') {
          piece.technicalImage = { url: '', publicId: '' };
        } else if (type === 'image' && req.body.category === 'symbolic') {
          if (piece.symbolicData && piece.symbolicData.visualSymbols) {
            const sym = piece.symbolicData.visualSymbols.id(mediaId);
            if (sym) {
              sym.image = { url: '', publicId: '' };
            }
          }
        }
        await piece.save();
      }
    }

    res.json({ message: 'Média supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

// ─── 7.7 Gestion des Admins ───────────────────────────────────
// GET /api/admin/users
exports.getAdmins = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $in: ['admin', 'user'] } }).select('-passwordHash -refreshToken');
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/users
exports.createAdmin = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email ou nom existe déjà' });
    }

    const user = await User.create({
      username,
      email,
      passwordHash: password, // Pre-save hook hashes it
      role: role || 'admin'
    });

    res.status(201).json({ message: 'Compte créé avec succès', user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    
    user.role = req.body.role;
    await user.save();
    
    res.json({ message: 'Rôle mis à jour', user });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    res.json({ message: 'Compte supprimé' });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/users/:id/reset-password
exports.resetUserPasswordEmail = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    // Here you would typically send an email
    // await sendEmail({ email: user.email, subject: 'Password Reset', message: resetUrl });
    
    res.json({ message: 'Lien de réinitialisation envoyé par email (simulé)', resetUrl });
  } catch (error) {
    next(error);
  }
};
