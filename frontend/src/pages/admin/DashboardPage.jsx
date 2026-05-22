import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminAPI } from '../../api';
import { FiImage, FiFileText, FiStar, FiClock, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import dayjs from 'dayjs';

const DashboardPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  const statCards = [
    { title: t('admin.total_pieces') || 'Pièces (Publiées/Brouillons)', value: `${stats?.publishedPieces || 0} / ${stats?.draftPieces || 0}`, icon: <FiFileText />, color: 'text-blue-400' },
    { title: 'Légendes', value: stats?.totalLegends || 0, icon: <FiStar />, color: 'text-gold' },
    { title: 'Images Uploadées', value: stats?.totalImages || 0, icon: <FiImage />, color: 'text-green-400' },
  ];

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif text-ivory">{t('admin.dashboard') || 'Tableau de Bord'}</h1>
        
        <div className="flex gap-4">
          <Link
            to="/admin/pieces/new"
            className="flex items-center gap-2 bg-gold hover:bg-gold-light text-black px-4 py-2 rounded-xl transition font-medium"
          >
            <FiPlus /> Nouvelle pièce
          </Link>
          <Link
            to="/admin/legends/new"
            className="flex items-center gap-2 bg-dark-2 hover:bg-dark-3 text-ivory border border-gold-dim px-4 py-2 rounded-xl transition font-medium"
          >
            <FiPlus /> Nouvelle légende
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-dark-2 border border-gold-dim rounded-2xl p-6 flex items-center gap-6">
            <div className={`w-14 h-14 rounded-full bg-black flex items-center justify-center text-2xl ${stat.color} border border-gold-dim`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-muted text-sm">{stat.title}</p>
              <p className="text-3xl font-serif text-ivory mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-dark-2 border border-gold-dim rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gold-dim flex items-center gap-3">
          <FiClock className="text-gold text-xl" />
          <h2 className="text-xl font-serif text-ivory">5 dernières pièces modifiées</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/50 text-muted text-sm border-b border-gold-dim/50">
              <tr>
                <th className="px-6 py-4 font-medium">Nom</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium">Date de modification</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-dim/20">
              {stats?.latestPieces?.map((piece) => (
                <tr key={piece._id} className="hover:bg-black/20 transition">
                  <td className="px-6 py-4 text-ivory">
                    <div className="flex items-center gap-3">
                      {piece.thumbnailUrl ? (
                        <img src={piece.thumbnailUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-gold-dim/30" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center border border-gold-dim/30">
                          <FiImage className="text-muted" />
                        </div>
                      )}
                      <span>{piece.name?.fr || 'Sans nom'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {piece.isPublished ? (
                      <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/20">Publié</span>
                    ) : (
                      <span className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-xs font-medium border border-orange-500/20">Brouillon</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted text-sm">
                    {dayjs(piece.updatedAt).format('DD/MM/YYYY HH:mm')}
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/admin/pieces/${piece._id}/edit`} className="text-gold hover:text-gold-light transition text-sm font-medium">
                      Éditer
                    </Link>
                  </td>
                </tr>
              ))}
              {stats?.latestPieces?.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-muted">
                    Aucune pièce trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
