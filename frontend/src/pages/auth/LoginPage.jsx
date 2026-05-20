import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAuthStore from '../../store/authStore';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const res = await login(data);
    if (res.success) {
      toast.success(t('auth.login_success'));
      setTimeout(() => navigate('/admin'), 1000);
    } else {
      toast.error(t('auth.error_invalid'));
    }
  };

  return (
    <div className="bg-dark min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <Toaster position="top-center" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599643478524-fb66f70a0066?w=1600')] bg-cover bg-center opacity-10 pointer-events-none mix-blend-luminosity" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-premium w-full max-w-md p-10 bg-[#070b12] relative z-10"
      >
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Logo" className="w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-serif text-gold-light">{t('auth.login_title')}</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-[1px] text-muted mb-2">{t('auth.email')}</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none"
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-[1px] text-muted mb-2">{t('auth.password')}</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-gold w-full mt-8"
          >
            {isLoading ? t('common.loading') : t('auth.login_btn')}
          </button>
        </form>

        <p className="text-center mt-8 text-muted text-sm">
          {t('auth.no_account')} <Link to="/register" className="text-gold hover:underline">{t('auth.register_link')}</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
