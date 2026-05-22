import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { legendsAPI, piecesAPI } from '../../api';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../../components/Loader';
import { FiSave, FiX, FiMapPin } from 'react-icons/fi';

const LANGS = ['fr', 'en', 'ar'];

const LegendFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [pieces, setPieces] = useState([]);

  const [formData, setFormData] = useState({
    name: { fr: '', en: '', ar: '' },
    shortDescription: { fr: '', en: '', ar: '' },
    longSignification: { fr: '', en: '', ar: '' },
    piece: '',
    symbol: '✦',
    positionX: 50,
    positionY: 50,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const piecesRes = await piecesAPI.getAll({ limit: 200 });
        setPieces(piecesRes.data.pieces);

        if (isEdit) {
          // We use getBySlug only if we have a slug, but for edit by ID we need the slug or another approach
          // Actually the backend only has getBySlug for public. For admin edit, let's fetch all and find by ID.
          const allRes = await legendsAPI.getAll();
          const found = allRes.data.legends.find(l => l._id === id);
          if (found) {
            setFormData({
              name: found.name || { fr: '', en: '', ar: '' },
              shortDescription: found.shortDescription || { fr: '', en: '', ar: '' },
              longSignification: found.longSignification || { fr: '', en: '', ar: '' },
              piece: found.piece?._id || found.piece || '',
              symbol: found.symbol || '✦',
              positionX: found.positionX ?? 50,
              positionY: found.positionY ?? 50,
            });
          }
        }
      } catch {
        toast.error('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, isEdit]);

  const handleLang = (field, lang, value) => {
    setFormData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.piece) {
      toast.error('Veuillez sélectionner une pièce.');
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await legendsAPI.update(id, formData);
      } else {
        await legendsAPI.create(formData);
      }
      toast.success('Légende sauvegardée');
      navigate('/admin/legends');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  const SYMBOLS = ['✦', '❋', '✿', '◈', '❖', '◉', '✵', '⚜', '✸', '❂', '✤', '◆'];

  return (
    <div className="pb-20 max-w-4xl mx-auto">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-ivory">
          {isEdit ? 'Modifier la légende' : 'Nouvelle légende'}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/admin/legends')}
            className="btn-outline-gold px-4 py-2 flex items-center gap-2 rounded-xl"
          >
            <FiX /> Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gold hover:bg-gold-light text-black px-5 py-2 rounded-xl flex items-center gap-2 font-medium transition disabled:opacity-50"
          >
            <FiSave /> {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      <div className="space-y-6">

        {/* Pièce liée */}
        <div className="bg-dark-2 border border-gold-dim rounded-2xl p-6">
          <h2 className="text-xl text-gold-light mb-4 border-b border-gold-dim pb-2 font-serif">
            Pièce associée
          </h2>
          <select
            value={formData.piece}
            onChange={e => setFormData({ ...formData, piece: e.target.value })}
            className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none appearance-none cursor-pointer"
          >
            <option value="">— Sélectionnez une pièce —</option>
            {pieces.map(p => (
              <option key={p._id} value={p._id}>{p.name?.fr || 'Sans nom'}</option>
            ))}
          </select>
        </div>

        {/* Identité */}
        <div className="bg-dark-2 border border-gold-dim rounded-2xl p-6">
          <h2 className="text-xl text-gold-light mb-6 border-b border-gold-dim pb-2 font-serif">
            Identité de la légende
          </h2>

          {/* Symbol picker */}
          <div className="mb-6">
            <label className="block text-xs uppercase text-muted mb-3">Symbole</label>
            <div className="flex flex-wrap gap-3">
              {SYMBOLS.map(sym => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => setFormData({ ...formData, symbol: sym })}
                  className={`w-12 h-12 text-2xl rounded-xl border transition ${
                    formData.symbol === sym
                      ? 'border-gold bg-gold/20 text-gold'
                      : 'border-gold-dim text-muted hover:border-gold/50 hover:text-ivory'
                  }`}
                >
                  {sym}
                </button>
              ))}
              <input
                type="text"
                value={formData.symbol}
                onChange={e => setFormData({ ...formData, symbol: e.target.value })}
                className="w-16 h-12 bg-dark border border-gold-dim rounded-xl px-3 text-center text-ivory focus:border-gold outline-none"
                maxLength={2}
                placeholder="…"
              />
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {LANGS.map(l => (
              <div key={`name-${l}`}>
                <label className="block text-xs uppercase text-muted mb-2">Nom ({l.toUpperCase()})</label>
                <input
                  value={formData.name[l] || ''}
                  onChange={e => handleLang('name', l, e.target.value)}
                  dir={l === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-2 text-ivory outline-none focus:border-gold"
                />
              </div>
            ))}
          </div>

          {/* Short Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {LANGS.map(l => (
              <div key={`short-${l}`}>
                <label className="block text-xs uppercase text-muted mb-2">
                  Description courte ({l.toUpperCase()})
                </label>
                <textarea
                  value={formData.shortDescription[l] || ''}
                  onChange={e => handleLang('shortDescription', l, e.target.value)}
                  dir={l === 'ar' ? 'rtl' : 'ltr'}
                  rows={3}
                  className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-2 text-ivory outline-none focus:border-gold resize-none"
                />
              </div>
            ))}
          </div>

          {/* Long Signification */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LANGS.map(l => (
              <div key={`long-${l}`}>
                <label className="block text-xs uppercase text-muted mb-2">
                  Signification longue ({l.toUpperCase()})
                </label>
                <textarea
                  value={formData.longSignification[l] || ''}
                  onChange={e => handleLang('longSignification', l, e.target.value)}
                  dir={l === 'ar' ? 'rtl' : 'ltr'}
                  rows={5}
                  className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-2 text-ivory outline-none focus:border-gold resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Position */}
        <div className="bg-dark-2 border border-gold-dim rounded-2xl p-6">
          <h2 className="text-xl text-gold-light mb-4 border-b border-gold-dim pb-2 font-serif flex items-center gap-2">
            <FiMapPin /> Position sur l'image
          </h2>
          <p className="text-muted text-sm mb-6">
            Définissez les coordonnées X/Y (en %) du point d'ancrage de cette légende sur l'image de la pièce.
          </p>
          <div className="grid grid-cols-2 gap-6 max-w-xs">
            <div>
              <label className="block text-xs uppercase text-muted mb-2">Position X (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.positionX}
                onChange={e => setFormData({ ...formData, positionX: Number(e.target.value) })}
                className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-2 text-ivory outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-muted mb-2">Position Y (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.positionY}
                onChange={e => setFormData({ ...formData, positionY: Number(e.target.value) })}
                className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-2 text-ivory outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Visual preview dot */}
          <div className="mt-6 relative w-full max-w-sm h-40 bg-dark border border-gold-dim/40 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-muted/30 text-xs uppercase tracking-widest">
              Aperçu position
            </div>
            <div
              className="absolute w-5 h-5 rounded-full bg-gold border-2 border-white shadow-lg shadow-gold/30 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xs text-black font-bold"
              style={{ left: `${formData.positionX}%`, top: `${formData.positionY}%` }}
            >
              {formData.symbol}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LegendFormPage;
