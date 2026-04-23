'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Phone, 
  X, 
  MapPin, 
  Clock,
  Shield,
  Heart,
  Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getEmergencyNumber, callEmergency } from '@/services/hospitalService';

export default function EmergencyAlert({ 
  isOpen = false, 
  onClose, 
  riskLevel = 'low',
  healthScore = 0,
  customMessage = null 
}) {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(5);
  const [emergencyNumber, setEmergencyNumber] = useState('102');

  useEffect(() => {
    // Get user's country/region based on browser locale or default to India
    const countryCode = navigator.language?.split('-')[1] || 'IN';
    setEmergencyNumber(getEmergencyNumber(countryCode));
  }, []);

  useEffect(() => {
    if (isOpen && riskLevel === 'critical') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, riskLevel]);

  const handleCall = () => {
    callEmergency(emergencyNumber);
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'critical': return 'from-red-500 to-red-600';
      case 'high': return 'from-orange-500 to-orange-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      default: return 'from-green-500 to-green-600';
    }
  };

  const getRiskGlow = () => {
    switch (riskLevel) {
      case 'critical': return 'shadow-red-500/50';
      case 'high': return 'shadow-orange-500/50';
      case 'medium': return 'shadow-yellow-500/50';
      default: return 'shadow-green-500/50';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20 }}
          className={`relative w-full max-w-lg bg-gradient-to-br ${getRiskColor()} rounded-3xl shadow-2xl ${getRiskGlow()} shadow-lg overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            />
          </div>

          {/* Pulse Effect for Critical */}
          {riskLevel === 'critical' && (
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 0 0 rgba(239, 68, 68, 0.4)',
                  '0 0 0 20px rgba(239, 68, 68, 0)',
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-3xl"
            />
          )}

          {/* Content */}
          <div className="relative p-8 text-white">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                animate={{ 
                  scale: riskLevel === 'critical' ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.5, repeat: riskLevel === 'critical' ? Infinity : 0 }}
                className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm"
              >
                {riskLevel === 'critical' ? (
                  <Zap className="w-10 h-10 animate-pulse" />
                ) : (
                  <AlertTriangle className="w-10 h-10" />
                )}
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {t('emergencyAlert')}
                  {riskLevel === 'critical' && (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="text-red-200"
                    >
                      ⚠️
                    </motion.span>
                  )}
                </h2>
                <p className="text-white/80 text-sm">
                  {riskLevel === 'critical' ? t('seekImmediateCare') : customMessage || t('emergencyAlert')}
                </p>
              </div>
            </div>

            {/* Risk Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80">Health Score</span>
                <span className="text-2xl font-bold">{healthScore}</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    healthScore >= 70 ? 'bg-green-400' :
                    healthScore >= 40 ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-white/60">Risk Level</span>
                <span className="font-semibold uppercase">{riskLevel}</span>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white/80" />
                <div>
                  <p className="text-xs text-white/60">Location</p>
                  <p className="text-sm font-medium">Detecting...</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                <Clock className="w-5 h-5 text-white/80" />
                <div>
                  <p className="text-xs text-white/60">Response</p>
                  <p className="text-sm font-medium">Immediate</p>
                </div>
              </div>
            </div>

            {/* Call Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCall}
              className={`w-full py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all ${
                riskLevel === 'critical' ? 'animate-pulse' : ''
              }`}
            >
              <Phone className="w-6 h-6" />
              {t('callEmergency')}
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                {emergencyNumber}
              </span>
            </motion.button>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2 mt-4 text-white/60 text-sm">
              <Shield className="w-4 h-4" />
              <span>Stay calm, help is on the way</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook for managing emergency state
export const useEmergencyAlert = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    riskLevel: 'low',
    healthScore: 0,
    message: null
  });

  const triggerAlert = (riskLevel, healthScore, message = null) => {
    if (riskLevel === 'critical' || riskLevel === 'high') {
      setAlertData({ riskLevel, healthScore, message });
      setShowAlert(true);
    }
  };

  const dismissAlert = () => {
    setShowAlert(false);
  };

  return {
    showAlert,
    alertData,
    triggerAlert,
    dismissAlert,
    EmergencyAlert: () => (
      <EmergencyAlert
        isOpen={showAlert}
        onClose={dismissAlert}
        riskLevel={alertData.riskLevel}
        healthScore={alertData.healthScore}
        customMessage={alertData.message}
      />
    )
  };
};
