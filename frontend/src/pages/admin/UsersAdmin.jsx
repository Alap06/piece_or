import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import Loader from '../../components/Loader';
import toast, { Toaster } from 'react-hot-toast';
import {
  FiPlus, FiTrash2, FiEdit2, FiShield, FiUser,
  FiCheck, FiX, FiAlertTriangle
} from 'react-icons/fi';
import useAuthStore from '../../store/authStore';

const ROLE_STYLES = {
  admin: 'text-gold bg-gold/10 border-gold/30',
  user: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

const UsersAdmin = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null); // { id, role }
  const [saving, setSaving] = useState(false);

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await adminAPI.getUsers();
      setUsers(data.users);
    } catch {
      toast.error('Erreur de chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setSaving(true);
    try {
      const { data } = await adminAPI.createUser(newUser);
      setUsers([...users, data.user]);
      toast.success('Utilisateur créé avec succès');
      setShowModal(false);
      setNewUser({ username: '', email: '', password: '', role: 'admin' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur de création');
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setSaving(true);
    try {
      await adminAPI.updateUserRole(userId, newRole);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success('Rôle mis à jour');
      setEditingRole(null);
    } catch {
      toast.error('Erreur de mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId) => {
    if (userId === currentUser?._id) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte');
      return;
    }
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('Utilisateur supprimé');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur de suppression');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="pb-20">
      <Toaster position="top-right" />

      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-ivory">Utilisateurs</h1>
          <p className="text-muted text-sm mt-1">{users.length} compte(s) enregistré(s)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gold hover:bg-gold-light text-black flex items-center gap-2 py-2 px-4 rounded-xl font-medium transition"
        >
          <FiPlus /> Nouvel utilisateur
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-dark-2 border border-gold-dim rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-black/50 border-b border-gold-dim">
                <th className="p-4 font-medium text-muted text-sm uppercase">Utilisateur</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Email</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Rôle</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Statut</th>
                <th className="p-4 font-medium text-muted text-sm uppercase">Créé le</th>
                <th className="p-4 font-medium text-muted text-sm uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-dim/20">
              {users.map(u => (
                <tr
                  key={u._id}
                  className={`hover:bg-black/20 transition ${u._id === currentUser?._id ? 'bg-gold/5' : ''}`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold font-bold uppercase">
                        {u.username?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="text-ivory font-medium">{u.username}</p>
                        {u._id === currentUser?._id && (
                          <p className="text-xs text-gold/60">Vous</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted text-sm">{u.email}</td>
                  <td className="p-4">
                    {editingRole?.id === u._id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={editingRole.role}
                          onChange={e => setEditingRole({ ...editingRole, role: e.target.value })}
                          className="bg-dark border border-gold-dim rounded px-3 py-1 text-ivory text-sm outline-none focus:border-gold"
                        >
                          <option value="admin">Admin</option>
                          <option value="user">Éditeur</option>
                        </select>
                        <button
                          onClick={() => handleRoleChange(u._id, editingRole.role)}
                          disabled={saving}
                          className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition"
                        >
                          <FiCheck />
                        </button>
                        <button
                          onClick={() => setEditingRole(null)}
                          className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingRole({ id: u._id, role: u.role })}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium transition hover:opacity-80 ${ROLE_STYLES[u.role]}`}
                        title="Cliquer pour modifier le rôle"
                      >
                        {u.role === 'admin' ? <FiShield className="text-xs" /> : <FiUser className="text-xs" />}
                        {u.role === 'admin' ? 'Admin' : 'Éditeur'}
                        <FiEdit2 className="text-xs opacity-60 ml-1" />
                      </button>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-3 py-1 rounded-full border ${
                      u.isActive !== false
                        ? 'text-green-400 bg-green-500/10 border-green-500/20'
                        : 'text-red-400 bg-red-500/10 border-red-500/20'
                    }`}>
                      {u.isActive !== false ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="p-4 text-muted text-sm">
                    {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4 text-right">
                    {u._id !== currentUser?._id ? (
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                        title="Supprimer"
                      >
                        <FiTrash2 />
                      </button>
                    ) : (
                      <span className="p-2 text-muted/30 cursor-not-allowed inline-block" title="Vous ne pouvez pas supprimer votre propre compte">
                        <FiTrash2 />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-muted">Aucun utilisateur trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1520] border border-gold-dim rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif text-gold">Nouvel utilisateur</h2>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-ivory transition">
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-6 flex items-start gap-2 text-amber-400 text-sm">
              <FiAlertTriangle className="mt-0.5 shrink-0" />
              <span>Le mot de passe sera créé directement. Assurez-vous d'utiliser un mot de passe fort.</span>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-muted mb-2">Nom d'utilisateur</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-3 text-ivory outline-none focus:border-gold"
                  placeholder="ex: mahdia_admin"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-muted mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-3 text-ivory outline-none focus:border-gold"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-muted mb-2">Mot de passe</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-3 text-ivory outline-none focus:border-gold"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-muted mb-2">Rôle</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full bg-dark border border-gold-dim rounded-xl px-4 py-3 text-ivory outline-none focus:border-gold appearance-none cursor-pointer"
                >
                  <option value="admin">Admin (accès complet)</option>
                  <option value="user">Éditeur (accès limité)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gold-dim text-muted rounded-xl hover:border-gold/50 hover:text-ivory transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-gold hover:bg-gold-light text-black rounded-xl font-medium transition disabled:opacity-50"
                >
                  {saving ? 'Création…' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin;
