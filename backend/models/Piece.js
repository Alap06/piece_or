const mongoose = require('mongoose');

const i18nField = {
  fr: { type: String, default: '' },
  en: { type: String, default: '' },
  ar: { type: String, default: '' },
};

const PieceSchema = new mongoose.Schema(
  {
    name: i18nField,
    origin: i18nField,
    period: i18nField,
    description: i18nField,
    symbol: i18nField,
    category: {
      type: String,
      enum: ['bijoux-tempe', 'colliers', 'bracelets', 'anneaux-cheville', 'autre'],
      default: 'autre',
    },
    material: { type: String, default: '' },
    color: { type: String, default: '' },
    images: [
      {
        url: String,
        publicId: String,
        alt: String,
        isMain: { type: Boolean, default: false },
      },
    ],
    thumbnailUrl: { type: String, default: '' },
    technicalImage: {
      url: String,
      publicId: String,
    },
    historicalData: [
      {
        label: i18nField,
        value: i18nField,
        order: { type: Number, default: 0 },
      },
    ],
    technicalData: [
      {
        label: i18nField,
        value: i18nField,
        order: { type: Number, default: 0 },
      },
    ],
    symbolicData: {
      greimas: [
        {
          level: { type: String, enum: ['plastique', 'figuratif', 'symbolique'] },
          element: i18nField,
          signification: i18nField,
        },
      ],
      visualSymbols: [
        {
          image: {
            url: String,
            publicId: String,
          },
          name: i18nField,
          signification: i18nField,
        },
      ],
    },
    isPublished: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    slug: { type: String, unique: true, sparse: true },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from French name
PieceSchema.pre('save', function (next) {
  if (this.name?.fr && !this.slug) {
    this.slug = this.name.fr
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .trim();
  }
  next();
});

module.exports = mongoose.model('Piece', PieceSchema);
