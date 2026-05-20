import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { piecesAPI } from '../../api';
import Loader from '../../components/Loader';
import { FiEdit2, FiTrash2, FiPlus, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const PiecesAdmin = () => {
  const { t } = useTranslation();
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPieces = async () => {
    try {
      const { data } = await piecesAPI.getAll({ limit: 100 });
      setPieces(data.pieces);
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPieces();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.delete_confirm'))) {
      try {
        await piecesAPI.delete(id);
        toast.success(t('common.save'));
        setPieces(pieces.filter(p => p._id !== id));
      } catch (error) {
        toast.error(t('common.error'));
      }
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const { data } = await piecesAPI.togglePublish(id);
      toast.success(data.message);
      setPieces(pieces.map(p => p._id === id ? { ...p, isPublished: data.isPublished } : p));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-ivory">{t('admin.pieces')}</h1>
        <Link to="/admin/pieces/new" className="btn-gold flex items-center gap-2 py-2 px-4 text-sm">
          <FiPlus /> {t('admin.new_piece')}
        </Link>
      </div>

      <div className="bg-dark-2 border border-gold-dim rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/50 border-b border-gold-dim">
              <th className="p-4 font-semibold text-muted text-sm uppercase">Image</th>
              <th className="p-4 font-semibold text-muted text-sm uppercase">Nom</th>
              <th className="p-4 font-semibold text-muted text-sm uppercase">Statut</th>
              <th className="p-4 font-semibold text-muted text-sm uppercase">Ordre</th>
              <th className="p-4 font-semibold text-muted text-sm uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pieces.map((piece) => (
              <tr key={piece._id} className="border-b border-gold-dim/50 hover:bg-black/30 transition">
                <td className="p-4">
                  <img src={piece.thumbnailUrl || piece.images?.[0]?.url || '/logo.png'} alt="thumbnail" className="w-12 h-12 rounded object-cover border border-gold-dim" />
                </td>
                <td className="p-4 font-serif text-ivory">{piece.name?.fr}</td>
                <td className="p-4">
                  <button onClick={() => handleTogglePublish(piece._id)} className="flex items-center gap-2">
                    {piece.isPublished ? <FiCheckCircle className="text-green-400" /> : <FiXCircle className="text-muted" />}
                    <span className={piece.isPublished ? 'text-green-400' : 'text-muted'}>
                      {piece.isPublished ? t('admin.published') : t('admin.drafts')}
                    </span>
                  </button>
                </td>
                <td className="p-4 text-ivory">{piece.order}</td>
                <td className="p-4 flex justify-end gap-3">
                  <Link to={`/admin/pieces/${piece._id}/edit`} className="p-2 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition">
                    <FiEdit2 />
                  </Link>
                  <button onClick={() => handleDelete(piece._id)} className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
            {pieces.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-muted">Aucune pièce trouvée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PiecesAdmin;
