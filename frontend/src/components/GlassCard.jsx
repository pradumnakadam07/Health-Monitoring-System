'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * GlassCard - A modern glassmorphism card component
 * Perfect for creating elegant, translucent UI elements
 */
export default function GlassCard({ 
  children, 
  className = '',
  hover = true,
  gradient = false,
  glowColor = 'primary',
  padding = 'normal',
  onClick,
  ...props 
}) {
  const { t } = useTranslation();

  const glowColors = {
    primary: 'hover:shadow-primary-500/20',
    secondary: 'hover:shadow-secondary-500/20',
    green: 'hover:shadow-green-500/20',
    red: 'hover:shadow-red-500/20',
    yellow: 'hover:shadow-yellow-500/20',
  };

  const paddingClasses = {
    none: '',
    small: 'p-3',
    normal: 'p-6',
    large: 'p-8',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { 
        y: -5,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      } : {}}
      onClick={onClick}
      className={`
        relative rounded-3xl overflow-hidden
        ${gradient ? 'bg-gradient-to-br from-white/80 to-white/40' : 'bg-white/70'}
        backdrop-blur-xl
        border border-white/30
        shadow-lg
        ${glowColors[glowColor] || glowColors.primary}
        ${paddingClasses[padding] || paddingClasses.normal}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Subtle gradient overlay for glass effect */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      )}
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// Glass Button Component
export function GlassButton({ 
  children, 
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) {
  const variants = {
    primary: 'from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700',
    secondary: 'from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700',
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-5 py-2.5 text-base',
    large: 'px-7 py-3.5 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-2xl
        bg-gradient-to-r ${variants[variant]} ${sizes[size]}
        shadow-lg hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </>
      )}
    </motion.button>
  );
}

// Glass Input Component
export function GlassInput({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 
            ${Icon ? 'pl-12' : ''}
            bg-white/50 backdrop-blur-sm
            border border-slate-200 rounded-xl
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
          `}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// Glass Modal Component
export function GlassModal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'medium' 
}) {
  if (!isOpen) return null;

  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    full: 'max-w-4xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${sizes[size]} bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden`}
      >
        {title && (
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Glass Badge Component
export function GlassBadge({ 
  children, 
  variant = 'primary',
  size = 'medium',
  className = '' 
}) {
  const variants = {
    primary: 'bg-primary-100 text-primary-700 border-primary-200',
    secondary: 'bg-secondary-100 text-secondary-700 border-secondary-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full border
      ${variants[variant]} ${sizes[size]} ${className}
    `}>
      {children}
    </span>
  );
}
