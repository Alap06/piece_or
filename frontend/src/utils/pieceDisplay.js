/** Images symboliques statiques par nom FR (fallback si non en base) */
export const SYMBOLIC_IMAGES_BY_NAME = {
  Tlila: ['/symbolique/symbol/tlila.jpg'],
  Sfèla: ['/symbolique/symbol/sfela.jpg'],
  'Mnègech Wejh': ['/symbolique/symbol/mnegech.jpg'],
  Dléweh: ['/symbolique/symbol/Dleweh.jpg'],
  Hella: ['/symbolique/symbol/hella.jpg', '/symbolique/symbol/hella(1).jpg'],
  Kholkhal: ['/symbolique/symbol/Kholkhal.jpg'],
  'Mekiès Zarkoun': ['/symbolique/symbol/Mekiès Zarkoun.jpg'],
  'Selsla Sdar': ['/symbolique/symbol/selsla sdar.jpg'],
};

export const getLocalized = (field, lang, fallbackLang = 'fr') => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field[fallbackLang] || '';
};

export const getPieceImages = (piece) => {
  if (piece.images?.length > 0) return piece.images;
  if (piece.thumbnailUrl) return [{ url: piece.thumbnailUrl }];
  return [{ url: '/logo.png' }];
};

/** URLs pour la galerie (objets { url, alt }) */
export const getPieceGalleryImages = (piece, alt = '') => {
  return getPieceImages(piece).map((img) => ({
    url: img.url,
    alt: img.alt || alt,
  }));
};

/** Images de la fiche technique : image dédiée + photos de la pièce si besoin */
export const getTechnicalGalleryImages = (piece, alt = '') => {
  const urls = new Set();
  const result = [];

  if (piece.technicalImage?.url) {
    urls.add(piece.technicalImage.url);
    result.push({ url: piece.technicalImage.url, alt });
  }

  getPieceImages(piece).forEach((img) => {
    if (img.url && !urls.has(img.url)) {
      urls.add(img.url);
      result.push({ url: img.url, alt: img.alt || alt });
    }
  });

  return result;
};

export const getSymbolicImageUrls = (piece) => {
  const fromDb = piece.symbolicData?.visualSymbols
    ?.map((s) => s.image?.url)
    .filter(Boolean);
  if (fromDb?.length > 0) return fromDb;

  const nameKey = piece.name?.fr || piece.name;
  return SYMBOLIC_IMAGES_BY_NAME[nameKey] || ['/symbolique/symbol/tlila.jpg'];
};
