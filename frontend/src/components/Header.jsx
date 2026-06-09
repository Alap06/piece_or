import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import useAuthStore from '../store/authStore';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import SiteLogo from './SiteLogo';

const Header = () => {
  const { t } = useTranslation();
  const { lang, changeLanguage, dir } = useLanguage();
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.pieces'), path: '/pieces' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `relative text-sm uppercase tracking-[4px] font-medium transition-all duration-300 ${
      isActive ? 'text-gold' : 'text-ivory hover:text-gold'
    }`;

  return (
    <header className="sticky top-0 z-50 glass-dark border-b border-gold-dim w-full">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 h-[100px] flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 group z-50">
          <SiteLogo variant="header" />
          <div className="hidden sm:block">
            <h1 className="text-gold-light text-2xl font-serif leading-none tracking-wide group-hover:text-gold transition-colors">
              {t('home.title')}
            </h1>
            <p className="text-muted text-[10px] tracking-[0.4em] uppercase mt-1">
              Heritage Jewelry
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={navClass}>
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-6 z-50">
          
          {/* Language Switcher */}
          <div className="hidden sm:flex items-center bg-[#0e1b2b] border border-gold-dim rounded-full p-1">
            {['fr', 'en', 'ar'].map((l) => (
              <button
                key={l}
                onClick={() => changeLanguage(l)}
                className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-[2px] transition-all duration-300 ${
                  lang === l ? 'bg-gold text-black font-semibold' : 'text-beige hover:text-gold'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Auth/Profile */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-full border border-gold overflow-hidden group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-shadow">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-dark-2 flex items-center justify-center text-gold">
                      <FiUser size={20} />
                    </div>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute ${dir === 'rtl' ? 'left-0' : 'right-0'} mt-4 w-56 bg-[#102132] border border-gold-dim rounded-2xl shadow-2xl overflow-hidden`}
                  >
                    <div className="p-4 border-b border-[#1e3448]">
                      <p className="text-ivory font-semibold truncate">{user?.username}</p>
                      <p className="text-muted text-xs truncate">{user?.email}</p>
                    </div>
                    <div className="p-2 flex flex-col">
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1a2d42] text-sm text-ivory transition-colors"
                        >
                          <FiSettings className="text-gold" />
                          {t('nav.admin')}
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-sm text-red-400 transition-colors w-full text-left"
                      >
                        <FiLogOut />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-flex btn-outline-gold text-sm py-2 px-6">
              {t('nav.login')}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gold hover:text-gold-light transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark border-b border-gold-dim overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-lg uppercase tracking-[2px] ${isActive ? 'text-gold' : 'text-ivory'}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              
              <div className="h-[1px] bg-gold-dim w-full" />
              
              <div className="flex gap-4">
                {['fr', 'en', 'ar'].map((l) => (
                  <button
                    key={l}
                    onClick={() => { changeLanguage(l); setIsMobileMenuOpen(false); }}
                    className={`px-4 py-2 rounded-lg text-sm uppercase tracking-[1px] ${
                      lang === l ? 'bg-gold text-black' : 'bg-dark-2 text-beige border border-gold-dim'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-gold text-center py-3 mt-2"
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
