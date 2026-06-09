import api from './axios';

// ─── Auth ─────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  refresh: () => api.post('/auth/refresh'),
};

// ─── Pieces ───────────────────────────────────────────────
export const piecesAPI = {
  getAll: (params) => api.get('/pieces', { params }),
  getById: (id) => api.get(`/pieces/${id}`),
  create: (data) => api.post('/pieces', data),
  update: (id, data) => api.put(`/pieces/${id}`, data),
  delete: (id) => api.delete(`/pieces/${id}`),
  togglePublish: (id) => api.patch(`/pieces/${id}/publish`),
  reorder: (items) => api.put('/pieces/reorder', { items }),
  autoTranslate: (id) => api.post(`/pieces/${id}/auto-translate`),
  autoTranslateAll: () => api.post('/pieces/auto-translate-all'),
  uploadImages: (id, formData) =>
    api.post(`/pieces/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteImage: (id, imageId) => api.delete(`/pieces/${id}/images/${imageId}`),
  getStats: () => api.get('/pieces/stats'),
};

// ─── Messages ─────────────────────────────────────────────
export const messagesAPI = {
  send: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/messages', { params }),
  markRead: (id) => api.patch(`/messages/${id}/read`),
  delete: (id) => api.delete(`/messages/${id}`),
};

// ─── Settings ─────────────────────────────────────────────
export const settingsAPI = {
  getAll: () => api.get('/settings'),
  update: (key, value) => api.put(`/settings/${key}`, { value }),
};

// ─── Legends ──────────────────────────────────────────────
export const legendsAPI = {
  getAll: (params) => api.get('/legends', { params }),
  getByPiece: (pieceId) => api.get(`/legends/piece/${pieceId}`),
  getBySlug: (slug) => api.get(`/legends/${slug}`),
  create: (data) => api.post('/legends', data),
  update: (id, data) => api.put(`/legends/${id}`, data),
  delete: (id) => api.delete(`/legends/${id}`),
};

// ─── Admin ────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getMedia: () => api.get('/admin/media'),
  deleteMedia: (publicId, data) => api.delete(`/admin/media/${publicId}`, { data }),
  getUsers: () => api.get('/admin/users'),
  createUser: (data) => api.post('/admin/users', data),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  resetPassword: (id) => api.post(`/admin/users/${id}/reset-password`),
};
