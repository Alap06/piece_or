import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalized, getPieceImages } from '../utils/pieceDisplay';

const SECTION_LINKS = [
  { path: 'historique', labelKey: 'pieces.section_historical' },
  { path: 'technique', labelKey: 'pieces.section_technical' },
  { path: 'symbolique', labelKey: 'pieces.section_symbolic' },
];

const PieceListItem = ({ piece }) => {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  const name = getLocalized(piece.name, lang);
  const mainImage = piece.thumbnailUrl || getPieceImages(piece)[0]?.url || '/logo.png';

  return (
    <article className="piece-list-item border border-gold-dim/40 rounded-3xl overflow-hidden bg-dark-2/50">
      <div className="flex flex-col items-center px-6 pt-10 pb-6 bg-gradient-to-b from-black/40 to-transparent">
        <div className="w-full max-w-md rounded-2xl overflow-hidden border border-gold-dim/50 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
          <img
            src={mainImage}
            alt={name}
            className="w-full h-auto max-h-[420px] object-contain bg-black/30"
            loading="lazy"
          />
        </div>
        <h2 className="mt-8 text-3xl md:text-4xl font-serif text-gold-light text-center tracking-wide">
          {name}
        </h2>
        {(piece.period?.[lang] || piece.period?.fr) && (
          <p className="mt-2 text-muted text-sm uppercase tracking-[0.25em]">
            {getLocalized(piece.period, lang)}
          </p>
        )}
      </div>

      <div className="px-6 md:px-10 pb-10 flex flex-col gap-4 max-w-lg mx-auto w-full">
        {SECTION_LINKS.map(({ path, labelKey }) => (
          <Link
            key={path}
            to={`/pieces/${piece._id}/${path}`}
            className="btn-outline-gold w-full text-center py-4 text-sm md:text-base uppercase tracking-[0.2em] font-medium transition-all hover:scale-[1.02]"
          >
            {t(labelKey)}
          </Link>
        ))}
      </div>
    </article>
  );
};

export default PieceListItem;
