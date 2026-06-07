export const PIECE_CATEGORIES = [
  {
    id: 'bijoux-tempe',
    labelKey: 'pieces.categories.bijoux_tempe',
    pieceNames: ['Mnègech Wejh', 'Mnegech Wejh', 'Sfèla', 'Sfela'],
  },
  {
    id: 'colliers',
    labelKey: 'pieces.categories.colliers',
    pieceNames: ['Tlila', 'Hella', 'Selsla Sdar', 'Dléweh', 'Dleweh'],
  },
  {
    id: 'bracelets',
    labelKey: 'pieces.categories.bracelets',
    pieceNames: ['Mekiès Zarkoun', 'Mekies Zarkoun'],
  },
  {
    id: 'anneaux-cheville',
    labelKey: 'pieces.categories.anneaux_cheville',
    pieceNames: ['Kholkhal', 'Khlel Mahdia'],
  },
];

export const normalizePieceName = (name) =>
  (name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const getCategoryForPieceName = (nameFr) => {
  const normalized = normalizePieceName(nameFr);
  for (const cat of PIECE_CATEGORIES) {
    if (cat.pieceNames.some((n) => normalizePieceName(n) === normalized)) {
      return cat.id;
    }
  }
  return null;
};
