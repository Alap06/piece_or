const https = require('https');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const translateText = (text, targetLang) =>
  new Promise((resolve) => {
    if (!text || !text.trim()) {
      resolve('');
      return;
    }

    const langpair = targetLang === 'ar' ? 'fr|ar' : 'fr|en';
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;

    https
      .get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            const translated = parsed?.responseData?.translatedText;
            if (translated && translated !== text) {
              resolve(translated);
            } else {
              resolve(text);
            }
          } catch {
            resolve(text);
          }
        });
      })
      .on('error', () => resolve(text));
  });

const fillI18nField = async (field) => {
  if (!field || typeof field !== 'object') return field;
  const fr = field.fr || '';
  if (!fr.trim()) return field;

  const en = field.en?.trim() ? field.en : await translateText(fr, 'en');
  await delay(350);
  const ar = field.ar?.trim() ? field.ar : await translateText(fr, 'ar');
  await delay(350);

  return { fr, en, ar };
};

const fillI18nArray = async (items) => {
  if (!Array.isArray(items)) return items;
  const result = [];
  for (const item of items) {
    result.push({
      ...item,
      label: await fillI18nField(item.label),
      value: await fillI18nField(item.value),
      name: item.name ? await fillI18nField(item.name) : item.name,
      description: item.description ? await fillI18nField(item.description) : item.description,
    });
  }
  return result;
};

const fillPieceTranslations = async (piece) => {
  const updated = { ...piece };

  updated.name = await fillI18nField(piece.name);
  updated.origin = await fillI18nField(piece.origin);
  updated.period = await fillI18nField(piece.period);
  updated.description = await fillI18nField(piece.description);
  updated.symbol = await fillI18nField(piece.symbol);
  updated.historicalData = await fillI18nArray(piece.historicalData);
  updated.technicalData = await fillI18nArray(piece.technicalData);
  updated.subPieces = await fillI18nArray(piece.subPieces);

  return updated;
};

module.exports = { translateText, fillI18nField, fillPieceTranslations };
