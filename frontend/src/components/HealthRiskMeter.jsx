'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Heart,
  Shield,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HealthRiskMeter({ 
  score = 0, 
  riskLevel = 'low',
  showDetails = true,
  size = 'medium',
  animated = true 
}) {
  const { t } = useTranslation();
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (animated) {
      // Animate the score counting up
      const duration = 1500;
      const steps = 30;
      const increment = score / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    } else {
      setDisplayScore(score);
    }
  }, [score, animated]);

  const getColor = () => {
    if (displayScore >= 70) return { 
      primary: '#10b981', 
      secondary: '#34d399',
      gradient: 'from-green-400 to-emerald-500',
      bg: 'bg-green-50',
      text: 'text-green-600'
    };
    if (displayScore >= 40) return { 
      primary: '#f59e0b', 
      secondary: '#fbbf24',
      gradient: 'from-yellow-400 to-amber-500',
      bg: 'bg-yellow-50',
      text: 'text-yellow-600'
    };
    return { 
      primary: '#ef4444', 
      secondary: '#f87171',
      gradient: 'from-red-400 to-rose-500',
      bg: 'bg-red-50',
      text: 'text-red-600'
    };
  };

  const getRiskConfig = () => {
    switch (riskLevel) {
      case 'critical':
        return {
          icon: Zap,
          label: t('critical'),
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          pulse: true
        };
      case 'high':
        return {
          icon: AlertTriangle,
          label: t('high'),
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          pulse: false
        };
      case 'medium':
        return {
          icon: Minus,
          label: t('medium'),
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          pulse: false
        };
      default:
        return {
          icon: Shield,
          label: t('low'),
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          pulse: false
        };
    }
  };

  const colors = getColor();
  const riskConfig = getRiskConfig();
  const RiskIcon = riskConfig.icon;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const sizeClasses = {
    small: { width: 100, strokeWidth: 6, fontSize: 'text-xl' },
    medium: { width: 160, strokeWidth: 10, fontSize: 'text-4xl' },
    large: { width: 220, strokeWidth: 12, fontSize: 'text-5xl' }
  };

  const config = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        {/* Background Circle */}
        <svg 
          className="transform -rotate-90" 
          width={config.width} 
          height={config.width}
        >
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={45}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={config.strokeWidth}
          />
          {/* Progress Circle */}
          <motion.circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={45}
            fill="none"
            stroke={colors.primary}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              strokeDasharray: circumference,
            }}
          />
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor={colors.secondary} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className={`${config.fontSize} font-bold text-slate-800`}
          >
            {displayScore}
          </motion.span>
          <span className="text-xs text-slate-500">/ 100</span>
        </div>
      </div>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`mt-4 flex items-center gap-2 px-4 py-2 ${riskConfig.bgColor} rounded-full`}
        >
          {riskConfig.pulse && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <RiskIcon className={`w-4 h-4 ${riskConfig.color}`} />
            </motion.div>
          )}
          {!riskConfig.pulse && (
            <RiskIcon className={`w-4 h-4 ${riskConfig.color}`} />
          )}
          <span className={`text-sm font-semibold ${riskConfig.color}`}>
            {riskConfig.label} {t('riskLevel')}
          </span>
        </motion.div>
      )}

      {/* Score Details */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 grid grid-cols-2 gap-4 w-full max-w-xs"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-1">
              <Activity className="w-3 h-3" />
              Symptom Score
            </div>
            <div className="text-lg font-bold text-slate-700">
              {Math.max(0, displayScore - 5)}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-1">
              <Heart className="w-3 h-3" />
              Lifestyle
            </div>
            <div className="text-lg font-bold text-slate-700">
              {Math.min(100, displayScore + 8)}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Animated Risk Badge Component
export function RiskBadge({ riskLevel, score, size = 'medium' }) {
  const { t } = useTranslation();
  
  const getConfig = () => {
    switch (riskLevel) {
      case 'critical':
        return {
          gradient: 'from-red-500 to-rose-600',
          icon: Zap,
          animate: true
        };
      case 'high':
        return {
          gradient: 'from-orange-500 to-red-500',
          icon: AlertTriangle,
          animate: false
        };
      case 'medium':
        return {
          gradient: 'from-yellow-500 to-amber-500',
          icon: Minus,
          animate: false
        };
      default:
        return {
          gradient: 'from-green-500 to-emerald-600',
          icon: Shield,
          animate: false
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${config.gradient} text-white rounded-full shadow-lg`}
    >
      {config.animate ? (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      ) : (
        <Icon className="w-5 h-5" />
      )}
      <span className="font-semibold">
        {t(riskLevel)} - {score}%
      </span>
    </motion.div>
  );
}
