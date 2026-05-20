import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { messagesAPI } from '../../api';
import Loader from '../../components/Loader';
import { FiTrash2, FiCheck, FiMail } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';

const MessagesAdmin = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const { data } = await messagesAPI.getAll({ limit: 50 });
      setMessages(data.messages);
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await messagesAPI.markRead(id);
      setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
      toast.success(t('admin.save'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.delete_confirm'))) {
      try {
        await messagesAPI.delete(id);
        setMessages(messages.filter(m => m._id !== id));
        toast.success(t('admin.delete'));
      } catch (error) {
        toast.error(t('common.error'));
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-3xl font-serif text-ivory mb-8">{t('admin.messages')}</h1>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg._id} className={`bg-dark-2 border rounded-2xl p-6 transition ${msg.isRead ? 'border-gold-dim/30 opacity-70' : 'border-gold-dim shadow-[0_0_15px_rgba(212,175,55,0.1)]'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.isRead ? 'bg-dark text-muted' : 'bg-gold text-black'}`}>
                  <FiMail />
                </div>
                <div>
                  <h3 className="text-ivory font-semibold">{msg.name}</h3>
                  <p className="text-xs text-muted">{msg.email} — {dayjs(msg.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {!msg.isRead && (
                  <button onClick={() => handleMarkRead(msg._id)} className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded transition" title={t('admin.mark_read')}>
                    <FiCheck />
                  </button>
                )}
                <button onClick={() => handleDelete(msg._id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition" title={t('admin.delete')}>
                  <FiTrash2 />
                </button>
              </div>
            </div>
            
            <div className="bg-black/30 rounded-xl p-4 border border-gold-dim/30">
              <p className="font-medium text-gold-light mb-2">{msg.subject}</p>
              <p className="text-beige text-sm whitespace-pre-wrap">{msg.message}</p>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-20 text-muted bg-dark-2 rounded-2xl border border-gold-dim border-dashed">
            Aucun message reçu.
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesAdmin;
