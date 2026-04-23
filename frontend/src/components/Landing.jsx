'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Shield, 
  Brain, 
  Heart, 
  ArrowRight, 
  CheckCircle2,
  Star,
  Menu,
  X,
  Users,
  TrendingUp,
  Award,
  Stethoscope,
  ActivitySquare
} from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your symptoms for accurate risk assessment.'
    },
    {
      icon: Shield,
      title: 'Early Warning System',
      description: 'Get early warnings about potential health risks before they become serious.'
    },
    {
      icon: Heart,
      title: 'Personalized Insights',
      description: 'Receive tailored recommendations based on your unique health profile.'
    },
    {
      icon: TrendingUp,
      title: 'Health Tracking',
      description: 'Monitor your health trends over time with interactive charts and analytics.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Enter Your Symptoms',
      description: 'Select your symptoms from our comprehensive database or describe what you\'re feeling.'
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Our AI engine processes your symptoms, lifestyle factors, and health history.'
    },
    {
      number: '03',
      title: 'Get Your Results',
      description: 'Receive instant risk assessment with detailed recommendations and next steps.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Healthcare Professional',
      content: 'HealthAI has revolutionized how I monitor my patients\' health. The early warning system is incredibly accurate.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Tech Entrepreneur',
      content: 'The symptom analysis is surprisingly accurate. It helped me catch a potential issue early.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Fitness Coach',
      content: 'I recommend HealthAI to all my clients. The personalized insights are invaluable for preventive health.',
      rating: 5
    }
  ];

  // Floating medical icons for background decoration
  const floatingIcons = [
    { Icon: Stethoscope, size: 24, x: '5%', y: '15%', delay: 0 },
    { Icon: Activity, size: 20, x: '90%', y: '20%', delay: 1 },
    { Icon: ActivitySquare, size: 22, x: '85%', y: '75%', delay: 2 },
    { Icon: Heart, size: 26, x: '10%', y: '80%', delay: 3 },
    { Icon: Brain, size: 24, x: '50%', y: '10%', delay: 4 },
    { Icon: Shield, size: 20, x: '75%', y: '85%', delay: 5 },
  ];

  return (
    <AnimatedBackground variant="hero">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-heading font-bold gradient-text">HealthAI</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="#how-it-works" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">
                How It Works
              </Link>
              <Link href="#testimonials" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">
                Testimonials
              </Link>
              <Link 
                href="/login"
                className="text-slate-600 hover:text-primary-600 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link 
                href="/register"
                className="px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-3">
              <Link href="#features" className="block text-slate-600 font-medium py-2">Features</Link>
              <Link href="#how-it-works" className="block text-slate-600 font-medium py-2">How It Works</Link>
              <Link href="#testimonials" className="block text-slate-600 font-medium py-2">Testimonials</Link>
              <Link href="/login" className="block text-slate-600 font-medium py-2">Sign In</Link>
              <Link href="/register" className="block w-full text-center px-5 py-3 bg-primary-600 text-white font-semibold rounded-xl">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              <span className="text-primary-700 font-medium text-sm">AI-Powered Health Platform</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl lg:text-6xl font-heading font-bold text-slate-900 leading-tight mb-6"
            >
              Your Personal
              <span className="gradient-text animate-text-gradient bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-indigo-500 to-emerald-500"> Health</span>
              <br />Assistant
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-slate-600 mb-8 leading-relaxed"
            >
              Get instant AI-powered health assessments, risk analysis, and personalized recommendations. 
              Stay ahead of potential health issues with our advanced early warning system.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link 
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-semibold rounded-2xl hover:from-primary-700 hover:to-secondary-600 transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
              >
                Start Free Analysis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border-2 border-slate-200 hover:border-primary-500 hover:text-primary-600 transition-all hover:scale-105 active:scale-95"
              >
                Learn More
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center gap-8 mt-10 pt-10 border-t border-slate-200"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </motion.div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm">Trusted by 50,000+ users</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            {/* Floating Medical Icons */}
            {floatingIcons.map(({ Icon, size, x, y, delay }, index) => (
              <motion.div
                key={index}
                className="absolute hidden lg:block"
                style={{ left: x, top: y }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 4 + delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: delay,
                }}
              >
                <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-100">
                  <Icon size={size} className="text-primary-500" />
                </div>
              </motion.div>
            ))}
            {/* Floating Cards */}
            <div className="relative z-10">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">Health Score</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Good</span>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="#e2e8f0" strokeWidth="10" fill="none" />
                      <circle 
                        cx="64" cy="64" r="56" 
                        stroke="url(#heroGradient)" 
                        strokeWidth="10" 
                        fill="none" 
                        strokeLinecap="round"
                        strokeDasharray={`${78 * 3.52} 352`}
                      />
                      <defs>
                        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0d9488" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-900">78</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-slate-600">Symptoms analyzed</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-slate-600">Risk assessment complete</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-slate-600">Recommendations ready</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Health Trend</p>
                    <p className="font-semibold text-slate-900">+12% Improving</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">AI Accuracy</p>
                    <p className="font-semibold text-slate-900">92% Confidence</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 to-secondary-100/50 rounded-3xl -z-10 transform translate-x-4 translate-y-4"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">
            Powerful Features for Your Health
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive health analysis and personalized insights
          </p>
        </motion.div>

        <div className="grid md:2 lg:gridgrid-cols--cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get your health analysis in three simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 h-full">
                <span className="text-6xl font-heading font-bold text-primary-100">{step.number}</span>
                <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-primary-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join thousands of satisfied users who trust HealthAI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Start your free health analysis today and discover what your symptoms might be telling you.
            </p>
            <Link 
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-2xl hover:bg-primary-50 transition-all shadow-xl"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-heading font-bold">HealthAI</span>
              </div>
              <p className="text-slate-400">
                AI-powered health assistant for early detection and personalized insights.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 HealthAI. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Users className="w-5 h-5 text-slate-400" />
              <span className="text-slate-400 text-sm">50,000+ Active Users</span>
            </div>
          </div>
        </div>
      </footer>
    </AnimatedBackground>
  );
}
