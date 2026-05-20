import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authAPI } from '../../api';
import useAuthStore from '../../store/authStore';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const pwd = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.register({
        username: data.username,
        email: data.email,
        password: data.password
      });
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      toast.success(t('auth.login_success'));
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark min-h-screen flex items-center justify-center px-6 relative py-20">
      <Toaster position="top-center" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599643478524-fb66f70a0066?w=1600')] bg-cover bg-center opacity-10 pointer-events-none mix-blend-luminosity" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-premium w-full max-w-md p-10 bg-[#070b12] relative z-10"
      >
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Logo" className="w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-serif text-gold-light">{t('auth.register_title')}</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-[1px] text-muted mb-2">{t('auth.username')}</label>
            <input
              type="text"
              {...register('username', { required: true, minLength: 3 })}
              className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none"
            />
          </div>

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
              {...register('password', { required: true, minLength: 6 })}
              className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[1px] text-muted mb-2">{t('auth.confirm_password')}</label>
            <input
              type="password"
              {...register('confirm_password', { 
                required: true,
                validate: value => value === pwd || 'Passwords do not match'
              })}
              className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none"
            />
            {errors.confirm_password && <p className="text-red-400 text-xs mt-1">{errors.confirm_password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-gold w-full mt-8"
          >
            {loading ? t('common.loading') : t('auth.register_btn')}
          </button>
        </form>

        <p className="text-center mt-8 text-muted text-sm">
          {t('auth.have_account')} <Link to="/login" className="text-gold hover:underline">{t('auth.login_link')}</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
