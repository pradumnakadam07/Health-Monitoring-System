'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { healthAPI, analysisAPI } from '@/services/api';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowRight,
  Clock,
  Heart,
  Shield,
  AlertCircle,
  Brain,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [healthScore, setHealthScore] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [scoreRes, historyRes, trendsRes] = await Promise.all([
        healthAPI.getScore(),
        analysisAPI.getHistory({ limit: 3 }),
        healthAPI.getTrends('week')
      ]);
      
      if (scoreRes.data.success) {
        setHealthScore(scoreRes.data);
      }
      if (historyRes.data.success) {
        setRecentAnalyses(historyRes.data.analyses);
      }
      if (trendsRes.data.success) {
        setTrends(trendsRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
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

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'declining': return <TrendingDown className="w-5 h-5 text-red-500" />;
      default: return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const lineChartData = {
    labels: trends?.labels || [t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday'), t('saturday'), t('sunday')],
    datasets: [{
      label: t('healthScoreChart'),
      data: trends?.healthScores || [75, 78, 72, 80, 82, 79, 85],
      borderColor: '#0d9488',
      backgroundColor: 'rgba(13, 148, 136, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#0d9488',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
    }]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: '#e2e8f0' },
        ticks: { color: '#64748b' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' }
      }
    }
  };

  const doughnutData = {
    labels: [t('riskLow'), t('riskMedium'), t('riskHigh'), t('riskCritical')],
    datasets: [{
      data: [
        healthScore?.riskBreakdown?.low || 45,
        healthScore?.riskBreakdown?.medium || 30,
        healthScore?.riskBreakdown?.high || 18,
        healthScore?.riskBreakdown?.critical || 7
      ],
      backgroundColor: ['#10b981', '#f59e0b', '#f97316', '#ef4444'],
      borderWidth: 0,
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, usePointStyle: true }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-slate-900">
            {t('welcomeBack')}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-600 mt-2">
            {t('healthOverview')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-slate-900">{t('realtimeHealthScore')}</h2>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                    <Zap className="w-3 h-3" />
                    {t('live')}
                  </div>
                </div>
                <p className="text-sm text-slate-500">{t('aiPoweredAssessment')}</p>
              </div>
              {healthScore?.trend && getTrendIcon(healthScore.trend)}
            </div>
            
            {healthScore?.healthScore !== undefined ? (
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="relative">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="80" stroke="#e2e8f0" strokeWidth="16" fill="none" />
                    <circle
                      cx="96" cy="96" r="80"
                      stroke="url(#dashGrad)"
                      strokeWidth="16"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(healthScore.healthScore / 100) * 502.4} 502.4`}
                    />
                    <defs>
                      <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0d9488" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-slate-900">{healthScore.healthScore}</span>
                    <span className="text-sm text-slate-500">/ 100</span>
                  </div>
                </div>
                
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      healthScore.healthScore >= 70 ? 'bg-green-100 text-green-700' :
                      healthScore.healthScore >= 40 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {healthScore.healthScore >= 70 ? t('goodHealth') : healthScore.healthScore >= 40 ? t('fairHealth') : t('needsAttention')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs text-slate-500 mb-1">{t('symptomScore')}</p>
                      <p className="text-xl font-bold text-slate-900">78</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs text-slate-500 mb-1">{t('lifestyleScore')}</p>
                      <p className="text-xl font-bold text-slate-900">82</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-600">
                    {t('basedOnAnalyses', { count: healthScore.totalAnalyses })}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">{t('noHealthData')}</p>
                <Link href="/analyze" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700">
                  {t('startFirstAnalysis')}
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center">
                  <Activity className="w-7 h-7 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t('totalAnalyses')}</p>
                  <p className="text-3xl font-bold text-slate-900">{healthScore?.totalAnalyses || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-secondary-100 rounded-2xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t('riskLevel')}</p>
                  <p className="text-3xl font-bold text-slate-900 capitalize">
                    {healthScore?.lastAnalysis?.riskLevel || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t('aiConfidence')}</p>
                  <p className="text-3xl font-bold text-slate-900">92%</p>
                </div>
              </div>
            </div>

            <Link href="/analyze" className="block w-full py-4 bg-gradient-to-r from-primary-600 to-secondary-500 text-white text-center font-semibold rounded-2xl hover:from-primary-700 hover:to-secondary-600 transition-all shadow-lg">
              {t('newAnalysis')}
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{t('healthTrends')}</h3>
                <p className="text-sm text-slate-500">{t('healthTrendsDesc')}</p>
              </div>
              <BarChart3 className="w-5 h-5 text-slate-400" />
            </div>
            <div className="h-64">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{t('riskDistribution')}</h3>
                <p className="text-sm text-slate-500">{t('riskDistributionDesc')}</p>
              </div>
              <Brain className="w-5 h-5 text-slate-400" />
            </div>
            <div className="h-64">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">{t('recentAnalyses')}</h2>
            <Link href="/history" className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
              {t('viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentAnalyses.length > 0 ? (
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  href={`/results/${analysis.id}`}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Activity className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {analysis.symptoms?.slice(0, 2).map(s => s.name).join(', ')}
                        {analysis.symptoms?.length > 2 && ` +${analysis.symptoms.length - 2}`}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(analysis.riskLevel)}`}>
                      {analysis.riskLevel}
                    </span>
                    <span className="text-2xl font-bold text-slate-900">{analysis.healthScore}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">{t('noAnalysesYet')}</p>
              <Link href="/analyze" className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700">
                {t('startYourFirstAnalysis')} <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-6 text-white">
            <Heart className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('stayActive')}</h3>
            <p className="text-primary-100 text-sm">
              {t('stayActiveDesc')}
            </p>
          </div>
          <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-3xl p-6 text-white">
            <Shield className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('preventiveCare')}</h3>
            <p className="text-secondary-100 text-sm">
              {t('preventiveCareDesc')}
            </p>
          </div>
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-6 text-white">
            <Activity className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('monitorSymptoms')}</h3>
            <p className="text-teal-100 text-sm">
              {t('monitorSymptomsDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
