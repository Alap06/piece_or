import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { piecesAPI } from '../../api';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../../components/Loader';
import { FiPlus, FiTrash2, FiSave, FiX, FiImage } from 'react-icons/fi';
import api from '../../api/axios';
import { PIECE_CATEGORIES } from '../../constants/pieceCategories';

const PieceFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);

  const [formData, setFormData] = useState({
    name: { fr: '', en: '', ar: '' },
    origin: { fr: '', en: '', ar: '' },
    period: { fr: '', en: '', ar: '' },
    description: { fr: '', en: '', ar: '' },
    symbol: { fr: '', en: '', ar: '' },
    material: '',
    color: '',
    category: 'autre',
    order: 0,
    isPublished: false,
    technicalImage: { url: '', publicId: '' },
    historicalData: [],
    subPieces: []
  });

  const [images, setImages] = useState([]); // Array of existing images
  const [uploadFiles, setUploadFiles] = useState(null); // Files to upload upon save

  useEffect(() => {
    if (isEdit) {
      const fetchPiece = async () => {
        try {
          const { data } = await piecesAPI.getById(id);
          const p = data.piece;
          setFormData({
            name: p.name || { fr: '', en: '', ar: '' },
            origin: p.origin || { fr: '', en: '', ar: '' },
            period: p.period || { fr: '', en: '', ar: '' },
            description: p.description || { fr: '', en: '', ar: '' },
            symbol: p.symbol || { fr: '', en: '', ar: '' },
            material: p.material || '',
            color: p.color || '',
            category: p.category || 'autre',
            order: p.order || 0,
            isPublished: p.isPublished || false,
            technicalImage: p.technicalImage || { url: '', publicId: '' },
            historicalData: p.historicalData || [],
            subPieces: p.subPieces || []
          });
          setImages(p.images || []);
        } catch (error) {
          toast.error(t('common.error'));
        } finally {
          setLoading(false);
        }
      };
      fetchPiece();
    }
  }, [id, isEdit, t]);

  const handleLangChange = (field, lang, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value }
    }));
  };

  const handleSubPieceChange = (index, field, lang, value) => {
    const newSubPieces = [...formData.subPieces];
    if (['name', 'description'].includes(field)) {
      newSubPieces[index][field] = { ...newSubPieces[index][field], [lang]: value };
    } else {
      newSubPieces[index][field] = value;
    }
    setFormData({ ...formData, subPieces: newSubPieces });
  };

  const addSubPiece = () => {
    setFormData({
      ...formData,
      subPieces: [
        ...formData.subPieces,
        {
          name: { fr: '', en: '', ar: '' },
          description: { fr: '', en: '', ar: '' },
          material: '',
          image: { url: '', publicId: '' }
        }
      ]
    });
  };

  const handleHistoricalDataChange = (index, field, lang, value) => {
    const newHistoricalData = [...formData.historicalData];
    const current = newHistoricalData[index] || {
      label: { fr: '', en: '', ar: '' },
      value: { fr: '', en: '', ar: '' },
      order: index,
    };

    if (field === 'label' || field === 'value') {
      current[field] = { ...current[field], [lang]: value };
    } else {
      current[field] = value;
    }

    newHistoricalData[index] = current;
    setFormData({ ...formData, historicalData: newHistoricalData });
  };

  const addHistoricalData = () => {
    setFormData({
      ...formData,
      historicalData: [
        ...formData.historicalData,
        {
          label: { fr: '', en: '', ar: '' },
          value: { fr: '', en: '', ar: '' },
          order: formData.historicalData.length,
        },
      ],
    });
  };

  const removeHistoricalData = (index) => {
    const newHistoricalData = [...formData.historicalData];
    newHistoricalData.splice(index, 1);
    setFormData({ ...formData, historicalData: newHistoricalData });
  };

  const handleTechnicalImageUpload = async (file) => {
    if (!file) return;
    const toastId = toast.loading('Uploading technical image...');
    try {
      const dataForm = new FormData();
      dataForm.append('image', file);
      const { data } = await api.post('/pieces/upload-single', dataForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({
        ...prev,
        technicalImage: { url: data.url, publicId: data.publicId }
      }));
      toast.success('Fiche technique ajoutée', { id: toastId });
    } catch (error) {
      toast.error('Erreur upload', { id: toastId });
    }
  };

  const removeSubPiece = (index) => {
    const newSubPieces = [...formData.subPieces];
    newSubPieces.splice(index, 1);
    setFormData({ ...formData, subPieces: newSubPieces });
  };

  const handleSubPieceImageUpload = async (index, file) => {
    if (!file) return;
    const toastId = toast.loading('Uploading image...');
    try {
      const dataForm = new FormData();
      dataForm.append('image', file);
      const { data } = await api.post('/pieces/upload-single', dataForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newSubPieces = [...formData.subPieces];
      newSubPieces[index].image = { url: data.url, publicId: data.publicId };
      setFormData({ ...formData, subPieces: newSubPieces });
      toast.success('Image uploadée', { id: toastId });
    } catch (error) {
      toast.error('Erreur upload', { id: toastId });
    }
  };

  const handleAutoTranslate = async () => {
    if (!isEdit) {
      toast.error('Enregistrez la pièce avant de générer les traductions');
      return;
    }
    setTranslating(true);
    const toastId = toast.loading('Traduction en cours (FR → EN, AR)...');
    try {
      const { data } = await piecesAPI.autoTranslate(id);
      const p = data.piece;
      setFormData((prev) => ({
        ...prev,
        name: p.name || prev.name,
        origin: p.origin || prev.origin,
        period: p.period || prev.period,
        description: p.description || prev.description,
        symbol: p.symbol || prev.symbol,
        historicalData: p.historicalData || prev.historicalData,
      }));
      toast.success('Traductions EN et AR générées', { id: toastId });
    } catch {
      toast.error('Erreur de traduction', { id: toastId });
    } finally {
      setTranslating(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let savedPieceId = id;

      if (isEdit) {
        await piecesAPI.update(id, formData);
        toast.success(t('common.save'));
      } else {
        const { data } = await piecesAPI.create(formData);
        savedPieceId = data.piece._id;
        toast.success(t('common.save'));
      }

      // Handle main images upload
      if (uploadFiles && uploadFiles.length > 0) {
        const dataForm = new FormData();
        Array.from(uploadFiles).forEach(file => dataForm.append('images', file));
        await piecesAPI.uploadImages(savedPieceId, dataForm);
        toast.success('Images uploadées');
      }

      if (!isEdit) {
        navigate('/admin/pieces');
      } else {
        // Refresh images
        const { data } = await piecesAPI.getById(id);
        setImages(data.piece.images || []);
        setUploadFiles(null);
      }
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const deleteImage = async (imageId) => {
    if (window.confirm(t('admin.delete_confirm'))) {
      try {
        await piecesAPI.deleteImage(id, imageId);
        setImages(images.filter(img => img._id !== imageId));
        toast.success('Image supprimée');
      } catch (error) {
        toast.error('Erreur de suppression');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="pb-20 max-w-5xl mx-auto">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-ivory">
          {isEdit ? t('admin.edit_piece') : t('admin.new_piece')}
        </h1>
        <div className="flex flex-wrap gap-4">
          {isEdit && (
            <button
              type="button"
              onClick={handleAutoTranslate}
              disabled={translating || saving}
              className="btn-outline-gold px-4 py-2 disabled:opacity-50"
            >
              {translating ? 'Traduction…' : 'Traduire FR → EN / AR'}
            </button>
          )}
          <button onClick={() => navigate('/admin/pieces')} className="btn-outline-gold px-4 py-2 flex items-center gap-2">
            <FiX /> {t('common.cancel')}
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-gold px-4 py-2 flex items-center gap-2 disabled:opacity-50">
            <FiSave /> {saving ? t('common.loading') : t('common.save')}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* Main Info */}
        <div className="bg-dark-2 border border-gold-dim rounded-2xl p-6">
          <h2 className="text-xl text-gold-light mb-6 border-b border-gold-dim pb-2 font-serif">Informations Principales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {['fr', 'en', 'ar'].map(l => (
              <div key={`name-${l}`}>
                <label className="block text-xs uppercase text-muted mb-2">Nom ({l.toUpperCase()})</label>
                <input
                  value={formData.name[l] || ''}
                  onChange={(e) => handleLangChange('name', l, e.target.value)}
                  dir={l === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full bg-dark border border-gold-dim rounded px-4 py-2 text-ivory outline-none focus:border-gold"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {['fr', 'en', 'ar'].map(l => (
              <div key={`desc-${l}`}>
                <label className="block text-xs uppercase text-muted mb-2">Description ({l.toUpperCase()})</label>
                <textarea
                  value={formData.description[l] || ''}
                  onChange={(e) => handleLangChange('description', l, e.target.value)}
                  dir={l === 'ar' ? 'rtl' : 'ltr'}
                  rows="4"
                  className="w-full bg-dark border border-gold-dim rounded px-4 py-2 text-ivory outline-none focus:border-gold"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {['fr', 'en', 'ar'].map(l => (
              <div key={`origin-${l}`}>
                <label className="block text-xs uppercase text-muted mb-2">Origine ({l.toUpperCase()})</label>
                <input
                  value={formData.origin[l] || ''}
                  onChange={(e) => handleLangChange('origin', l, e.target.value)}
                  dir={l === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full bg-dark border border-gold-dim rounded px-4 py-2 text-ivory outline-none focus:border-gold"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {['fr', 'en', 'ar'].map(l => (
              <div key={`period-${l}`}>
                <label className="block text-xs uppercase text-muted mb-2">Période ({l.toUpperCase()})</label>
                <input
                  value={formData.period[l] || ''}
                  onChange={(e) => handleLangChange('period', l, e.target.value)}
                  dir={l === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full bg-dark border border-gold-dim rounded px-4 py-2 text-ivory outline-none focus:border-gold"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {['fr', 'en', 'ar'].map(l => (
              <div key={`symbol-${l}`}>
                <label className="block text-xs uppercase text-muted mb-2">Symbole ({l.toUpperCase()})</label>
                <input
                  value={formData.symbol[l] || ''}
                  onChange={(e) => handleLangChange('symbol', l, e.target.value)}
                  dir={l === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full bg-dark border border-gold-dim rounded px-4 py-2 text-ivory outline-none focus:border-gold"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs uppercase text-muted mb-2">Catégorie</label>
              <select
                value={formData.category || 'autre'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-dark border border-gold-dim rounded px-4 py-2 text-ivory outline-none focus:border-gold"
              >
                {PIECE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{t(cat.labelKey)}</option>
                ))}
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase text-muted mb-2">Matériau</label>
              <input value={formData.material || ''} onChange={e => setFormData({...formData, material: e.target.value})} className="w-full bg-dark border border-gold-dim rounded px-4 py-2 text-ivory outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs uppercase text-muted mb-2">Couleur (Hex)</label>
              <input value={formData.color || ''} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full bg-dark border border-gold-dim rounded px-4 py-2 text-ivory outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs uppercase text-muted mb-2">Ordre d'affichage</label>
              <input type="number" value={formData.order || 0} onChange={e => setFormData({...formData, order: Number(e.target.value)})} className="w-full bg-dark border border-gold-dim rounded px-4 py-2 text-ivory outline-none focus:border-gold" />
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-3">
            <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="w-5 h-5 accent-gold" />
            <label className="text-sm uppercase tracking-[1px] text-ivory">Publié</label>
          </div>
        </div>

        {/* Historical sheet / analysis */}
        <div className="bg-dark-2 border border-gold-dim rounded-2xl p-6 mt-8">
          <div className="flex justify-between items-center border-b border-gold-dim pb-2 mb-6">
            <h2 className="text-xl text-gold-light font-serif">Fiche historique / analyse</h2>
            <button onClick={addHistoricalData} className="btn-outline-gold px-3 py-1 flex items-center gap-2 text-sm rounded">
              <FiPlus /> Ajouter un champ
            </button>
          </div>

          {formData.historicalData.length === 0 ? (
            <p className="text-muted text-center py-6">Aucun champ d&apos;analyse. Ajoutez une ligne pour documenter la pièce.</p>
          ) : (
            <div className="space-y-6">
              {formData.historicalData.map((item, index) => (
                <div key={index} className="bg-dark border border-gold-dim/50 rounded-xl p-6 relative">
                  <button onClick={() => removeHistoricalData(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-500 transition p-2 bg-red-500/10 rounded">
                    <FiTrash2 />
                  </button>
                  <h3 className="text-lg text-gold mb-4 font-serif">Champ #{index + 1}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {['fr', 'en', 'ar'].map(l => (
                      <div key={`hist-label-${index}-${l}`}>
                        <label className="block text-xs uppercase text-muted mb-2">Libellé ({l.toUpperCase()})</label>
                        <input
                          value={item.label?.[l] || ''}
                          onChange={(e) => handleHistoricalDataChange(index, 'label', l, e.target.value)}
                          dir={l === 'ar' ? 'rtl' : 'ltr'}
                          className="w-full bg-dark-2 border border-gold-dim rounded px-3 py-2 text-ivory outline-none focus:border-gold text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {['fr', 'en', 'ar'].map(l => (
                      <div key={`hist-value-${index}-${l}`}>
                        <label className="block text-xs uppercase text-muted mb-2">Valeur ({l.toUpperCase()})</label>
                        <textarea
                          value={item.value?.[l] || ''}
                          onChange={(e) => handleHistoricalDataChange(index, 'value', l, e.target.value)}
                          dir={l === 'ar' ? 'rtl' : 'ltr'}
                          rows="3"
                          className="w-full bg-dark-2 border border-gold-dim rounded px-3 py-2 text-ivory outline-none focus:border-gold text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="w-full md:w-48">
                    <label className="block text-xs uppercase text-muted mb-2">Ordre</label>
                    <input
                      type="number"
                      value={item.order || 0}
                      onChange={(e) => handleHistoricalDataChange(index, 'order', null, Number(e.target.value))}
                      className="w-full bg-dark-2 border border-gold-dim rounded px-3 py-2 text-ivory outline-none focus:border-gold text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Technical sheet image */}
        <div className="bg-dark-2 border border-gold-dim rounded-2xl p-6 mt-8">
          <h2 className="text-xl text-gold-light mb-6 border-b border-gold-dim pb-2 font-serif">Fiche technique</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-xs uppercase text-muted mb-2">Image de la fiche technique</label>
              <div className="flex items-center gap-4">
                {formData.technicalImage?.url && (
                  <img src={formData.technicalImage.url} alt="fiche technique" className="w-24 h-24 object-cover rounded border border-gold" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleTechnicalImageUpload(e.target.files[0])}
                  className="text-sm text-ivory flex-1"
                />
              </div>
            </div>
            <div className="text-muted text-sm leading-6">
              <p>Cette image est affichée dans la page détail de la pièce comme illustration technique.</p>
              <p className="mt-2">Si aucune image n&apos;est envoyée, le site utilisera automatiquement la première photo de la galerie.</p>
            </div>
          </div>
        </div>

        {/* Images */}
        {isEdit && (
          <div className="bg-dark-2 border border-gold-dim rounded-2xl p-6">
            <h2 className="text-xl text-gold-light mb-6 border-b border-gold-dim pb-2 font-serif">Galerie d'Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {images.map(img => (
                <div key={img._id} className="relative group rounded overflow-hidden border border-gold-dim">
                  <img src={img.url} alt="piece" className="w-full h-32 object-cover" />
                  <button onClick={() => deleteImage(img._id)} className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded opacity-0 group-hover:opacity-100 transition">
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
            
            <label className="block text-xs uppercase text-muted mb-2">Ajouter de nouvelles images</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setUploadFiles(e.target.files)} className="w-full text-ivory bg-dark border border-gold-dim p-2 rounded" />
          </div>
        )}

        {/* Sub-pieces */}
        <div className="bg-dark-2 border border-gold-dim rounded-2xl p-6">
          <div className="flex justify-between items-center border-b border-gold-dim pb-2 mb-6">
            <h2 className="text-xl text-gold-light font-serif">Sous-pièces (Décomposition)</h2>
            <button onClick={addSubPiece} className="btn-outline-gold px-3 py-1 flex items-center gap-2 text-sm rounded">
              <FiPlus /> Ajouter une partie
            </button>
          </div>

          {formData.subPieces.length === 0 ? (
            <p className="text-muted text-center py-6">Aucune sous-pièce. Cliquez sur Ajouter pour décomposer cette pièce.</p>
          ) : (
            <div className="space-y-8">
              {formData.subPieces.map((sp, index) => (
                <div key={index} className="bg-dark border border-gold-dim/50 rounded-xl p-6 relative">
                  <button onClick={() => removeSubPiece(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-500 transition p-2 bg-red-500/10 rounded">
                    <FiTrash2 />
                  </button>
                  <h3 className="text-lg text-gold mb-4 font-serif">Partie #{index + 1}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {['fr', 'en', 'ar'].map(l => (
                      <div key={`sp-name-${l}`}>
                        <label className="block text-xs uppercase text-muted mb-2">Nom ({l.toUpperCase()})</label>
                        <input
                          value={sp.name?.[l] || ''}
                          onChange={(e) => handleSubPieceChange(index, 'name', l, e.target.value)}
                          dir={l === 'ar' ? 'rtl' : 'ltr'}
                          className="w-full bg-dark-2 border border-gold-dim rounded px-3 py-2 text-ivory outline-none focus:border-gold text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {['fr', 'en', 'ar'].map(l => (
                      <div key={`sp-desc-${l}`}>
                        <label className="block text-xs uppercase text-muted mb-2">Description ({l.toUpperCase()})</label>
                        <textarea
                          value={sp.description?.[l] || ''}
                          onChange={(e) => handleSubPieceChange(index, 'description', l, e.target.value)}
                          dir={l === 'ar' ? 'rtl' : 'ltr'}
                          rows="3"
                          className="w-full bg-dark-2 border border-gold-dim rounded px-3 py-2 text-ivory outline-none focus:border-gold text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase text-muted mb-2">Matériau</label>
                      <input value={sp.material || ''} onChange={e => handleSubPieceChange(index, 'material', null, e.target.value)} className="w-full bg-dark-2 border border-gold-dim rounded px-3 py-2 text-ivory outline-none focus:border-gold text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-muted mb-2">Image de la sous-pièce</label>
                      <div className="flex items-center gap-4">
                        {sp.image?.url && (
                          <img src={sp.image.url} alt="subpiece" className="w-12 h-12 object-cover rounded border border-gold" />
                        )}
                        <input type="file" accept="image/*" onChange={(e) => handleSubPieceImageUpload(index, e.target.files[0])} className="text-sm text-ivory flex-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PieceFormPage;
