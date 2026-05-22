import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { legendsAPI, piecesAPI } from '../../api';
import Loader from '../../components/Loader';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiBookOpen } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const LegendsAdmin = () => {
  const [legends, setLegends] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPiece, setFilterPiece] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [legsRes, piecesRes] = await Promise.all([
          legendsAPI.getAll(),
          piecesAPI.getAll({ limit: 200 }),
        ]);
        setLegends(Array.isArray(legsRes?.data?.legends) ? legsRes.data.legends : []);
        setPieces(Array.isArray(piecesRes?.data?.pieces) ? piecesRes.data.pieces : []);
      } catch {
        toast.error('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette légende ?')) return;
    try {
      await legendsAPI.delete(id);
      setLegends(legends.filter(l => l._id !== id));
      toast.success('Légende supprimée');
    } catch {
      toast.error('Erreur de suppression');
    }
  };

  if (loading) return <Loader />;

  const filtered = legends.filter(l => {
    if (filterPiece && l.piece?._id !== filterPiece) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const nameFr = l.name?.fr?.toLowerCase() || '';
      if (!nameFr.includes(s)) return false;
    }
    return true;
  });

  return (
    <div className="pb-20">
      <Toaster position="top-right" />
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-ivory">Légendes</h1>
        <Link
          to="/admin/legends/new"
          className="bg-gold hover:bg-gold-light text-black flex items-center gap-2 py-2 px-4 rounded-xl font-medium transition"
        >
          <FiPlus /> Nouvelle légende
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-dark-2 border border-gold-dim rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-gold-dim rounded-xl py-2 pl-10 pr-4 text-ivory focus:border-gold outline-none transition"
          />
        </div>
        <select
          value={filterPiece}
          onChange={e => setFilterPiece(e.target.value)}
          className="bg-black border border-gold-dim rounded-xl py-2 px-4 text-ivory focus:border-gold outline-none transition appearance-none cursor-pointer"
        >
          <option value="">Toutes les pièces</option>
          {pieces.map(p => (
            <option key={p._id} value={p._id}>{p.name?.fr || 'Sans nom'}</option>
          ))}
        </select>
      </div>

      <div className="bg-dark-2 border border-gold-dim rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-black/50 border-b border-gold-dim">
                <th className="p-4 font-medium text-muted text-sm uppercase">Symbole</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Nom (fr)</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Pièce liée</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Slug</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Date</th>
                <th className="p-4 font-medium text-muted text-sm uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-dim/20">
              {filtered.map(legend => (
                <tr key={legend._id} className="hover:bg-black/20 transition">
                  <td className="p-4">
                    <span className="text-2xl text-gold">{legend.symbol || '✦'}</span>
                  </td>
                  <td className="p-4 font-serif text-ivory">{legend.name?.fr || 'Sans nom'}</td>
                  <td className="p-4 text-muted text-sm">
                    <span className="flex items-center gap-2">
                      <FiBookOpen className="text-gold/60" />
                      {legend.piece?.name?.fr || '—'}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted font-mono">{legend.slug || '—'}</td>
                  <td className="p-4 text-muted text-sm">
                    {new Date(legend.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <Link
                      to={`/admin/legends/${legend._id}/edit`}
                      className="p-2 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                      title="Éditer"
                    >
                      <FiEdit2 />
                    </Link>
                    <button
                      onClick={() => handleDelete(legend._id)}
                      className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                      title="Supprimer"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-muted">Aucune légende trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LegendsAdmin;
