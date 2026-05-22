const mongoose = require('mongoose');

const i18nField = {
  fr: { type: String, default: '' },
  en: { type: String, default: '' },
  ar: { type: String, default: '' },
};

const LegendSchema = new mongoose.Schema(
  {
    name: i18nField,
    shortDescription: i18nField,
    longSignification: i18nField,
    piece: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Piece',
      required: true,
    },
    positionX: {
      type: Number,
      default: 0,
    },
    positionY: {
      type: Number,
      default: 0,
    },
    symbol: {
      type: String,
      default: '✦',
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from French name
LegendSchema.pre('save', function (next) {
  if (this.name?.fr && (!this.slug || this.isModified('name.fr'))) {
    this.slug = this.name.fr
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .trim() + '-' + Date.now().toString().slice(-4); // Append random chars to ensure uniqueness across piece legends
  }
  next();
});

module.exports = mongoose.model('Legend', LegendSchema);
