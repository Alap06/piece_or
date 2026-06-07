import React from 'react';

/** Grille d'images fixes (fiche technique dédiée, fiches symboliques, etc.) */
const PieceStaticImages = ({ urls, alt, title }) => {
  if (!urls?.length) return null;

  return (
    <div className={urls.length > 1 ? 'grid md:grid-cols-2 gap-6 max-w-5xl mx-auto' : 'max-w-4xl mx-auto'}>
      {urls.map((src, idx) => (
        <div
          key={src + idx}
          className="rounded-3xl overflow-hidden border border-gold-dim/30 bg-[#111] p-4 shadow-[0_0_40px_rgba(0,0,0,0.4)]"
        >
          {title && idx === 0 && urls.length === 1 && (
            <p className="text-gold/70 text-xs uppercase tracking-[0.3em] mb-4 text-center">{title}</p>
          )}
          <img src={src} alt={`${alt} ${idx + 1}`} className="w-full h-auto object-contain rounded-2xl" />
        </div>
      ))}
    </div>
  );
};

export default PieceStaticImages;
