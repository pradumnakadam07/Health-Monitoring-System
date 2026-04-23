import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analysisAPI } from '../services/api';
import { 
  Activity, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Search,
  AlertTriangle,
  User,
  Clock,
  Moon,
  Coffee,
  Dumbbell
} from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const SYMPTOMS = [
  'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Dizziness',
  'Chest Pain', 'Shortness of Breath', 'Abdominal Pain', 'Back Pain',
  'Joint Pain', 'Sore Throat', 'Runny Nose', 'Body Aches',
  'Loss of Taste', 'Loss of Smell', 'Rash', 'Swelling',
  'Night Sweats', 'Weight Loss', 'Weight Gain', 'Insomnia',
  'Anxiety', 'Depression', 'Blurred Vision', 'Constipation', 'Diarrhea'
];

const BODY_PARTS = [
  'Head', 'Chest', 'Abdomen', 'Back', 'Legs', 'Arms', 'Hands', 'Feet',
  'Neck', 'Throat', 'Eyes', 'Ears', 'Skin'
];

const DURATIONS = [
  { value: 'less_than_day', label: 'Less than a day' },
  { value: '1_3_days', label: '1-3 days' },
  { value: '4_7_days', label: '4-7 days' },
  { value: '1_2_weeks', label: '1-2 weeks' },
  { value: '2_4_weeks', label: '2-4 weeks' },
  { value: 'more_than_month', label: 'More than a month' }
];

