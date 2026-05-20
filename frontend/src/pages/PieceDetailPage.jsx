import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { piecesAPI } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import Loader from '../components/Loader';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Swiper for gallery
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Image zoom
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const PieceDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { lang, dir } = useLanguage();
  const [piece, setPiece] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('historical');

  useEffect(() => {
    const fetchPiece = async () => {
      try {
        const { data } = await piecesAPI.getById(id);
        setPiece(data.piece);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPiece();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="min-h-screen bg-dark pt-32"><Loader /></div>;
  if (!piece) return <div className="min-h-screen bg-dark text-center pt-32 text-ivory">Pièce introuvable</div>;

  const images = piece.images?.length > 0 ? piece.images : [{ url: piece.thumbnailUrl || '/logo.png' }];

  return (
    <div className="bg-dark min-h-screen pb-20">
      
      {/* Top Bar Navigation */}
      <div className="border-b border-gold-dim">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link to="/pieces" className="inline-flex items-center gap-3 text-muted hover:text-gold transition group">
            {dir === 'rtl' ? <FiArrowRight className="group-hover:-translate-x-1 transition" /> : <FiArrowLeft className="group-hover:-translate-x-1 transition" />}
            <span className="uppercase tracking-[2px] text-xs font-semibold">{t('piece_detail.back')}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left: Gallery */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative">
          <div className="card-premium p-2 bg-[#050a10]">
            <Swiper
              modules={[Navigation, Pagination, EffectFade]}
              effect="fade"
              navigation
              pagination={{ clickable: true }}
              className="rounded-[20px] overflow-hidden aspect-[4/5] w-full"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <Zoom zoomMargin={40}>
                    <img
                      src={img.url}
                      alt={piece.name?.[lang] || 'Piece'}
                      className="w-full h-full object-cover"
                    />
                  </Zoom>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>

        {/* Right: Info */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
          
          <h1 className="text-4xl md:text-5xl font-serif text-gold-light mb-4 leading-tight">
            {piece.name?.[lang] || piece.name?.fr}
          </h1>
          
          <p className="text-xl text-muted font-serif italic mb-10">
            {piece.period?.[lang] || piece.period?.fr}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-6 mb-12 py-8 border-y border-gold-dim/50">
            <div>
              <p className="text-muted text-xs uppercase tracking-[2px] mb-2">{t('piece_detail.origin')}</p>
              <p className="text-ivory font-medium">{piece.origin?.[lang] || piece.origin?.fr || '—'}</p>
            </div>
            <div>
              <p className="text-muted text-xs uppercase tracking-[2px] mb-2">{t('piece_detail.material')}</p>
              <p className="text-ivory font-medium">{piece.material || '—'}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex gap-8 border-b border-gold-dim">
              {[
                { id: 'historical', label: t('piece_detail.tab_historical') },
                { id: 'technical', label: t('piece_detail.tab_technical') },
                { id: 'symbolic', label: t('piece_detail.tab_symbolic') }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 text-sm uppercase tracking-[2px] font-semibold transition relative ${
                    activeTab === tab.id ? 'text-gold' : 'text-muted hover:text-ivory'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
                  )}
                </button>
              ))}
            </div>

            <div className="py-8 min-h-[150px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-beige leading-relaxed text-lg font-light"
                >
                  {activeTab === 'historical' && (piece.description?.[lang] || piece.description?.fr)}
                  {activeTab === 'technical' && (piece.material ? `Fabriqué en ${piece.material}.` : 'Aucune donnée technique.')}
                  {activeTab === 'symbolic' && (piece.symbol?.[lang] || piece.symbol?.fr || 'Aucune signification symbolique renseignée.')}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sub-Pieces Section */}
      {piece.subPieces && piece.subPieces.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-20">
          <div className="border-t border-gold-dim pt-20 text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gold-light mb-4">Anatomie de la Pièce</h2>
            <p className="text-muted font-serif italic text-lg">Découvrez cette pièce dans ses moindres détails</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {piece.subPieces.map((sp, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#050a10] border border-gold-dim rounded-2xl overflow-hidden group hover:border-gold transition-colors duration-500"
              >
                {sp.image?.url && (
                  <div className="h-64 overflow-hidden relative border-b border-gold-dim">
                    <Zoom zoomMargin={40}>
                      <img src={sp.image.url} alt={sp.name?.[lang]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </Zoom>
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-serif text-gold-light mb-3">{sp.name?.[lang] || sp.name?.fr}</h3>
                  {sp.material && (
                    <span className="inline-block px-3 py-1 bg-dark-2 border border-gold-dim text-muted text-xs uppercase tracking-wider rounded-full mb-4">
                      {sp.material}
                    </span>
                  )}
                  <p className="text-beige text-sm leading-relaxed">
                    {sp.description?.[lang] || sp.description?.fr}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Extracted from framer-motion imports above
import { AnimatePresence } from 'framer-motion';

export default PieceDetailPage;
