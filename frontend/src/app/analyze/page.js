'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { analysisAPI } from '@/services/api';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Activity, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Search,
  AlertCircle,
  User,
  Heart,
  Coffee,
  Moon,
  Zap,
  Mic,
  MicOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const symptomsList = [
  { name: 'Headache', category: 'pain' },
  { name: 'Fever', category: 'general' },
  { name: 'Cough', category: 'respiratory' },
  { name: 'Fatigue', category: 'general' },
  { name: 'Nausea', category: 'digestive' },
  { name: 'Dizziness', category: 'neurological' },
  { name: 'Chest Pain', category: 'cardiac' },
  { name: 'Shortness of Breath', category: 'respiratory' },
  { name: 'Abdominal Pain', category: 'digestive' },
  { name: 'Back Pain', category: 'pain' },
  { name: 'Joint Pain', category: 'pain' },
  { name: 'Sore Throat', category: 'respiratory' },
  { name: 'Runny Nose', category: 'respiratory' },
  { name: 'Body Aches', category: 'general' },
  { name: 'Loss of Taste', category: 'sensory' },
  { name: 'Loss of Smell', category: 'sensory' },
  { name: 'Rash', category: 'skin' },
  { name: 'Swelling', category: 'general' },
  { name: 'Night Sweats', category: 'general' },
  { name: 'Weight Loss', category: 'metabolic' },
  { name: 'Weight Gain', category: 'metabolic' },
  { name: 'Insomnia', category: 'sleep' },
  { name: 'Anxiety', category: 'mental' },
  { name: 'Depression', category: 'mental' },
  { name: 'Blurred Vision', category: 'sensory' },
  { name: 'Constipation', category: 'digestive' },
  { name: 'Diarrhea', category: 'digestive' },
];

const durations = [
  { value: 'less_than_day', label: 'Less than a day' },
  { value: '1_3_days', label: '1-3 days' },
  { value: '4_7_days', label: '4-7 days' },
  { value: '1_2_weeks', label: '1-2 weeks' },
  { value: '2_4_weeks', label: '2-4 weeks' },
  { value: 'more_than_month', label: 'More than a month' },
];

const severityLevels = [
  { value: 1, label: 'Mild', color: 'bg-green-500' },
  { value: 3, label: 'Low', color: 'bg-green-400' },
  { value: 5, label: 'Moderate', color: 'bg-yellow-500' },
  { value: 7, label: 'High', color: 'bg-orange-500' },
  { value: 10, label: 'Severe', color: 'bg-red-500' },
];

