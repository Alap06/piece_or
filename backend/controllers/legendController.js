const Legend = require('../models/Legend');

// GET /api/legends (Admin - list all)
exports.getAllLegends = async (req, res, next) => {
  try {
    const legends = await Legend.find()
      .populate('piece', 'name')
      .sort({ createdAt: -1 });
    res.json({ legends });
  } catch (error) {
    next(error);
  }
};

// GET /api/legends/piece/:pieceId
exports.getLegendsByPiece = async (req, res, next) => {
  try {
    const legends = await Legend.find({ piece: req.params.pieceId }).sort({ createdAt: 1 });
    res.json({ legends });
  } catch (error) {
    next(error);
  }
};

// GET /api/legends/:slug
exports.getLegendBySlug = async (req, res, next) => {
  try {
    const legend = await Legend.findOne({ slug: req.params.slug }).populate('piece', 'name');
    if (!legend) {
      return res.status(404).json({ message: 'Légende introuvable' });
    }
    res.json({ legend });
  } catch (error) {
    next(error);
  }
};

// POST /api/legends
exports.createLegend = async (req, res, next) => {
  try {
    const legend = await Legend.create(req.body);
    res.status(201).json({ message: 'Légende créée avec succès', legend });
  } catch (error) {
    next(error);
  }
};

// PUT /api/legends/:id
exports.updateLegend = async (req, res, next) => {
  try {
    const legend = await Legend.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!legend) {
      return res.status(404).json({ message: 'Légende introuvable' });
    }
    res.json({ message: 'Légende mise à jour', legend });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/legends/:id
exports.deleteLegend = async (req, res, next) => {
  try {
    const legend = await Legend.findByIdAndDelete(req.params.id);
    if (!legend) {
      return res.status(404).json({ message: 'Légende introuvable' });
    }
    res.json({ message: 'Légende supprimée avec succès' });
  } catch (error) {
    next(error);
  }
};
