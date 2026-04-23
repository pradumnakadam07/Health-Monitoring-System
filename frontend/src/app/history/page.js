'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { analysisAPI } from '@/services/api';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Activity, 
  Clock, 
  Filter,
  Search,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [analyses, setAnalyses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, pagination.page, filter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = { 
        page: pagination.page, 
        limit: pagination.limit 
      };
      if (filter) params.risk_level = filter;
      
      const response = await analysisAPI.getHistory(params);
      if (response.data.success) {
        setAnalyses(response.data.analyses);
        setPagination(prev => ({ ...prev, ...response.data.pagination }));
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalysis = async (id) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return;
    
    try {
      await analysisAPI.deleteAnalysis(id);
      fetchHistory();
    } catch (error) {
      console.error('Failed to delete analysis:', error);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredAnalyses = analyses.filter(a => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return a.symptoms?.some(s => s.name.toLowerCase().includes(search));
  });

// Chart data
  const chartData = {
    labels: filteredAnalyses.slice(0, 7).reverse().map((_, i) => `${t('analysis')} ${i + 1}`),
    datasets: [{
      label: t('healthScore'),
      data: filteredAnalyses.slice(0, 7).reverse().map(a => a.healthScore),
      borderColor: '#0d9488',
      backgroundColor: 'rgba(13, 148, 136, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, max: 100, grid: { color: '#e2e8f0' } },
      x: { grid: { display: false } }
    }
  };

  if (authLoading || loading && !analyses.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
<div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-slate-900">
            {t('analysisHistory')}
          </h1>
          <p className="text-slate-600 mt-2">
            {t('healthTrendsDesc')}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">{t('totalAnalysesHistory')}</p>
            <p className="text-3xl font-bold text-slate-900">{pagination.total}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">{t('avgHealthScore')}</p>
            <p className="text-3xl font-bold text-slate-900">
              {analyses.length > 0 
                ? Math.round(analyses.reduce((sum, a) => sum + a.healthScore, 0) / analyses.length)
                : 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">{t('latestRisk')}</p>
            <p className="text-3xl font-bold text-slate-900 capitalize">
              {analyses[0]?.riskLevel || t('na')}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">{t('trend')}</p>
            <div className="flex items-center gap-2">
              {analyses.length >= 2 ? (
                analyses[0].healthScore > analyses[analyses.length - 1].healthScore ? (
                  <>
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    <p className="text-2xl font-bold text-green-600">{t('improving')}</p>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-6 h-6 text-red-500" />
                    <p className="text-2xl font-bold text-red-600">{t('declining')}</p>
                  </>
                )
              ) : (
                <p className="text-2xl font-bold text-slate-900">-</p>
              )}
            </div>
          </div>
        </div>

        {/* Chart */}
        {analyses.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('healthScoreTrend')}</h2>
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchBySymptom')}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">{t('allRisks')}</option>
              <option value="low">{t('low')}</option>
              <option value="medium">{t('medium')}</option>
              <option value="high">{t('high')}</option>
              <option value="critical">{t('critical')}</option>
            </select>
          </div>
        </div>

        {/* History List */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
          {filteredAnalyses.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredAnalyses.map((analysis) => (
                <div key={analysis.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <Link href={`/results/${analysis.id}`} className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                          <Activity className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {analysis.symptoms?.slice(0, 2).map(s => s.name).join(', ')}
                            {analysis.symptoms?.length > 2 && ` +${analysis.symptoms.length - 2} more`}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(analysis.createdAt).toLocaleDateString()}
                            </span>
{analysis.hasEmergencyWarning && (
                              <span className="flex items-center gap-1 text-red-500">
                                <AlertCircle className="w-4 h-4" />
                                {t('warning')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center gap-4">
<span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getRiskColor(analysis.riskLevel)}`}>
                        {t(analysis.riskLevel)}
                      </span>
                      <span className="text-2xl font-bold text-slate-900">{analysis.healthScore}</span>
                      <button
                        onClick={() => deleteAnalysis(analysis.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
<div className="text-center py-12">
              <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">{t('noAnalysesFound')}</p>
              <Link href="/analyze" className="text-primary-600 font-medium hover:text-primary-700">
                {t('startYourFirstAnalysis')}
              </Link>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {t('showing')} {((pagination.page - 1) * pagination.limit) + 1} {t('to')} {Math.min(pagination.page * pagination.limit, pagination.total)} {t('ofText')} {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg font-medium">
                  {pagination.page}
                </span>
                <button
                  onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
