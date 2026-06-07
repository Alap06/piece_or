import React from 'react';
import { SITE_LOGO } from '../constants/branding';

/** Variantes d’affichage du logo. Variante hero : sans effet (page d’accueil). */
const VARIANTS = {
  hero: 'w-52 md:w-72 mb-8',
  header: [
    'w-16 h-16',
    'drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]',
    'group-hover:scale-105 transition-transform duration-300',
  ].join(' '),
  footer: 'w-20 drop-shadow-[0_0_16px_rgba(212,175,55,0.4)]',
  auth: 'w-16 mx-auto mb-4 drop-shadow-[0_0_24px_rgba(212,175,55,0.55)]',
  admin: 'w-10 h-10 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]',
};

const SiteLogo = ({ variant = 'header', className = '', alt = 'Logo' }) => (
  <img
    src={SITE_LOGO}
    alt={alt}
    className={`object-contain ${VARIANTS[variant] || ''} ${className}`.trim()}
  />
);

export default SiteLogo;
