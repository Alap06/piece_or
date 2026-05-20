const Setting = require('../models/Setting');

// GET /api/settings
const getSettings = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const query = isAdmin ? {} : { isPublic: true };
    const settings = await Setting.find(query);
    const result = {};
    settings.forEach((s) => { result[s.key] = s.value; });
    res.json({ settings: result });
  } catch (error) {
    next(error);
  }
};

// PUT /api/settings/:key
const updateSetting = async (req, res, next) => {
  try {
    const { value, label, group, isPublic } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key: req.params.key },
      { value, label, group, isPublic },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ message: 'Paramètre mis à jour', setting });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSetting };
