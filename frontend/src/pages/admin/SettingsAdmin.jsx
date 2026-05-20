import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { settingsAPI } from '../../api';
import Loader from '../../components/Loader';
import toast, { Toaster } from 'react-hot-toast';

const SettingsAdmin = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const { data } = await settingsAPI.getAll();
      setSettings(data.settings);
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key) => {
    setSaving(true);
    try {
      await settingsAPI.update(key, settings[key]);
      toast.success(t('common.save'));
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-serif text-ivory mb-8">{t('admin.settings')}</h1>

      <div className="bg-dark-2 border border-gold-dim rounded-2xl p-6 space-y-8">
        
        {/* General Settings */}
        <div>
          <h2 className="text-xl text-gold-light mb-4 border-b border-gold-dim pb-2">Général</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase text-muted mb-2">Nom du site</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={settings.site_name || ''} 
                  onChange={(e) => handleChange('site_name', e.target.value)}
                  className="w-full bg-dark border border-gold-dim rounded px-3 py-2 text-ivory outline-none focus:border-gold" 
                />
                <button disabled={saving} onClick={() => handleSave('site_name')} className="btn-gold px-4 rounded text-sm">Save</button>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase text-muted mb-2">Email de contact</label>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  value={settings.contact_email || ''} 
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="w-full bg-dark border border-gold-dim rounded px-3 py-2 text-ivory outline-none focus:border-gold" 
                />
                <button disabled={saving} onClick={() => handleSave('contact_email')} className="btn-gold px-4 rounded text-sm">Save</button>
              </div>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div>
          <h2 className="text-xl text-gold-light mb-4 border-b border-gold-dim pb-2">Affichage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase text-muted mb-2">Pièces par page</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={settings.pieces_per_page || 12} 
                  onChange={(e) => handleChange('pieces_per_page', Number(e.target.value))}
                  className="w-full bg-dark border border-gold-dim rounded px-3 py-2 text-ivory outline-none focus:border-gold" 
                />
                <button disabled={saving} onClick={() => handleSave('pieces_per_page')} className="btn-gold px-4 rounded text-sm">Save</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsAdmin;
