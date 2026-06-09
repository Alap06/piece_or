import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

const PieceCard = ({ piece }) => {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  const name = piece.name?.[lang] || piece.name?.fr || '';
  const image = piece.thumbnailUrl || (piece.images?.[0]?.url) || '/logo.png';

  return (
    <Link
      to={`/pieces/${piece._id}/historique`}
      className="group card-premium overflow-hidden flex flex-col relative"
    >
      <div className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-500 z-10" />
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
      </div>

      <div className="absolute bottom-0 w-full p-6 z-20 transform translate-y-4 group-hover:translate-y-0 transition duration-500">
        <h3 className="text-2xl font-serif text-gold-light mb-2 drop-shadow-md">
          {name}
        </h3>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <span className="w-8 h-[1px] bg-gold" />
          <span className="text-gold text-sm tracking-wider uppercase font-medium">
            {t('home.discover')}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PieceCard;
