import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import Loader from '../../components/Loader';
import toast, { Toaster } from 'react-hot-toast';
import { FiTrash2, FiImage, FiGrid, FiFilter } from 'react-icons/fi';

const CATEGORY_LABELS = {
  gallery: { label: 'Galerie', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  technical: { label: 'Technique', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  symbolic: { label: 'Symbolique', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
};

const MediaAdmin = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const { data } = await adminAPI.getMedia();
      setMedia(data.media);
    } catch {
      toast.error('Erreur de chargement des médias');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Supprimer ce média ? Cette action est irréversible.')) return;
    setDeleting(item._id);
    try {
      await adminAPI.deleteMedia(item.publicId || 'null', {
        type: item.type,
        pieceId: item.linkedPieceId,
        mediaId: item._id,
        category: item.category,
      });
      setMedia(media.filter(m => m._id !== item._id));
      toast.success('Média supprimé');
    } catch {
      toast.error('Erreur de suppression');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <Loader />;

  const filtered = filterCategory ? media.filter(m => m.category === filterCategory) : media;

  return (
    <div className="pb-20">
      <Toaster position="top-right" />

      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-ivory">Médiathèque</h1>
          <p className="text-muted text-sm mt-1">{filtered.length} média(s) trouvé(s)</p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg border transition ${viewMode === 'grid' ? 'border-gold text-gold bg-gold/10' : 'border-gold-dim text-muted hover:border-gold/40'}`}
          >
            <FiGrid />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg border transition ${viewMode === 'list' ? 'border-gold text-gold bg-gold/10' : 'border-gold-dim text-muted hover:border-gold/40'}`}
          >
            <FiFilter />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-dark-2 border border-gold-dim rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center">
        <FiFilter className="text-muted" />
        <span className="text-muted text-sm">Filtrer :</span>
        {['', 'gallery', 'technical', 'symbolic'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              filterCategory === cat
                ? 'bg-gold text-black border-gold font-medium'
                : 'border-gold-dim text-muted hover:border-gold/50 hover:text-ivory'
            }`}
          >
            {cat === '' ? 'Tous' : CATEGORY_LABELS[cat]?.label}
          </button>
        ))}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(item => (
            <div
              key={`${item._id}-${item.category}`}
              className="relative group rounded-xl overflow-hidden border border-gold-dim/30 bg-dark-2 aspect-square"
            >
              {item.url ? (
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-full object-cover transition group-hover:scale-105 duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted">
                  <FiImage className="text-4xl" />
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_LABELS[item.category]?.color}`}>
                  {CATEGORY_LABELS[item.category]?.label}
                </span>
                <p className="text-xs text-ivory text-center truncate w-full px-2">
                  {item.linkedPieceName?.fr || '—'}
                </p>
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deleting === item._id}
                  className="mt-1 p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition disabled:opacity-50"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-muted">
              <FiImage className="text-5xl mx-auto mb-4 opacity-30" />
              <p>Aucun média trouvé.</p>
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <div className="bg-dark-2 border border-gold-dim rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 border-b border-gold-dim">
                <th className="p-4 font-medium text-muted text-sm uppercase">Aperçu</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Fichier</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Catégorie</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Pièce liée</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Date</th>
                <th className="p-4 font-medium text-muted text-sm uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-dim/20">
              {filtered.map(item => (
                <tr key={`${item._id}-${item.category}`} className="hover:bg-black/20 transition">
                  <td className="p-4">
                    {item.url ? (
                      <img src={item.url} alt={item.filename} className="w-12 h-12 object-cover rounded-lg border border-gold-dim/30" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-dark border border-gold-dim/30 flex items-center justify-center text-muted">
                        <FiImage />
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-ivory text-sm font-mono truncate max-w-[150px]">{item.filename}</td>
                  <td className="p-4">
                    <span className={`text-xs px-3 py-1 rounded-full border ${CATEGORY_LABELS[item.category]?.color}`}>
                      {CATEGORY_LABELS[item.category]?.label}
                    </span>
                  </td>
                  <td className="p-4 text-muted text-sm">{item.linkedPieceName?.fr || '—'}</td>
                  <td className="p-4 text-muted text-sm">
                    {new Date(item.uploadDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deleting === item._id}
                      className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-muted">Aucun média trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MediaAdmin;