export default function AnalyzePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    basicInfo: {
      age: '',
      gender: '',
      weight: '',
      height: '',
    },
    symptoms: [],
    lifestyle: {
      smoking: false,
      alcohol: 'none',
      exercise: 'moderate',
      diet: 'balanced',
      sleepHours: 7,
      stressLevel: 'moderate',
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const addSymptom = (symptom) => {
    if (!formData.symptoms.find(s => s.name === symptom.name)) {
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, { 
          name: symptom.name, 
          severity: 5, 
          duration: '1_3_days' 
        }],
      });
    }
    setSearchTerm('');
  };

  const removeSymptom = (symptomName) => {
    setFormData({
      ...formData,
      symptoms: formData.symptoms.filter(s => s.name !== symptomName),
    });
  };

  const updateSymptom = (symptomName, field, value) => {
    setFormData({
      ...formData,
      symptoms: formData.symptoms.map(s => 
        s.name === symptomName ? { ...s, [field]: value } : s
      ),
    });
  };

  const handleAnalysis = async () => {
    setLoading(true);
    try {
      const payload = {
        symptoms: formData.symptoms,
        basicInfo: formData.basicInfo.age ? formData.basicInfo : undefined,
        lifestyle: formData.lifestyle,
      };
      
      console.log('Sending analysis request with payload:', payload);
      
      const response = await analysisAPI.analyze(payload);
      
      console.log('Analysis response:', response);
      
      if (response.data.success) {
        router.push(`/results/${response.data.analysis.id}`);
      } else {
        alert(response.data.message || 'Analysis failed. Please try again.');
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Analysis failed. Please try again.';
      alert(`Error: ${errorMessage}\n\nPlease make sure you are logged in.`);
    } finally {
      setLoading(false);
    }
  };

  const filteredSymptoms = symptomsList.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !formData.symptoms.find(sel => sel.name === s.name)
  );

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-slate-900">
            {t('analyze')}
          </h1>
          <p className="text-slate-600 mt-2">
            {t('selectSymptomsDesc')}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">{t('step')} {step} {t('of')} {totalSteps}</span>
            <span className="text-sm font-medium text-slate-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {['Basic Info', 'Symptoms', 'Severity', 'Lifestyle', 'Review'].map((label, index) => (
            <div 
              key={index}
              className={`flex flex-col items-center ${step > index + 1 ? 'text-primary-600' : step === index + 1 ? 'text-primary-600' : 'text-slate-400'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                step > index + 1 ? 'bg-primary-600 text-white' : 
                step === index + 1 ? 'bg-primary-100 text-primary-600 border-2 border-primary-600' : 
                'bg-slate-100 text-slate-400'
              }`}>
                {step > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className="text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" />
                  {t('basicInfo')}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={formData.basicInfo.age}
                      onChange={(e) => setFormData({
                        ...formData,
                        basicInfo: { ...formData.basicInfo, age: parseInt(e.target.value) }
                      })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="25"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                    <select
                      value={formData.basicInfo.gender}
                      onChange={(e) => setFormData({
                        ...formData,
                        basicInfo: { ...formData.basicInfo, gender: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">{t('selectGender')}</option>
                      <option value="male">{t('male')}</option>
                      <option value="female">{t('female')}</option>
                      <option value="other">{t('other')}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={formData.basicInfo.weight}
                      onChange={(e) => setFormData({
                        ...formData,
                        basicInfo: { ...formData.basicInfo, weight: parseFloat(e.target.value) }
                      })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="70"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={formData.basicInfo.height}
                      onChange={(e) => setFormData({
                        ...formData,
                        basicInfo: { ...formData.basicInfo, height: parseFloat(e.target.value) }
                      })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="170"
                    />
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 mt-4">This information helps us provide more accurate assessments.</p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-600" />
                  {t('selectSymptoms')}
                </h2>
                
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('searchSymptoms')}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {searchTerm && filteredSymptoms.length > 0 && (
                  <div className="mb-6 bg-slate-50 rounded-xl p-2 max-h-48 overflow-y-auto">
                    {filteredSymptoms.slice(0, 8).map((symptom) => (
                      <button
                        key={symptom.name}
                        onClick={() => addSymptom(symptom)}
                        className="w-full text-left px-4 py-2 hover:bg-white rounded-lg transition-colors"
                      >
                        {symptom.name}
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  {formData.symptoms.map((symptom) => (
                    <div key={symptom.name} className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
                      <span className="font-medium text-slate-900">{symptom.name}</span>
                      <button
                        onClick={() => removeSymptom(symptom.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        {t('remove')}
                      </button>
                    </div>
                  ))}
                </div>

                {formData.symptoms.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p>{t('selectAtLeastOne')}</p>
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  {t('severityDuration')}
                </h2>
                
                <div className="space-y-6">
                  {formData.symptoms.map((symptom) => (
                    <div key={symptom.name} className="border border-slate-200 rounded-xl p-4">
                      <h3 className="font-medium text-slate-900 mb-4">{symptom.name}</h3>
                      
                      <div className="mb-4">
                        <label className="block text-sm text-slate-600 mb-2">{t('severity')}</label>
                        <div className="flex gap-2">
                          {severityLevels.map((level) => (
                            <button
                              key={level.value}
                              onClick={() => updateSymptom(symptom.name, 'severity', level.value)}
                              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                                symptom.severity === level.value 
                                  ? `${level.color} text-white` 
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {level.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-slate-600 mb-2">{t('duration')}</label>
                        <select
                          value={symptom.duration}
                          onChange={(e) => updateSymptom(symptom.name, 'duration', e.target.value)}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {durations.map((d) => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary-600" />
                  {t('lifestyleFactors')}
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{t('doYouSmoke')}</p>
                      <p className="text-sm text-slate-500">Tobacco use increases health risks</p>
                    </div>
                    <button
                      onClick={() => setFormData({
                        ...formData,
                        lifestyle: { ...formData.lifestyle, smoking: !formData.lifestyle.smoking }
                      })}
                      className={`w-12 h-6 rounded-full transition-colors ${formData.lifestyle.smoking ? 'bg-primary-600' : 'bg-slate-200'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.lifestyle.smoking ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block font-medium text-slate-900 mb-2">Alcohol Consumption</label>
                    <select
                      value={formData.lifestyle.alcohol}
                      onChange={(e) => setFormData({
                        ...formData,
                        lifestyle: { ...formData.lifestyle, alcohol: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="none">None</option>
                      <option value="occasional">Occasional</option>
                      <option value="frequent">Frequent</option>
                      <option value="daily">Daily</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block font-medium text-slate-900 mb-2">Exercise Frequency</label>
                    <select
                      value={formData.lifestyle.exercise}
                      onChange={(e) => setFormData({
                        ...formData,
                        lifestyle: { ...formData.lifestyle, exercise: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="none">None</option>
                      <option value="rarely">Rarely</option>
                      <option value="moderate">Moderate (1-3 times/week)</option>
                      <option value="regular">Regular (4+ times/week)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block font-medium text-slate-900 mb-2">Sleep Hours (per night)</label>
                    <input
                      type="range"
                      min="3"
                      max="12"
                      value={formData.lifestyle.sleepHours}
                      onChange={(e) => setFormData({
                        ...formData,
                        lifestyle: { ...formData.lifestyle, sleepHours: parseInt(e.target.value) }
                      })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>3 hours</span>
                      <span className="font-medium text-primary-600">{formData.lifestyle.sleepHours} hours</span>
                      <span>12 hours</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block font-medium text-slate-900 mb-2">Stress Level</label>
                    <select
                      value={formData.lifestyle.stressLevel}
                      onChange={(e) => setFormData({
                        ...formData,
                        lifestyle: { ...formData.lifestyle, stressLevel: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                      <option value="very_high">Very High</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  {t('reviewInfo')}
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h3 className="font-medium text-slate-900 mb-2">{t('basicInfo')}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                      <p>Age: {formData.basicInfo.age || 'Not provided'}</p>
                      <p>Gender: {formData.basicInfo.gender || 'Not provided'}</p>
                      <p>Weight: {formData.basicInfo.weight ? `${formData.basicInfo.weight} kg` : 'Not provided'}</p>
                      <p>Height: {formData.basicInfo.height ? `${formData.basicInfo.height} cm` : 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h3 className="font-medium text-slate-900 mb-2">{t('symptoms')} ({formData.symptoms.length})</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.symptoms.map((s) => (
                        <span key={s.name} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h3 className="font-medium text-slate-900 mb-2">{t('lifestyle')}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                      <p>Smoking: {formData.lifestyle.smoking ? 'Yes' : 'No'}</p>
                      <p>Alcohol: {formData.lifestyle.alcohol}</p>
                      <p>Exercise: {formData.lifestyle.exercise}</p>
                      <p>Sleep: {formData.lifestyle.sleepHours} hours</p>
                      <p>Stress: {formData.lifestyle.stressLevel}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-xl hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('back')}
            </button>
            
            {step < totalSteps ? (
              <button
                onClick={() => setStep(Math.min(totalSteps, step + 1))}
                disabled={step === 2 && formData.symptoms.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('next')}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleAnalysis}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-xl hover:from-primary-700 hover:to-secondary-600 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" />
                    {t('analyzing')}
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    {t('analyzeNow')}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
