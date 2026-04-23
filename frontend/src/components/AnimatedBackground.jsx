'use client';

import { motion } from 'framer-motion';

const AnimatedBackground = ({ children, variant = 'default' }) => {
  const variants = {
    default: {
      orbs: [
        { size: 300, x: '10%', y: '20%', color: 'from-teal-400/30 to-teal-600/20', duration: 15 },
        { size: 400, x: '80%', y: '10%', color: 'from-indigo-400/30 to-indigo-600/20', duration: 18 },
        { size: 250, x: '60%', y: '60%', color: 'from-emerald-400/25 to-emerald-600/15', duration: 20 },
        { size: 350, x: '20%', y: '70%', color: 'from-amber-400/25 to-amber-600/15', duration: 22 },
      ],
      particles: 20,
    },
    subtle: {
      orbs: [
        { size: 200, x: '15%', y: '25%', color: 'from-teal-400/20 to-teal-600/10', duration: 12 },
        { size: 250, x: '75%', y: '15%', color: 'from-indigo-400/20 to-indigo-600/10', duration: 15 },
        { size: 180, x: '50%', y: '65%', color: 'from-emerald-400/15 to-emerald-600/10', duration: 18 },
      ],
      particles: 12,
    },
    hero: {
      orbs: [
        { size: 400, x: '5%', y: '15%', color: 'from-teal-400/40 to-teal-600/25', duration: 12 },
        { size: 500, x: '85%', y: '5%', color: 'from-indigo-400/40 to-indigo-600/25', duration: 15 },
        { size: 350, x: '70%', y: '50%', color: 'from-emerald-400/35 to-emerald-600/20', duration: 18 },
        { size: 300, x: '15%', y: '65%', color: 'from-amber-400/30 to-amber-600/20', duration: 20 },
        { size: 280, x: '45%', y: '80%', color: 'from-rose-400/25 to-rose-600/15', duration: 16 },
      ],
      particles: 25,
    },
    auth: {
      orbs: [
        { size: 280, x: '10%', y: '20%', color: 'from-teal-400/25 to-teal-600/15', duration: 14 },
        { size: 320, x: '80%', y: '10%', color: 'from-indigo-400/25 to-indigo-600/15', duration: 16 },
        { size: 200, x: '60%', y: '70%', color: 'from-emerald-400/20 to-emerald-600/10', duration: 18 },
      ],
      particles: 15,
    },
  };

  const config = variants[variant] || variants.default;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 animate-mesh-gradient opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-100/50 via-transparent to-indigo-100/50" />
      </div>

      {/* Floating Orbs */}
      {config.orbs.map((orb, index) => (
        <motion.div
          key={`orb-${index}`}
          className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl`}
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -30, 20, -10, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 2,
          }}
        />
      ))}

      {/* Particle System */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(config.particles)].map((_, i) => {
          const size = Math.random() * 4 + 2;
          const duration = Math.random() * 20 + 15;
          const delay = Math.random() * 5;
          const left = `${Math.random() * 100}%`;
          
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-teal-400/40 to-indigo-400/40"
              style={{
                width: size,
                height: size,
                left,
                bottom: '-10px',
              }}
              animate={{
                y: [0, -window.innerHeight - 100],
                x: [0, Math.sin(i) * 50, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
                delay,
              }}
            />
          );
        })}
      </div>

      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(15, 23, 42) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
