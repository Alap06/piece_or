import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { piecesAPI } from '../../api';
import { FiEye, FiImage, FiMail, FiFileText } from 'react-icons/fi';
import Loader from '../../components/Loader';

const DashboardPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await piecesAPI.getStats();
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
    { title: t('admin.total_pieces'), value: stats?.totalPieces || 0, icon: <FiImage />, color: 'text-blue-400' },
    { title: t('admin.published'), value: stats?.publishedPieces || 0, icon: <FiFileText />, color: 'text-green-400' },
    { title: t('admin.drafts'), value: stats?.draftPieces || 0, icon: <FiFileText />, color: 'text-orange-400' },
    { title: t('admin.total_views'), value: stats?.totalViews || 0, icon: <FiEye />, color: 'text-gold' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-serif text-ivory mb-8">{t('admin.dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
};

export default DashboardPage;
