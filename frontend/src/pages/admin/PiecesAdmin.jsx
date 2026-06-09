import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { piecesAPI } from '../../api';
import Loader from '../../components/Loader';
import { FiEdit2, FiTrash2, FiPlus, FiCheckCircle, FiXCircle, FiSearch, FiMenu } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { PIECE_CATEGORIES } from '../../constants/pieceCategories';

const CATEGORY_LABELS = {
  'bijoux-tempe': 'Bijoux de tempe',
  colliers: 'Colliers et parures',
  bracelets: 'Bracelets',
  'anneaux-cheville': 'Anneaux de cheville',
  autre: 'Autre',
};

const PiecesAdmin = () => {
  const { t } = useTranslation();
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPieces = async () => {
    try {
      const { data } = await piecesAPI.getAll({ limit: 100 });
      setPieces(Array.isArray(data?.pieces) ? data.pieces : []);
    } catch {
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
        setPieces(pieces.filter((p) => p._id !== id));
      } catch {
        toast.error(t('common.error') || 'Erreur');
      }
    }
  };

  const handleTranslateAll = async () => {
    if (!window.confirm('Générer les traductions EN et AR depuis le français pour toutes les pièces ?')) return;
    const toastId = toast.loading('Traduction de toutes les pièces…');
    try {
      const { data } = await piecesAPI.autoTranslateAll();
      toast.success(data.message || 'Traductions terminées', { id: toastId });
      fetchPieces();
    } catch {
      toast.error('Erreur de traduction', { id: toastId });
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const { data } = await piecesAPI.togglePublish(id);
      toast.success(data.message);
      setPieces(pieces.map((p) => (p._id === id ? { ...p, isPublished: data.isPublished } : p)));
    } catch {
      toast.error(t('common.error') || 'Erreur');
    }
  };

  const filteredPieces = useMemo(() => pieces.filter((p) => {
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
  }), [pieces, filterCategory, filterStatus, searchTerm]);

  const sortedPieces = useMemo(
    () => [...filteredPieces].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [filteredPieces]
  );

  const canReorder = !filterCategory && !filterStatus && !searchTerm;

  const handleDragEnd = async (result) => {
    if (!result.destination || !canReorder) return;

    const items = Array.from(sortedPieces);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    const updates = items.map((p, index) => ({ id: p._id, order: index }));
    const orderMap = Object.fromEntries(updates.map((u) => [u.id, u.order]));

    setPieces((prev) =>
      prev.map((p) => (orderMap[p._id] !== undefined ? { ...p, order: orderMap[p._id] } : p))
    );

    setReordering(true);
    try {
      await piecesAPI.reorder(updates);
      toast.success('Ordre d\'affichage mis à jour');
    } catch {
      toast.error('Erreur lors du réordonnancement');
      fetchPieces();
    } finally {
      setReordering(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="pb-20">
      <Toaster position="top-right" />
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-ivory">{t('admin.pieces') || 'Pièces'}</h1>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleTranslateAll}
            className="btn-outline-gold px-4 py-2 text-sm"
          >
            Traduire toutes (FR → EN/AR)
          </button>
          <Link to="/admin/pieces/new" className="bg-gold hover:bg-gold-light text-black flex items-center gap-2 py-2 px-4 rounded-xl font-medium transition">
            <FiPlus /> {t('admin.new_piece') || 'Nouvelle pièce'}
          </Link>
        </div>
      </div>

      <div className="bg-dark-2 border border-gold-dim rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-50">
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
            {PIECE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{t(cat.labelKey)}</option>
            ))}
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

      {canReorder ? (
        <p className="text-muted text-sm mb-4 flex items-center gap-2">
          <FiMenu className="text-gold" />
          Glissez les lignes pour modifier l&apos;ordre d&apos;affichage sur le site
          {reordering && <span className="text-gold"> — enregistrement…</span>}
        </p>
      ) : (
        <p className="text-muted text-sm mb-4">
          Réordonnancement désactivé pendant une recherche ou un filtre actif.
        </p>
      )}

      <div className="bg-dark-2 border border-gold-dim rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <DragDropContext onDragEnd={handleDragEnd}>
            <table className="w-full text-left border-collapse min-w-200">
              <thead>
                <tr className="bg-black/50 border-b border-gold-dim">
                  {canReorder && <th className="p-4 w-10" />}
                  <th className="p-4 font-medium text-muted text-sm uppercase">Miniature</th>
                  <th className="p-4 font-medium text-muted text-sm uppercase">Nom (fr)</th>
                  <th className="p-4 font-medium text-muted text-sm uppercase">Catégorie</th>
                  <th className="p-4 font-medium text-muted text-sm uppercase">Ordre</th>
                  <th className="p-4 font-medium text-muted text-sm uppercase">Statut</th>
                  <th className="p-4 font-medium text-muted text-sm uppercase">Date</th>
                  <th className="p-4 font-medium text-muted text-sm uppercase text-right">Actions</th>
                </tr>
              </thead>
              <Droppable droppableId="pieces-admin" isDropDisabled={!canReorder}>
                {(provided) => (
                  <tbody
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="divide-y divide-gold-dim/20"
                  >
                    {sortedPieces.map((piece, index) => (
                      <Draggable
                        key={piece._id}
                        draggableId={piece._id}
                        index={index}
                        isDragDisabled={!canReorder}
                      >
                        {(dragProvided, snapshot) => (
                          <tr
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            className={`hover:bg-black/20 transition ${snapshot.isDragging ? 'bg-black/40 shadow-lg' : ''}`}
                          >
                            {canReorder && (
                              <td className="p-4 text-muted" {...dragProvided.dragHandleProps}>
                                <FiMenu className="cursor-grab active:cursor-grabbing text-gold" size={18} />
                              </td>
                            )}
                            <td className="p-4">
                              <img
                                src={piece.thumbnailUrl || piece.images?.[0]?.url || '/logo.png'}
                                alt="thumbnail"
                                className="w-12 h-12 rounded object-cover border border-gold-dim/30"
                              />
                            </td>
                            <td className="p-4 font-serif text-ivory">{piece.name?.fr || 'Sans nom'}</td>
                            <td className="p-4 text-muted">
                              {CATEGORY_LABELS[piece.category] || piece.category?.replace('-', ' ') || 'Autre'}
                            </td>
                            <td className="p-4 text-muted text-sm">{piece.order ?? 0}</td>
                            <td className="p-4">
                              <button onClick={() => handleTogglePublish(piece._id)} className="flex items-center gap-2">
                                {piece.isPublished ? (
                                  <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/20 flex items-center gap-1">
                                    <FiCheckCircle /> Publié
                                  </span>
                                ) : (
                                  <span className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-xs font-medium border border-orange-500/20 flex items-center gap-1">
                                    <FiXCircle /> Brouillon
                                  </span>
                                )}
                              </button>
                            </td>
                            <td className="p-4 text-muted text-sm">
                              {new Date(piece.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="p-4 flex justify-end gap-2">
                              <Link
                                to={`/admin/pieces/${piece._id}/edit`}
                                className="p-2 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                                title="Éditer"
                              >
                                <FiEdit2 />
                              </Link>
                              <button
                                onClick={() => handleDelete(piece._id)}
                                className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                                title="Supprimer"
                              >
                                <FiTrash2 />
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {sortedPieces.length === 0 && (
                      <tr>
                        <td colSpan={canReorder ? 8 : 7} className="p-8 text-center text-muted">
                          Aucune pièce trouvée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </Droppable>
            </table>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default PiecesAdmin;
