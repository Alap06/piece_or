/**
 * Assigne les catégories et remplit les traductions EN/AR manquantes depuis le français.
 * Usage: node scripts/syncPieces.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Piece = require('../models/Piece');
const { fillPieceTranslations } = require('../utils/translateI18n');

const CATEGORY_BY_NAME = {
  'mnegech wejh': 'bijoux-tempe',
  sfela: 'bijoux-tempe',
  tlila: 'colliers',
  hella: 'colliers',
  'selsla sdar': 'colliers',
  dleweh: 'colliers',
  'mekies zarkoun': 'bracelets',
  kholkhal: 'anneaux-cheville',
  'khlel mahdia': 'anneaux-cheville',
};

const normalize = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const run = async () => {
  await connectDB();
  const pieces = await Piece.find({});
  console.log(`📦 ${pieces.length} pièce(s) trouvée(s)`);

  for (const piece of pieces) {
    const key = normalize(piece.name?.fr);
    const category = CATEGORY_BY_NAME[key];
    if (category) piece.category = category;

    const plain = piece.toObject();
    const filled = await fillPieceTranslations(plain);

    if (category) piece.category = category;
    piece.name = filled.name;
    piece.origin = filled.origin;
    piece.period = filled.period;
    piece.description = filled.description;
    piece.symbol = filled.symbol;
    piece.historicalData = filled.historicalData;
    piece.technicalData = filled.technicalData;
    piece.subPieces = filled.subPieces;

    await piece.save();
    console.log(`✅ ${piece.name?.fr} — catégorie: ${piece.category}`);
  }

  console.log('🎉 Synchronisation terminée');
  mongoose.connection.close();
};

run().catch((err) => {
  console.error('❌', err);
  mongoose.connection.close();
  process.exit(1);
});
