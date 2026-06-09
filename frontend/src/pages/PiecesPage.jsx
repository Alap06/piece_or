import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { piecesAPI } from '../api';
import PieceListItem from '../components/PieceListItem';
import Loader from '../components/Loader';
import { FiSearch, FiChevronLeft, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { PIECE_CATEGORIES } from '../constants/pieceCategories';

const PiecesPage = () => {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPieces = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, search, published: true };
      if (category) params.category = category;
      const { data } = await piecesAPI.getAll(params);
      setPieces(Array.isArray(data?.pieces) ? data.pieces : []);
      setTotalPages(Number(data?.pagination?.pages) || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPieces();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, page, category]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  return (
    <div className="bg-dark min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-gold-dim pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-gold-light mb-4">{t('pieces.title')}</h1>
            <p className="text-muted text-lg">{t('pieces.subtitle')}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto md:min-w-[32rem]">
            {/* Catégorie — une seule liste déroulante, « Tous » par défaut */}
            <div className="relative flex-1 sm:max-w-xs">
              <label htmlFor="piece-category" className="sr-only">
                {t('pieces.category_label')}
              </label>
              <select
                id="piece-category"
                value={category}
                onChange={handleCategoryChange}
                className={`w-full appearance-none bg-dark-2 border border-gold-dim rounded-full py-3 text-ivory text-sm tracking-wide cursor-pointer focus:outline-none focus:border-gold transition hover:border-gold/60 ${
                  dir === 'rtl' ? 'pl-10 pr-5' : 'pl-5 pr-10'
                }`}
              >
                <option value="">{t('pieces.filter_all')}</option>
                {PIECE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {t(cat.labelKey)}
                  </option>
                ))}
              </select>
              <FiChevronDown
                className={`absolute top-1/2 -translate-y-1/2 text-gold pointer-events-none ${
                  dir === 'rtl' ? 'left-4' : 'right-4'
                }`}
                size={18}
              />
            </div>

            {/* Recherche */}
            <div className="relative flex-1 sm:max-w-sm">
              <div
                className={`absolute inset-y-0 ${
                  dir === 'rtl' ? 'right-0 pr-4' : 'left-0 pl-4'
                } flex items-center pointer-events-none`}
              >
                <FiSearch className="text-gold-dark" size={20} />
              </div>
              <input
                type="text"
                placeholder={t('pieces.search_placeholder')}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className={`w-full bg-dark-2 border border-gold-dim rounded-full py-3 text-ivory placeholder-muted focus:outline-none focus:border-gold transition ${
                  dir === 'rtl' ? 'pr-12 pl-6' : 'pl-12 pr-6'
                }`}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : pieces.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-muted font-serif">{t('pieces.no_results')}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-16 max-w-4xl mx-auto">
              {pieces.map((piece) => (
                <PieceListItem key={piece._id} piece={piece} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-20">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="w-12 h-12 rounded-full border border-gold-dim flex items-center justify-center text-gold hover:bg-gold hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold transition"
                >
                  {dir === 'rtl' ? <FiChevronRight size={24} /> : <FiChevronLeft size={24} />}
                </button>

                <span className="text-muted tracking-widest">
                  {page} / {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
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
