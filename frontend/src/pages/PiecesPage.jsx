import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { piecesAPI } from '../api';
import PieceCard from '../components/PieceCard';
import Loader from '../components/Loader';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';

const PiecesPage = () => {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPieces = async () => {
    setLoading(true);
    try {
      const { data } = await piecesAPI.getAll({ page, limit: 12, search, published: true });
      setPieces(data.pieces);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPieces();
    }, 500); // debounce search
    return () => clearTimeout(timer);
  }, [search, page]);

  return (
    <div className="bg-dark min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-gold-dim pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-gold-light mb-4">{t('pieces.title')}</h1>
            <p className="text-muted text-lg">{t('pieces.subtitle')}</p>
          </div>

          <div className="relative w-full md:w-96">
            <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
              <FiSearch className="text-gold-dark" size={20} />
            </div>
            <input
              type="text"
              placeholder={t('pieces.search_placeholder')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className={`w-full bg-dark-2 border border-gold-dim rounded-full py-3 ${dir === 'rtl' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-ivory placeholder-muted focus:outline-none focus:border-gold transition`}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <Loader />
        ) : pieces.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-muted font-serif">{t('pieces.no_results')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {pieces.map((piece) => (
                <PieceCard key={piece._id} piece={piece} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-20">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="w-12 h-12 rounded-full border border-gold-dim flex items-center justify-center text-gold hover:bg-gold hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold transition"
                >
                  {dir === 'rtl' ? <FiChevronRight size={24} /> : <FiChevronLeft size={24} />}
                </button>
                
                <span className="text-muted tracking-widest">
                  {page} / {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="w-12 h-12 rounded-full border border-gold-dim flex items-center justify-center text-gold hover:bg-gold hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold transition"
                >
                  {dir === 'rtl' ? <FiChevronLeft size={24} /> : <FiChevronRight size={24} />}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PiecesPage;
