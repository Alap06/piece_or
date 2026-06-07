import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { piecesAPI } from '../api';
import Loader from '../components/Loader';
import { useLanguage } from '../contexts/LanguageContext';
import PieceImageGallery from '../components/PieceImageGallery';
import PieceStaticImages from '../components/PieceStaticImages';
import {
  getLocalized,
  getPieceGalleryImages,
  getSymbolicImageUrls,
} from '../utils/pieceDisplay';

const VALID_SECTIONS = ['historique', 'description', 'technique', 'symbolique'];

const SECTION_NAV = [
  { path: 'historique', labelKey: 'pieces.section_historical' },
  { path: 'technique', labelKey: 'pieces.section_technical' },
  { path: 'symbolique', labelKey: 'pieces.section_symbolic' },
];

const PieceSectionPage = () => {
  const { id, section } = useParams();
  const { t } = useTranslation();
  const { lang, dir } = useLanguage();
  const [piece, setPiece] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPiece = async () => {
      setLoading(true);
      try {
        const { data } = await piecesAPI.getById(id);
        setPiece(data.piece);
      } catch (error) {
        console.error(error);
        setPiece(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPiece();
    window.scrollTo(0, 0);
  }, [id]);

  if (section === 'description') {
    return <Navigate to={`/pieces/${id}/historique`} replace />;
  }

  if (!VALID_SECTIONS.includes(section)) {
    return <Navigate to={`/pieces/${id}/historique`} replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark pt-32">
        <Loader />
      </div>
    );
  }

  if (!piece) {
    return (
      <div className="min-h-screen bg-dark text-ivory flex flex-col items-center justify-center gap-6 px-6">
        <p className="text-xl font-serif text-muted">{t('pieces.not_found')}</p>
        <Link to="/pieces" className="btn-outline-gold">
          {t('piece_detail.back')}
        </Link>
      </div>
    );
  }

  const name = getLocalized(piece.name, lang);
  const galleryImages = getPieceGalleryImages(piece, name);
  const technicalSheetImages = piece.technicalImage?.url
    ? [{ url: piece.technicalImage.url, alt: name }]
    : [];
  const symbolicUrls = getSymbolicImageUrls(piece);
  const historicalData = piece.historicalData || [];
  const technicalData = piece.technicalData || [];

  const renderContent = () => {
    if (section === 'historique') {
      const description = getLocalized(piece.description, lang);
      return (
        <>
          <header className="text-center mb-12">
            <p className="uppercase tracking-[0.4em] text-gold text-sm mb-4">
              {t('pieces.section_historical')}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-gold-light">{name}</h1>
            <div className="w-24 h-px bg-gold/50 mx-auto mt-6" />
          </header>

          <PieceImageGallery images={galleryImages} alt={name} />

          <div className="mt-12">
            <h2 className="text-2xl font-serif text-gold-light text-center mb-8">
              {t('pieces.historical_sheet_content')}
            </h2>

            {description ? (
              <p className="text-ivory/90 text-lg leading-relaxed max-w-3xl mx-auto text-center mb-12 font-serif italic">
                {description}
              </p>
            ) : null}

            {historicalData.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {historicalData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="rounded-2xl border border-gold-dim/30 bg-white/[0.03] p-8 hover:border-gold/40 transition"
                  >
                    <h3 className="text-gold text-xl font-serif mb-4">
                      {getLocalized(item.label, lang)}
                    </h3>
                    <div className="w-12 h-px bg-gold/30 mb-4" />
                    <p className="text-ivory/85 leading-relaxed">{getLocalized(item.value, lang)}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              !description && (
                <p className="text-muted italic text-center">{t('pieces.no_historical')}</p>
              )
            )}
          </div>
        </>
      );
    }

    if (section === 'technique') {
      return (
        <>
          <header className="text-center mb-12">
            <p className="uppercase tracking-[0.4em] text-gold text-sm mb-4">
              {t('pieces.section_technical')}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-gold-light">{name}</h1>
            <div className="w-24 h-px bg-gold/50 mx-auto mt-6" />
          </header>

          {technicalSheetImages.length > 0 ? (
            <PieceImageGallery images={technicalSheetImages} alt={name} />
          ) : (
            !technicalData.length && (
              <p className="text-muted italic text-center mb-12">{t('pieces.no_technical')}</p>
            )
          )}

          {technicalData.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
              {technicalData.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gold-dim/30 bg-white/[0.03] p-8"
                >
                  <h3 className="text-gold text-lg font-serif mb-3">
                    {getLocalized(item.label, lang)}
                  </h3>
                  <p className="text-ivory/85 leading-relaxed">{getLocalized(item.value, lang)}</p>
                </div>
              ))}
            </div>
          )}
        </>
      );
    }

    return (
      <>
        <header className="text-center mb-12">
          <p className="uppercase tracking-[0.4em] text-gold text-sm mb-4">
            {t('pieces.section_symbolic')}
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-gold-light">{name}</h1>
          <div className="w-24 h-px bg-gold/50 mx-auto mt-6" />
        </header>

        <PieceImageGallery images={galleryImages} alt={name} />

        {piece.symbolicData?.greimas?.length > 0 && (
          <div className="max-w-5xl mx-auto mb-12 overflow-x-auto">
            <table className="w-full text-sm border border-gold-dim/30 rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-gold/10 text-gold">
                  <th className="p-4 text-left font-medium">{t('pieces.symbolic_level')}</th>
                  <th className="p-4 text-left font-medium">{t('pieces.symbolic_element')}</th>
                  <th className="p-4 text-left font-medium">{t('pieces.symbolic_meaning')}</th>
                </tr>
              </thead>
              <tbody>
                {piece.symbolicData.greimas.map((row, index) => (
                  <tr key={index} className="border-t border-gold-dim/20 text-ivory/85">
                    <td className="p-4 capitalize">{row.level}</td>
                    <td className="p-4">{getLocalized(row.element, lang)}</td>
                    <td className="p-4">{getLocalized(row.signification, lang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {symbolicUrls.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-serif text-gold-light text-center mb-8">
              {t('pieces.symbolic_sheet_images')}
            </h2>
            <PieceStaticImages
              urls={symbolicUrls}
              alt={`${name} — ${t('pieces.section_symbolic')}`}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <main className="min-h-screen bg-dark text-ivory">
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(circle_at_center,#D4AF37_0%,transparent_70%)]" />

      <div className="border-b border-gold-dim/20 bg-dark/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/pieces"
            className="inline-flex items-center gap-3 text-muted hover:text-gold transition group"
          >
            {dir === 'rtl' ? (
              <FiArrowRight className="group-hover:translate-x-0.5 transition" />
            ) : (
              <FiArrowLeft className="group-hover:-translate-x-0.5 transition" />
            )}
            <span className="uppercase tracking-[0.2em] text-xs">{t('piece_detail.back')}</span>
          </Link>

          <nav className="flex flex-wrap gap-2 justify-center sm:justify-end">
            {SECTION_NAV.map(({ path, labelKey }) => (
              <Link
                key={path}
                to={`/pieces/${id}/${path}`}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition ${
                  section === path
                    ? 'bg-gold text-black font-semibold'
                    : 'border border-gold-dim/50 text-gold-light hover:border-gold hover:bg-gold/10'
                }`}
              >
                {t(labelKey)}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 pb-32">{renderContent()}</section>
    </main>
  );
};

export default PieceSectionPage;
