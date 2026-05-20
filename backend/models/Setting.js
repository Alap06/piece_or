const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: mongoose.Schema.Types.Mixed },
    label: { type: String, default: '' },
    group: { type: String, default: 'general' },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', SettingSchema);
