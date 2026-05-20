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
    files: {
      historical: [
        {
          url: String,
          publicId: String,
          name: String,
          size: Number,
        },
      ],
      technical: [
        {
          url: String,
          publicId: String,
          name: String,
          size: Number,
        },
      ],
      symbolic: [
        {
          url: String,
          publicId: String,
          name: String,
          size: Number,
        },
      ],
    },
    subPieces: [
      {
        name: i18nField,
        description: i18nField,
        material: { type: String, default: '' },
        image: {
          url: String,
          publicId: String,
        }
      }
    ],
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
