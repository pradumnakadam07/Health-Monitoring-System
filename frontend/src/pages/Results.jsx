import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analysisAPI } from '../services/api';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Share2,
  Download,
  Clock,
  TrendingUp,
  MessageSquare,
  Heart,
  Shield,
  Dumbbell,
  Utensils
} from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const Results = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      const response = await analysisAPI.getAnalysis(id);
      if (response.data.success) {
        setAnalysis(response.data.analysis);
      }
    } catch (error) {
      console.error('Failed to fetch analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return { bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-500' };
      case 'medium': return { bg: 'bg-yellow-100', text: 'text-yellow-700', ring: 'ring-yellow-500' };
      case 'high': return { bg: 'bg-orange-100', text: 'text-orange-700', ring: 'ring-orange-500' };
      case 'critical': return { bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-500' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', ring: 'ring-gray-500' };
    }
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'consultation': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'lifestyle': return <Heart className="w-5 h-5 text-green-500" />;
      case 'exercise': return <Dumbbell className="w-5 h-5 text-purple-500" />;
      case 'diet': return <Utensils className="w-5 h-5 text-orange-500" />;
      default: return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
        <Navbar />
        <div className="pt-24 pb-12 px-4 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Analysis not found</h2>
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const riskColors = getRiskColor(analysis.riskLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Emergency Warning */}
        {analysis.hasEmergencyWarning && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-3xl">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold text-red-700 mb-2">Seek Immediate Medical Attention</h2>
                <p className="text-red-600">{analysis.emergencyMessage}</p>
                <a 
                  href="tel:911" 
                  className="inline-block mt-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700"
                >
                  Call Emergency Services
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Main Result Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Health Score Gauge */}
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#e2e8f0"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke={analysis.healthScore >= 70 ? '#10b981' : analysis.healthScore >= 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="16"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(analysis.healthScore / 100) * 502} 502`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-slate-900">{analysis.healthScore}</span>
                  <span className="text-slate-500">Health Score</span>
                </div>
              </div>
            </div>

            {/* Result Summary */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-4 py-2 rounded-full text-lg font-semibold ${riskColors.bg} ${riskColors.text}`}>
                  {analysis.riskLevel.toUpperCase()} RISK
                </span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(analysis.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-2xl font-heading font-bold text-slate-900 mb-4">
                Your Health Assessment
              </h1>

              <p className="text-slate-600 mb-6 leading-relaxed">
                {analysis.summary}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <Link 
                  to="/analyze"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                >
                  New Analysis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Conditions */}
        {analysis.conditions && analysis.conditions.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              Possible Conditions
            </h2>
            
            <div className="space-y-4">
              {analysis.conditions.map((condition, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-slate-900">{condition.name}</h3>
                      {condition.isEmergency && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                          Urgent
                        </span>
                      )}
                    </div>
                    <span className="text-lg font-bold text-primary-600">
                      {condition.probability}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all"
                      style={{ width: `${condition.probability}%` }}
                    />
                  </div>
                  {condition.description && (
                    <p className="text-sm text-slate-500 mt-2">{condition.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary-600" />
              Recommendations
            </h2>
            
            <div className="space-y-4">
              {analysis.recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-xl border ${
                    rec.priority === 'high' 
                      ? 'bg-red-50 border-red-100' 
                      : rec.priority === 'medium'
                      ? 'bg-yellow-50 border-yellow-100'
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getRecommendationIcon(rec.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{rec.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      rec.priority === 'high' ? 'bg-red-200 text-red-700' :
                      rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-700' :
                      'bg-slate-200 text-slate-600'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-slate-100 rounded-xl">
          <p className="text-sm text-slate-500 text-center">
            ⚠️ This is an AI-powered preliminary assessment and should not be considered as medical advice. 
            Always consult with a qualified healthcare professional for proper diagnosis and treatment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Results;
