import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Shield, 
  Brain, 
  Clock, 
  TrendingUp, 
  Heart,
  ArrowRight,
  CheckCircle,
  Stethoscope,
  MessageSquare
} from 'lucide-react';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your symptoms and provide accurate health risk assessments.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your health data is encrypted and secure. We prioritize your privacy above all else.'
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Get detailed health insights in seconds. No waiting for appointments or lab results.'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your health score over time and see how lifestyle changes affect your wellbeing.'
    },
    {
      icon: MessageSquare,
      title: 'Health Insights',
      description: 'Receive personalized recommendations and actionable steps to improve your health.'
    },
    {
      icon: Heart,
      title: 'Preventive Care',
      description: 'Early detection leads to better outcomes. Stay ahead of potential health issues.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Enter Your Symptoms',
      description: 'Select from a comprehensive list of symptoms or describe what you\'re feeling.'
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Our intelligent system processes your input along with lifestyle factors.'
    },
    {
      number: '03',
      title: 'Get Your Results',
      description: 'Receive a detailed health assessment with recommendations.'
    }
  ];

  return (
    <AnimatedBackground variant="hero">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                🏥 AI-Powered Health Assistant
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-slate-900 mb-6"
            >
              Your Health,{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Smarter
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-600 max-w-2xl mx-auto mb-10"
            >
              Intelligent symptom analysis and health risk prediction powered by advanced AI. 
              Get personalized insights and recommendations in seconds.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
          
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-4xl">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-sm text-slate-400">healthai.app</div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                    <div className="flex gap-2 mt-4">
                      <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Headache</div>
                      <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Fatigue</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary-600 mb-2">78</div>
                      <div className="text-slate-600">Health Score</div>
                      <div className="mt-4 flex justify-center">
                        <Stethoscope className="w-12 h-12 text-primary-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">
              Why Choose HealthAI?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Advanced AI technology meets healthcare expertise to give you the best health insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all card-hover"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get your health analysis in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-8xl font-heading font-bold text-primary-100 absolute -top-4 -left-2">
                  {step.number}
                </div>
                <div className="relative pt-16 pl-4">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-heading font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-primary-100 mb-10">
            Join thousands of users who are already benefiting from AI-powered health insights.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-primary-700 font-bold text-lg rounded-2xl hover:bg-primary-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Start Your Free Analysis
            <ArrowRight className="ml-3 w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-xl py-16 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="w-8 h-8 text-primary-500" />
                <span className="text-2xl font-heading font-bold text-white">HealthAI</span>
              </div>
              <p className="text-slate-400 max-w-md">
                Intelligent Diagnosis and Symptom Analysis System - Your AI-powered early-warning health assistant.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-primary-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-primary-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">© 2024 HealthAI. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-slate-500 text-sm">HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </AnimatedBackground>
  );
};

export default Landing;
