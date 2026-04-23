'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { analysisAPI } from '@/services/api';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Activity, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle,
  Share2,
  Download,
  Clock,
  TrendingUp,
  TrendingDown,
  Heart,
  Shield,
  Brain,
  Zap,
  Phone,
  MessageCircle,
  Hospital
} from 'lucide-react';
import { motion } from 'framer-motion';
import EmergencyAlert from '@/components/EmergencyAlert';
import HospitalSuggestions from '@/components/HospitalSuggestions';
import HealthRiskMeter from '@/components/HealthRiskMeter';
import GlassCard from '@/components/GlassCard';
import { generatePDF, shareViaEmail, shareViaWhatsApp } from '@/services/reportService';
import { getEmergencyNumber, callHospital } from '@/services/hospitalService';

export default function ResultsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEmergency, setShowEmergency] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && params.id) {
      fetchAnalysis();
    }
  }, [user, params.id]);

  // Auto-show emergency alert for critical/high risk
  useEffect(() => {
    if (analysis && (analysis.riskLevel === 'critical' || analysis.riskLevel === 'high')) {
      setShowEmergency(true);
    }
  }, [analysis]);

  const fetchAnalysis = async () => {
    try {
      const response = await analysisAPI.getAnalysis(params.id);
      if (response.data.success) {
        setAnalysis(response.data.analysis);
      }
    } catch (error) {
      console.error('Failed to fetch analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!analysis) return;
    await generatePDF({
      healthScore: analysis.healthScore,
      riskLevel: analysis.riskLevel,
      symptoms: analysis.symptoms,
      conditions: analysis.conditions,
      recommendations: analysis.recommendations,
      hasEmergencyWarning: analysis.hasEmergencyWarning,
      emergencyMessage: analysis.emergencyMessage
    }, 'health-report');
  };

  const handleShareEmail = () => {
    if (!analysis) return;
    shareViaEmail({
      healthScore: analysis.healthScore,
      riskLevel: analysis.riskLevel,
      conditions: analysis.conditions
    });
  };

  const handleShareWhatsApp = () => {
    if (!analysis) return;
    shareViaWhatsApp({
      healthScore: analysis.healthScore,
      riskLevel: analysis.riskLevel,
      conditions: analysis.conditions
    });
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', gradient: 'from-green-500 to-emerald-500' };
      case 'medium': return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', gradient: 'from-yellow-500 to-orange-500' };
      case 'high': return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', gradient: 'from-orange-500 to-red-500' };
      case 'critical': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', gradient: 'from-red-500 to-pink-500' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', gradient: 'from-gray-500 to-slate-500' };
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user || !analysis) return null;

  const risk = getRiskColor(analysis.riskLevel);
  const detectedCondition = analysis.conditions?.[0]?.name || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <Navbar />
      
      {/* Emergency Alert Modal */}
      <EmergencyAlert 
        isOpen={showEmergency} 
        onClose={() => setShowEmergency(false)}
        riskLevel={analysis.riskLevel}
        healthScore={analysis.healthScore}
        customMessage={analysis.emergencyMessage}
      />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-8">
<Link href="/dashboard" className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1 mb-4">
            <ArrowRight className="w-4 h-4 rotate-180" />
            {t('backToDashboard')}
          </Link>
          <h1 className="text-3xl font-heading font-bold text-slate-900">
            {t('analysisResults')}
          </h1>
          <p className="text-slate-600 mt-2">
            {t('yourAiHealthAssessment')}
          </p>
        </div>

        {/* Emergency Warning */}
        {analysis.hasEmergencyWarning && (
<motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-3xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-2">{t('seekImmediateMedicalAttention')}</h3>
                <p className="text-red-600">{analysis.emergencyMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Health Score Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
<div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">{t('healthScoreTitle')}</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${risk.bg} ${risk.text} border ${risk.border}`}>
                  {t(analysis.riskLevel).toUpperCase()} {t('riskLevel').toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center gap-8">
                {/* HealthRiskMeter Component */}
                <HealthRiskMeter 
                  score={analysis.healthScore} 
                  riskLevel={analysis.riskLevel}
                  size="large"
                  showDetails={true}
                />
                
                <div className="flex-1">
                  <p className="text-slate-600 mb-4">{analysis.summary}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <Clock className="w-4 h-4" />
                    {new Date(analysis.createdAt).toLocaleString()}
                  </div>
                  
                  {/* Emergency Call Button */}
                  {(analysis.riskLevel === 'critical' || analysis.riskLevel === 'high') && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
onClick={() => callHospital(getEmergencyNumber())}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <Phone className="w-5 h-5" />
                      {t('callEmergencyNumber')} {getEmergencyNumber()}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
<button onClick={handleShareEmail} className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <Share2 className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-slate-700">{t('shareViaEmail')}</span>
            </button>
            <button onClick={handleShareWhatsApp} className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-slate-700">{t('shareViaWhatsApp')}</span>
            </button>
            <button onClick={handleDownloadPDF} className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <Download className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-slate-700">{t('downloadPdf')}</span>
            </button>
            <Link href="/analyze" className="block w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-2xl font-semibold hover:from-primary-700 hover:to-secondary-600 transition-all">
              <Zap className="w-5 h-5" />
              {t('newAnalysisBtn')}
            </Link>
          </div>
        </div>

{/* Conditions */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-600" />
            {t('possibleConditions')}
          </h2>
          
          <div className="space-y-4">
            {analysis.conditions.map((condition, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">{condition.name}</h3>
                    {condition.isEmergency && <AlertCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  <p className="text-sm text-slate-600">{condition.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{condition.probability}%</div>
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${risk.gradient}`} 
                      style={{ width: `${condition.probability}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

{/* Recommendations */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-600" />
            {t('recommendations')}
          </h2>
          
          <div className="space-y-4">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                {getPriorityIcon(rec.priority)}
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{rec.title}</h3>
                  <p className="text-sm text-slate-600">{rec.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {rec.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Suggestions */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
          <HospitalSuggestions 
            healthIssue={detectedCondition}
            riskLevel={analysis.riskLevel}
            autoFetch={true}
            radius={10000}
          />
        </div>
      </div>
    </div>
  );
}
