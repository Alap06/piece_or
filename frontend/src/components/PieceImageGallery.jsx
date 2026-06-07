import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Galerie principale : image active + miniatures + flèches.
 * @param {Array<{ url: string, alt?: string }>} images
 */
const PieceImageGallery = ({ images, alt = '', className = '' }) => {
  const { dir } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  if (!images?.length) return null;

  const safeIndex = Math.min(selectedIndex, images.length - 1);
  const current = images[safeIndex];

  const goPrev = () => {
    setSelectedIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const goNext = () => {
    setSelectedIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  const PrevIcon = dir === 'rtl' ? FiChevronRight : FiChevronLeft;
  const NextIcon = dir === 'rtl' ? FiChevronLeft : FiChevronRight;

  return (
    <div className={`max-w-4xl mx-auto mb-16 ${className}`}>
      <div className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-br from-gold/15 to-transparent rounded-3xl blur-xl opacity-60 pointer-events-none" />
        <div className="relative rounded-3xl overflow-hidden border border-gold-dim/40 bg-black/40 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
          <img
            src={current.url}
            alt={current.alt || alt}
            className="w-full h-auto max-h-[min(70vh,640px)] object-contain mx-auto"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/75 backdrop-blur border border-gold-dim/50 flex items-center justify-center text-ivory hover:bg-gold hover:text-black transition z-10"
              >
                <PrevIcon size={24} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/75 backdrop-blur border border-gold-dim/50 flex items-center justify-center text-ivory hover:bg-gold hover:text-black transition z-10"
              >
                <NextIcon size={24} />
              </button>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 text-gold text-xs tracking-widest border border-gold-dim/30">
                {safeIndex + 1} / {images.length}
              </span>
            </>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 mt-4">
          {images.map((img, index) => (
            <button
              key={img.url + index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`overflow-hidden rounded-xl border-2 transition aspect-square ${
                safeIndex === index
                  ? 'border-gold ring-2 ring-gold/30'
                  : 'border-gold-dim/25 opacity-70 hover:opacity-100 hover:border-gold-dim/60'
              }`}
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PieceImageGallery;
