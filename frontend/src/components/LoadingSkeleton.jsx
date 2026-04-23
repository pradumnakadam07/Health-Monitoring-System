'use client';

import { motion } from 'framer-motion';

/**
 * LoadingSkeleton - Modern animated loading placeholders
 * Provides elegant skeleton loading states for better UX
 */
export default function LoadingSkeleton({ 
  variant = 'rectangular',
  width = '100%',
  height = '20px',
  className = '',
  count = 1,
  spacing = 'mb-4'
}) {
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    rounded: 'rounded-xl',
    text: 'rounded',
  };

  const skeletons = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {skeletons.map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.3 }}
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            delay: index * 0.1
          }}
          className={`
            bg-slate-200 ${variants[variant]} ${spacing}
            ${className}
          `}
          style={{ 
            width, 
            height,
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </>
  );
}

// Card Skeleton for dashboard
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
      <LoadingSkeleton width="60%" height="24px" spacing="mb-4" />
      <LoadingSkeleton width="40%" height="40px" spacing="mb-4" />
      <LoadingSkeleton width="80%" height="16px" spacing="mb-2" />
      <LoadingSkeleton width="70%" height="16px" spacing="mb-2" />
      <LoadingSkeleton width="90%" height="16px" />
    </div>
  );
}

// Chart Skeleton
export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
      <LoadingSkeleton width="40%" height="24px" spacing="mb-6" />
      <LoadingSkeleton width="100%" height="200px" variant="rounded" />
    </div>
  );
}

// List Skeleton
export function ListSkeleton({ items = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl">
          <LoadingSkeleton variant="circular" width="48px" height="48px" spacing="mb-0" />
          <div className="flex-1">
            <LoadingSkeleton width="60%" height="16px" spacing="mb-2" />
            <LoadingSkeleton width="40%" height="12px" spacing="mb-0" />
          </div>
          <LoadingSkeleton width="80px" height="32px" variant="rounded" spacing="mb-0" />
        </div>
      ))}
    </div>
  );
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
      <div className="flex items-center gap-6 mb-6">
        <LoadingSkeleton variant="circular" width="80px" height="80px" spacing="mb-0" />
        <div className="flex-1">
          <LoadingSkeleton width="40%" height="24px" spacing="mb-2" />
          <LoadingSkeleton width="60%" height="16px" spacing="mb-0" />
        </div>
      </div>
      <LoadingSkeleton width="100%" height="1px" spacing="mb-6" />
      <div className="grid grid-cols-2 gap-4">
        <LoadingSkeleton width="100%" height="60px" variant="rounded" />
        <LoadingSkeleton width="100%" height="60px" variant="rounded" />
        <LoadingSkeleton width="100%" height="60px" variant="rounded" />
        <LoadingSkeleton width="100%" height="60px" variant="rounded" />
      </div>
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="grid gap-4 p-4 bg-slate-50 border-b border-slate-200" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }, (_, i) => (
          <LoadingSkeleton key={i} width="80%" height="16px" spacing="mb-0" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div 
          key={rowIndex} 
          className="grid gap-4 p-4 border-b border-slate-100" 
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }, (_, colIndex) => (
            <LoadingSkeleton key={colIndex} width="90%" height="16px" spacing="mb-0" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Chat Message Skeleton
export function ChatMessageSkeleton({ isUser = false }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-end gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <LoadingSkeleton variant="circular" width="32px" height="32px" spacing="mb-0" />
        <LoadingSkeleton 
          width="200px" 
          height="60px" 
          variant="rounded" 
          spacing="mb-0"
        />
      </div>
    </div>
  );
}

// AI Thinking Animation
export function AIThinkingAnimation() {
  return (
    <div className="flex items-center gap-2 p-4">
      <motion.div
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="w-3 h-3 bg-primary-500 rounded-full"
      />
      <motion.div
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        className="w-3 h-3 bg-primary-500 rounded-full"
      />
      <motion.div
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        className="w-3 h-3 bg-primary-500 rounded-full"
      />
    </div>
  );
}

// Pulse Dot for live indicators
export function PulseDot({ color = 'green', size = 'medium' }) {
  const sizes = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4',
  };

  const colors = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
  };

  return (
    <span className="relative flex h-3 w-3">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors[color]} opacity-75`} />
      <span className={`relative inline-flex rounded-full h-3 w-3 ${colors[color]}`} />
    </span>
  );
}
