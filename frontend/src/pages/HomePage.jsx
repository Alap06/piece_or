import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { piecesAPI } from '../api';
import PieceCard from '../components/PieceCard';
import Loader from '../components/Loader';
import SiteLogo from '../components/SiteLogo';

const HomePage = () => {
  const { t } = useTranslation();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await piecesAPI.getAll({ limit: 3, published: true });
        setFeatured(Array.isArray(data?.pieces) ? data.pieces : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-dark">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10 flex flex-col items-center"
        >
          <SiteLogo variant="hero" />

          <h1 className="text-5xl md:text-7xl font-serif text-gold-light mb-6 tracking-wide drop-shadow-lg">
            {t('home.title')}
          </h1>

          <p className="text-xl md:text-2xl italic text-muted mb-12 font-serif">
            {t('home.tagline')}
          </p>

          <Link to="/pieces" className="btn-gold text-lg px-10 py-4 uppercase tracking-[2px]">
            {t('home.cta')}
          </Link>
        </motion.div>
      </section>

      {/* Intro Section */}
      <section className="py-24 px-6 bg-dark-2 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-dim to-transparent" />
        <div className="max-w-4xl mx-auto text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-ivory leading-loose text-xl md:text-2xl font-serif"
          >
            "{t('home.intro')}"
          </motion.p>
        </div>
      </section>

      {/* Featured Pieces */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-gold-light mb-4 drop-shadow-sm">
              {t('home.featured_title')}
            </h2>
            <p className="text-beige text-lg">{t('home.featured_desc')}</p>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featured.map((piece, i) => (
                <motion.div
                  key={piece._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                >
                  <PieceCard piece={piece} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-20">
            <Link to="/pieces" className="btn-outline-gold text-lg px-8 py-3">
              {t('home.view_all')}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#0a111a] border-y border-gold-dim relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {[
            { value: '300+', label: t('home.stats.years') },
            { value: '50+', label: t('home.stats.pieces') },
            { value: 'Or 24k', label: t('home.stats.materials') },
            { value: '10K+', label: t('home.stats.visitors') },
          ].map((stat, idx) => (
            <div key={idx} className="p-6">
              <div className="text-4xl md:text-5xl font-serif text-gold-light mb-2 glow-gold-sm">{stat.value}</div>
              <div className="text-muted text-sm uppercase tracking-[2px]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
