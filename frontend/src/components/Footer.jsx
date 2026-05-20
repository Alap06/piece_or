import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#050b14] border-t border-gold-dim pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img src="/logo.png" alt="Logo" className="w-20 mb-6 drop-shadow-[0_0_10px_rgba(212,175,55,0.2)]" onError={(e) => e.target.src = '/logo.png'} />
          <h3 className="text-gold-light font-serif text-xl mb-2">{t('home.title')}</h3>
          <p className="text-muted text-sm max-w-xs">{t('home.tagline')}</p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-ivory font-semibold uppercase tracking-[2px] mb-6">{t('footer.links')}</h4>
          <ul className="space-y-4">
            <li><Link to="/pieces" className="text-muted hover:text-gold transition">{t('nav.pieces')}</Link></li>
            <li><Link to="/contact" className="text-muted hover:text-gold transition">{t('nav.contact')}</Link></li>
            <li><Link to="/login" className="text-muted hover:text-gold transition">{t('nav.login')}</Link></li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-ivory font-semibold uppercase tracking-[2px] mb-6">{t('footer.follow')}</h4>
          <div className="flex gap-4 mb-6">
            <a href="#" className="w-10 h-10 rounded-full bg-dark-2 border border-gold-dim flex items-center justify-center text-gold hover:bg-gold hover:text-black transition">
              <FiFacebook size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-dark-2 border border-gold-dim flex items-center justify-center text-gold hover:bg-gold hover:text-black transition">
              <FiInstagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-dark-2 border border-gold-dim flex items-center justify-center text-gold hover:bg-gold hover:text-black transition">
              <FiTwitter size={20} />
            </a>
          </div>
          <p className="text-muted text-sm">{t('contact.address')}</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-[#101a26] text-center">
        <p className="text-muted text-xs tracking-[1px]">{t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;
