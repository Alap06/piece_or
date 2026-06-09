import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useTranslation } from 'react-i18next';
import { FiHome, FiSettings, FiMail, FiGrid, FiLogOut, FiStar, FiImage, FiUsers } from 'react-icons/fi';
import SiteLogo from '../components/SiteLogo';
import { useLanguage } from '../contexts/LanguageContext';

const AdminLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const menu = [
    { path: '/admin', icon: <FiGrid />, label: t('admin.dashboard') || 'Tableau de bord' },
    { path: '/admin/pieces', icon: <FiHome />, label: t('admin.pieces') || 'Pièces' },
    { path: '/admin/legends', icon: <FiStar />, label: 'Légendes' },
    { path: '/admin/media', icon: <FiImage />, label: 'Médiathèque' },
    { path: '/admin/users', icon: <FiUsers />, label: 'Utilisateurs' },
    { path: '/admin/messages', icon: <FiMail />, label: t('admin.messages') || 'Messages' },
    { path: '/admin/settings', icon: <FiSettings />, label: t('admin.settings') || 'Paramètres' },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-[#070b12] text-ivory">
      
      {/* Sidebar */}
      <aside className={`w-64 bg-[#0a111a] border-${dir === 'rtl' ? 'l' : 'r'} border-gold-dim flex flex-col`}>
        <div className="p-6 border-b border-gold-dim flex items-center justify-center">
          <Link to="/" className="flex items-center gap-3">
            <SiteLogo variant="admin" />
            <span className="text-gold font-serif text-lg">Admin</span>
          </Link>
        </div>

        <nav className="flex-grow py-6">
          <ul className="space-y-2 px-4">
            {menu.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition ${
                      isActive ? 'bg-gold/10 text-gold border border-gold/30' : 'text-muted hover:bg-dark-2 hover:text-ivory'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gold-dim">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            <FiLogOut />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-gold-dim bg-[#0a111a] flex items-center justify-between px-8">
          <h2 className="text-gold text-lg font-serif">{t('admin.dashboard')}</h2>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted hover:text-gold transition">
              {t('nav.home')}
            </Link>
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold border border-gold">
              A
            </div>
          </div>
        </header>

        <div className="flex-grow p-8 overflow-y-auto custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
