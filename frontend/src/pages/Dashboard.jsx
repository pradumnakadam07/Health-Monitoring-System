import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { healthAPI, analysisAPI } from '../services/api';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertCircle,
  ArrowRight,
  Clock,
  Heart,
  Shield
} from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedBackground from '../components/AnimatedBackground';

const Dashboard = () => {
  const { user } = useAuth();
  const [healthScore, setHealthScore] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [scoreRes, historyRes] = await Promise.all([
        healthAPI.getScore(),
        analysisAPI.getHistory({ limit: 3 })
      ]);
      
      if (scoreRes.data.success) {
        setHealthScore(scoreRes.data);
      }
      if (historyRes.data.success) {
        setRecentAnalyses(historyRes.data.analyses);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'declining': return <TrendingDown className="w-5 h-5 text-red-500" />;
      default: return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-slate-900">
            Welcome, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-600 mt-2">
            Here's an overview of your health status
          </p>
        </div>

        {/* Health Score Card */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Health Score</h2>
                <p className="text-sm text-slate-500">Based on your recent analyses</p>
              </div>
              {healthScore?.trend && getTrendIcon(healthScore.trend)}
            </div>
            
            {healthScore?.healthScore !== null ? (
              <div className="flex items-center gap-8">
                <div className="relative">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="70"
                      cy="70"
                      r="60"
                      stroke="#e2e8f0"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r="60"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(healthScore.healthScore / 100) * 377} 377`}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0d9488" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-slate-900">{healthScore.healthScore}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        healthScore.healthScore >= 70 ? 'bg-green-100 text-green-700' :
                        healthScore.healthScore >= 40 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {healthScore.healthScore >= 70 ? 'Good' : healthScore.healthScore >= 40 ? 'Fair' : 'Needs Attention'}
                      </div>
                      {healthScore.trend && (
                        <span className="text-sm text-slate-500 capitalize">
                          {healthScore.trend} trend
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600">
                      Based on {healthScore.totalAnalyses} analysis{healthScore.totalAnalyses !== 1 ? 's' : ''}
                    </p>
                    {healthScore.lastAnalysis && (
                      <p className="text-sm text-slate-500">
                        Last analyzed: {new Date(healthScore.lastAnalysis.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">No health data yet</p>
                <Link
                  to="/analyze"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Start Your First Analysis
                </Link>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Analyses</p>
                  <p className="text-2xl font-bold text-slate-900">{healthScore?.totalAnalyses || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Risk Level</p>
                  <p className="text-2xl font-bold text-slate-900 capitalize">
                    {healthScore?.lastAnalysis?.riskLevel || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/analyze"
              className="block w-full py-4 bg-gradient-to-r from-primary-600 to-secondary-500 text-white text-center font-semibold rounded-2xl hover:from-primary-700 hover:to-secondary-600 transition-all shadow-lg hover:shadow-xl"
            >
              New Analysis
            </Link>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Recent Analyses</h2>
            <Link
              to="/history"
              className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentAnalyses.length > 0 ? (
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  to={`/results/${analysis.id}`}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Activity className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {analysis.symptoms?.map(s => s.name).slice(0, 2).join(', ')}
                        {analysis.symptoms?.length > 2 && ` +${analysis.symptoms.length - 2}`}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(analysis.riskLevel)}`}>
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
              <p className="text-slate-600 mb-4">No analyses yet</p>
              <Link
                to="/analyze"
                className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
              >
                Start your first analysis <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}
        </div>

        {/* Health Tips */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-6 text-white">
            <Heart className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Stay Active</h3>
            <p className="text-primary-100 text-sm">
              Aim for at least 150 minutes of moderate exercise per week.
            </p>
          </div>
          <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-3xl p-6 text-white">
            <Shield className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Preventive Care</h3>
            <p className="text-secondary-100 text-sm">
              Regular check-ups can catch health issues early.
            </p>
          </div>
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-6 text-white">
            <Activity className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Monitor Symptoms</h3>
            <p className="text-teal-100 text-sm">
              Track your health trends to understand your body better.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
