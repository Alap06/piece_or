import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import PiecesPage from './pages/PiecesPage';
import PieceDetailPage from './pages/PieceDetailPage';
import ContactPage from './pages/ContactPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import PiecesAdmin from './pages/admin/PiecesAdmin';
import PieceFormPage from './pages/admin/PieceFormPage';
import MessagesAdmin from './pages/admin/MessagesAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/pieces" element={<PiecesPage />} />
          <Route path="/pieces/:id" element={<PieceDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="pieces" element={<PiecesAdmin />} />
          <Route path="pieces/new" element={<PieceFormPage />} />
          <Route path="pieces/:id/edit" element={<PieceFormPage />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
