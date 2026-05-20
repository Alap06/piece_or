import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { messagesAPI } from '../api';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const contactSchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  subject: z.string().min(3, 'Sujet trop court'),
  message: z.string().min(10, 'Message trop court'),
});

const ContactPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await messagesAPI.send(data);
      toast.success(t('contact.success'), {
        style: { background: '#D4AF37', color: '#000' },
        iconTheme: { primary: '#000', secondary: '#D4AF37' },
      });
      reset();
    } catch (error) {
      toast.error(t('contact.error'), {
        style: { background: '#ff4b4b', color: '#fff' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark min-h-screen py-24 px-6 relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-gold-light mb-4">{t('contact.title')}</h1>
          <p className="text-muted text-lg">{t('contact.subtitle')}</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-8 md:p-12 bg-[#050a10]"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm uppercase tracking-[1px] text-muted mb-2">{t('contact.name')}</label>
                <input
                  {...register('name')}
                  className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none transition"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm uppercase tracking-[1px] text-muted mb-2">{t('contact.email')}</label>
                <input
                  {...register('email')}
                  className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none transition"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm uppercase tracking-[1px] text-muted mb-2">{t('contact.subject')}</label>
              <input
                {...register('subject')}
                className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none transition"
              />
              {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="block text-sm uppercase tracking-[1px] text-muted mb-2">{t('contact.message')}</label>
              <textarea
                {...register('message')}
                rows="6"
                className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none transition resize-none"
              ></textarea>
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
            </div>

            <div className="pt-4 text-center">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-gold w-full md:w-auto px-12 py-4 disabled:opacity-50"
              >
                {loading ? t('common.loading') : t('contact.submit')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