const Analyze = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    age: user?.age || '',
    gender: user?.gender || '',
    weight: user?.weight || '',
    height: user?.height || '',
    // Step 2-3: Symptoms
    symptoms: [],
    symptomDetails: {},
    // Step 4: Lifestyle
    smoking: false,
    alcohol: 'none',
    exercise: 'moderate',
    diet: 'balanced',
    sleepHours: 7,
    stressLevel: 'moderate'
  });

  const filteredSymptoms = SYMPTOMS.filter(symptom =>
    symptom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSymptom = (symptom) => {
    setFormData(prev => {
      const symptoms = prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom];
      
      const symptomDetails = { ...prev.symptomDetails };
      if (!prev.symptoms.includes(symptom)) {
        symptomDetails[symptom] = { severity: 5, duration: '1_3_days', bodyPart: '' };
      } else {
        delete symptomDetails[symptom];
      }
      
      return { ...prev, symptoms, symptomDetails };
    });
  };

  const updateSymptomDetail = (symptom, field, value) => {
    setFormData(prev => ({
      ...prev,
      symptomDetails: {
        ...prev.symptomDetails,
        [symptom]: {
          ...prev.symptomDetails[symptom],
          [field]: value
        }
      }
    }));
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const symptomsData = formData.symptoms.map(symptom => ({
        name: symptom,
        severity: formData.symptomDetails[symptom]?.severity || 5,
        duration: formData.symptomDetails[symptom]?.duration || '1_3_days',
        bodyPart: formData.symptomDetails[symptom]?.bodyPart || ''
      }));

      const response = await analysisAPI.analyze({
        symptoms: symptomsData,
        basicInfo: {
          age: parseInt(formData.age) || undefined,
          gender: formData.gender,
          weight: parseFloat(formData.weight) || undefined,
          height: parseFloat(formData.height) || undefined
        },
        lifestyle: {
          smoking: formData.smoking,
          alcohol: formData.alcohol,
          exercise: formData.exercise,
          diet: formData.diet,
          sleepHours: formData.sleepHours,
          stressLevel: formData.stressLevel
        }
      });

      if (response.data.success) {
        navigate(`/results/${response.data.analysis.id}`);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return true; // Basic info is optional
      case 2:
        return formData.symptoms.length > 0;
      case 3:
        return true; // Symptom details are optional
      case 4:
        return true; // Lifestyle is optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s < step ? 'bg-primary-600 text-white' :
                  s === step ? 'bg-primary-100 text-primary-600 border-2 border-primary-600' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 5 && (
                  <div className={`w-16 sm:w-24 h-1 mx-2 ${
                    s < step ? 'bg-primary-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>Basic Info</span>
            <span>Symptoms</span>
            <span>Details</span>
            <span>Lifestyle</span>
            <span>Review</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          {loading ? (
            <div className="py-16 text-center">
              <LoadingSpinner size="large" />
              <p className="mt-4 text-slate-600">Analyzing your symptoms...</p>
            </div>
          ) : (
            <>
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-slate-900">Basic Information</h2>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        placeholder="25"
                        min="1"
                        max="150"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        placeholder="70"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Height (cm)</label>
                      <input
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        placeholder="170"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">This information helps provide more accurate assessments.</p>
                </div>
              )}

              {/* Step 2: Symptoms */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-slate-900">Select Your Symptoms</h2>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                      placeholder="Search symptoms..."
                    />
                  </div>

                  {formData.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-4 bg-primary-50 rounded-xl">
                      {formData.symptoms.map(symptom => (
                        <button
                          key={symptom}
                          onClick={() => toggleSymptom(symptom)}
                          className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm flex items-center gap-1"
                        >
                          {symptom} <Check className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                    {filteredSymptoms.map(symptom => (
                      <button
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          formData.symptoms.includes(symptom)
                            ? 'bg-primary-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>

                  {formData.symptoms.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-yellow-500" />
                      <p>Please select at least one symptom</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Symptom Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-slate-900">Symptom Details</h2>
                  </div>

                  <div className="space-y-6 max-h-96 overflow-y-auto">
                    {formData.symptoms.map(symptom => (
                      <div key={symptom} className="p-4 bg-slate-50 rounded-xl">
                        <h3 className="font-semibold text-slate-900 mb-4">{symptom}</h3>
                        
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">Severity (1-10)</label>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={formData.symptomDetails[symptom]?.severity || 5}
                              onChange={(e) => updateSymptomDetail(symptom, 'severity', parseInt(e.target.value))}
                              className="w-full"
                            />
                            <div className="text-center text-sm text-slate-600">
                              {formData.symptomDetails[symptom]?.severity || 5}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">Duration</label>
                            <select
                              value={formData.symptomDetails[symptom]?.duration || '1_3_days'}
                              onChange={(e) => updateSymptomDetail(symptom, 'duration', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                            >
                              {DURATIONS.map(d => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">Body Part</label>
                            <select
                              value={formData.symptomDetails[symptom]?.bodyPart || ''}
                              onChange={(e) => updateSymptomDetail(symptom, 'bodyPart', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                            >
                              <option value="">Select</option>
                              {BODY_PARTS.map(part => (
                                <option key={part} value={part}>{part}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Lifestyle */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Dumbbell className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-slate-900">Lifestyle Factors</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <h3 className="font-medium text-slate-900">Do you smoke?</h3>
                        <p className="text-sm text-slate-500">Tobacco use increases health risks</p>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, smoking: !formData.smoking })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          formData.smoking ? 'bg-primary-600' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                          formData.smoking ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Alcohol Consumption</label>
                      <select
                        value={formData.alcohol}
                        onChange={(e) => setFormData({ ...formData, alcohol: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                      >
                        <option value="none">None</option>
                        <option value="occasional">Occasional</option>
                        <option value="frequent">Frequent</option>
                        <option value="daily">Daily</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Exercise Frequency</label>
                      <select
                        value={formData.exercise}
                        onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                      >
                        <option value="none">None</option>
                        <option value="rarely">Rarely</option>
                        <option value="moderate">Moderate (1-3 times/week)</option>
                        <option value="regular">Regular (4+ times/week)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Diet Quality</label>
                      <select
                        value={formData.diet}
                        onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                      >
                        <option value="balanced">Balanced</option>
                        <option value="mostly_healthy">Mostly Healthy</option>
                        <option value="poor">Poor</option>
                        <option value="unhealthy">Unhealthy</option>
                      </select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Sleep Hours</label>
                        <div className="flex items-center gap-4">
                          <Moon className="w-5 h-5 text-slate-400" />
                          <input
                            type="range"
                            min="3"
                            max="12"
                            value={formData.sleepHours}
                            onChange={(e) => setFormData({ ...formData, sleepHours: parseInt(e.target.value) })}
                            className="flex-1"
                          />
                          <span className="text-slate-600 font-medium">{formData.sleepHours}h</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Stress Level</label>
                        <select
                          value={formData.stressLevel}
                          onChange={(e) => setFormData({ ...formData, stressLevel: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                        >
                          <option value="low">Low</option>
                          <option value="moderate">Moderate</option>
                          <option value="high">High</option>
                          <option value="very_high">Very High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Review Your Information</h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <h3 className="font-medium text-slate-900 mb-2">Basic Information</h3>
                      <div className="text-sm text-slate-600 grid sm:grid-cols-2 gap-2">
                        <p>Age: {formData.age || 'Not provided'}</p>
                        <p>Gender: {formData.gender || 'Not provided'}</p>
                        <p>Weight: {formData.weight ? `${formData.weight} kg` : 'Not provided'}</p>
                        <p>Height: {formData.height ? `${formData.height} cm` : 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl">
                      <h3 className="font-medium text-slate-900 mb-2">Symptoms ({formData.symptoms.length})</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.symptoms.map(s => (
                          <span key={s} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl">
                      <h3 className="font-medium text-slate-900 mb-2">Lifestyle</h3>
                      <div className="text-sm text-slate-600 grid sm:grid-cols-2 gap-2">
                        <p>Smoking: {formData.smoking ? 'Yes' : 'No'}</p>
                        <p>Alcohol: {formData.alcohol}</p>
                        <p>Exercise: {formData.exercise}</p>
                        <p>Diet: {formData.diet}</p>
                        <p>Sleep: {formData.sleepHours} hours</p>
                        <p>Stress: {formData.stressLevel}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${
                    step === 1 
                      ? 'text-slate-300 cursor-not-allowed' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                
                {step < 5 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${
                      canProceed()
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-secondary-600"
                  >
                    Analyze Symptoms
                    <Activity className="w-5 h-5" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyze;
