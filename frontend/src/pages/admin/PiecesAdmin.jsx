import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { piecesAPI } from '../../api';
import Loader from '../../components/Loader';
import { FiEdit2, FiTrash2, FiPlus, FiCheckCircle, FiXCircle, FiSearch, FiFilter } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const PiecesAdmin = () => {
  const { t } = useTranslation();
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPieces = async () => {
    try {
      const { data } = await piecesAPI.getAll({ limit: 100 });
      setPieces(data.pieces);
    } catch (error) {
      toast.error(t('common.error') || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPieces();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.delete_confirm') || 'Supprimer ?')) {
      try {
        await piecesAPI.delete(id);
        toast.success(t('common.save') || 'Supprimé');
        setPieces(pieces.filter(p => p._id !== id));
      } catch (error) {
        toast.error(t('common.error') || 'Erreur');
      }
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const { data } = await piecesAPI.togglePublish(id);
      toast.success(data.message);
      setPieces(pieces.map(p => p._id === id ? { ...p, isPublished: data.isPublished } : p));
    } catch (error) {
      toast.error(t('common.error') || 'Erreur');
    }
  };

  if (loading) return <Loader />;

  const filteredPieces = pieces.filter(p => {
    if (filterCategory && p.category !== filterCategory) return false;
    if (filterStatus !== '') {
      const isPub = filterStatus === 'published';
      if (p.isPublished !== isPub) return false;
    }
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const nameFr = p.name?.fr?.toLowerCase() || '';
      if (!nameFr.includes(search)) return false;
    }
    return true;
  });

  return (
    <div className="pb-20">
      <Toaster position="top-right" />
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-ivory">{t('admin.pieces') || 'Pièces'}</h1>
        <Link to="/admin/pieces/new" className="bg-gold hover:bg-gold-light text-black flex items-center gap-2 py-2 px-4 rounded-xl font-medium transition">
          <FiPlus /> {t('admin.new_piece') || 'Nouvelle pièce'}
        </Link>
      </div>

      {/* FILTERS */}
      <div className="bg-dark-2 border border-gold-dim rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-gold-dim rounded-xl py-2 pl-10 pr-4 text-ivory focus:border-gold outline-none transition"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-black border border-gold-dim rounded-xl py-2 px-4 text-ivory focus:border-gold outline-none transition appearance-none cursor-pointer"
          >
            <option value="">Toutes les catégories</option>
            <option value="bijoux-tempe">Bijoux de tempe</option>
            <option value="colliers">Colliers</option>
            <option value="bracelets">Bracelets</option>
            <option value="anneaux-cheville">Anneaux de cheville</option>
            <option value="autre">Autre</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-black border border-gold-dim rounded-xl py-2 px-4 text-ivory focus:border-gold outline-none transition appearance-none cursor-pointer"
          >
            <option value="">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
          </select>
        </div>
      </div>

      <div className="bg-dark-2 border border-gold-dim rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-black/50 border-b border-gold-dim">
                <th className="p-4 font-medium text-muted text-sm uppercase">Miniature</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Nom (fr)</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Catégorie</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Statut</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Date</th>
                <th className="p-4 font-medium text-muted text-sm uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-dim/20">
              {filteredPieces.map((piece) => (
                <tr key={piece._id} className="hover:bg-black/20 transition">
                  <td className="p-4">
                    <img src={piece.thumbnailUrl || piece.images?.[0]?.url || '/logo.png'} alt="thumbnail" className="w-12 h-12 rounded object-cover border border-gold-dim/30" />
                  </td>
                  <td className="p-4 font-serif text-ivory">{piece.name?.fr || 'Sans nom'}</td>
                  <td className="p-4 text-muted capitalize">{piece.category?.replace('-', ' ') || 'Autre'}</td>
                  <td className="p-4">
                    <button onClick={() => handleTogglePublish(piece._id)} className="flex items-center gap-2">
                      {piece.isPublished ? (
                        <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/20 flex items-center gap-1"><FiCheckCircle /> Publié</span>
                      ) : (
                        <span className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-xs font-medium border border-orange-500/20 flex items-center gap-1"><FiXCircle /> Brouillon</span>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-muted text-sm">{new Date(piece.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="p-4 flex justify-end gap-2">
                    <Link to={`/admin/pieces/${piece._id}/edit`} className="p-2 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition" title="Éditer">
                      <FiEdit2 />
                    </Link>
                    <button onClick={() => handleDelete(piece._id)} className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition" title="Supprimer">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPieces.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-muted">Aucune pièce trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PiecesAdmin;
