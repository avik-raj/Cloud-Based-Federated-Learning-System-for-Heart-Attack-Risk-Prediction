'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Cpu,
  AlertCircle,
  CheckCircle2,
  HeartPulse,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StepIndicator } from '@/components/forms/StepIndicator';
import { PatientFeatures } from '@/types/patient';
import { defaultFeaturesTemplate } from '@/data/seedPatients';
import { usePatients } from '@/context/PatientContext';
import { runFederatedPrediction } from '@/services/api';

const steps = [
  '1 Patient Info',
  '2 General Health',
  '3 Medical History',
  '4 Functional & Lifestyle',
  '5 Clinical & Measurements',
];

const stateOptions = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'District of Columbia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana',
  'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];

const ageCategories = [
  'Age 18 to 24', 'Age 25 to 29', 'Age 30 to 34', 'Age 35 to 39', 'Age 40 to 44',
  'Age 45 to 49', 'Age 50 to 54', 'Age 55 to 59', 'Age 60 to 64', 'Age 65 to 69',
  'Age 70 to 74', 'Age 75 to 79', 'Age 80 or older',
];

export default function AddPatientPage() {
  const router = useRouter();
  const { addPatient } = usePatients();

  // Basic patient details
  const [patientName, setPatientName] = useState('James Morrison');
  const [patientAge, setPatientAge] = useState(58);

  // Form step
  const [currentStep, setCurrentStep] = useState(1);

  // The 39 exact features
  const [features, setFeatures] = useState<PatientFeatures>({
    ...defaultFeaturesTemplate,
  });

  // UI States
  const [isPredicting, setIsPredicting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [draftSavedMessage, setDraftSavedMessage] = useState(false);

  // Real-time BMI calculation whenever Height or Weight changes
  useEffect(() => {
    if (features.HeightInMeters > 0 && features.WeightInKilograms > 0) {
      const calculatedBmi =
        features.WeightInKilograms / (features.HeightInMeters * features.HeightInMeters);
      const roundedBmi = parseFloat(calculatedBmi.toFixed(1));
      setFeatures((prev) => ({
        ...prev,
        BMI: roundedBmi,
      }));
    }
  }, [features.HeightInMeters, features.WeightInKilograms]);

  const updateFeature = <K extends keyof PatientFeatures>(key: K, value: PatientFeatures[K]) => {
    setFeatures((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveDraft = () => {
    localStorage.setItem(
      'cardioguard_patient_draft',
      JSON.stringify({ name: patientName, age: patientAge, features })
    );
    setDraftSavedMessage(true);
    setTimeout(() => setDraftSavedMessage(false), 3000);
  };

  const handleRunPrediction = async () => {
    setErrorMessage('');
    setIsPredicting(true);

    try {
      // Direct call to FastAPI / Next.js proxy with ALL 39 exact feature names
      const result = await runFederatedPrediction(features);

      // Save into patient context
      const newPatient = addPatient(
        patientName || 'Anonymous Patient',
        Number(patientAge) || 55,
        features.Sex as 'Male' | 'Female',
        features,
        result
      );

      // Navigate to prediction result view
      router.push(`/prediction/${newPatient.id}`);
    } catch (err: unknown) {
      setIsPredicting(false);
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to connect to the prediction service. Please try again.';
      setErrorMessage(message);
    }
  };

  // Helper toggle button component for Yes/No fields
  const TogglePills = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (val: 'Yes' | 'No') => void;
  }) => (
    <div className="flex items-center gap-1 bg-[#EAF7FB] p-1 rounded-xl border border-[#BFEAF2] w-fit">
      <button
        type="button"
        onClick={() => onChange('Yes')}
        className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all ${
          value === 'Yes'
            ? 'bg-[#1E7F8C] text-white shadow-xs'
            : 'text-[#4A636A] hover:text-[#20343A]'
        }`}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange('No')}
        className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all ${
          value === 'No'
            ? 'bg-[#20343A] text-white shadow-xs'
            : 'text-[#4A636A] hover:text-[#20343A]'
        }`}
      >
        No
      </button>
    </div>
  );

  return (
    <AppShell
      title="Local Heart Attack Prediction Parameters Form"
      subtitle="Input 39 standardized cardiovascular parameters for local federated model inference."
      showActions={false}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Stepper Card */}
        <Card className="p-4 sm:p-6 bg-white">
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            onStepClick={(step) => setCurrentStep(step)}
          />
        </Card>

        {/* Error / Feedback banners */}
        {errorMessage && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {draftSavedMessage && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>Draft parameters successfully cached to local browser storage.</span>
          </div>
        )}

        {/* Multi-Step Wizard Form Card */}
        <Card className="p-6 sm:p-8 bg-white">
          {/* STEP 1: Patient Demographics & Profile */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-[#BFEAF2]/60 pb-3">
                <h3 className="text-base font-bold text-[#20343A]">
                  1. Patient Demographics & Identification
                </h3>
                <p className="text-xs text-[#4A636A]">
                  Basic clinical identity and localized regional jurisdiction
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                    Patient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. James Morrison"
                    className="w-full rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30 px-3.5 py-2.5 text-sm text-[#20343A] focus:border-[#1E7F8C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E7F8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                    Biological Sex (Sex)
                  </label>
                  <div className="flex gap-2">
                    {['Male', 'Female'].map((sex) => (
                      <button
                        key={sex}
                        type="button"
                        onClick={() => updateFeature('Sex', sex)}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                          features.Sex === sex
                            ? 'bg-[#1E7F8C] border-[#1E7F8C] text-white shadow-xs'
                            : 'border-[#BFEAF2] bg-[#EAF7FB]/40 text-[#20343A] hover:bg-white'
                        }`}
                      >
                        {sex}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                    State Location (State)
                  </label>
                  <select
                    value={features.State}
                    onChange={(e) => updateFeature('State', e.target.value)}
                    className="w-full rounded-xl border border-[#BFEAF2] bg-white px-3.5 py-2.5 text-sm text-[#20343A] focus:border-[#1E7F8C] focus:outline-none"
                  >
                    {stateOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                    Age Category (AgeCategory)
                  </label>
                  <select
                    value={features.AgeCategory}
                    onChange={(e) => {
                      updateFeature('AgeCategory', e.target.value);
                      // approximate numerical age for display
                      const match = e.target.value.match(/\d+/);
                      if (match) setPatientAge(parseInt(match[0], 10));
                    }}
                    className="w-full rounded-xl border border-[#BFEAF2] bg-white px-3.5 py-2.5 text-sm text-[#20343A] focus:border-[#1E7F8C] focus:outline-none"
                  >
                    {ageCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: General Health */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-[#BFEAF2]/60 pb-3">
                <h3 className="text-base font-bold text-[#20343A]">
                  2. General Health Status & Well-being
                </h3>
                <p className="text-xs text-[#4A636A]">
                  Self-reported health evaluation and monthly impairment metrics
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#20343A] mb-2">
                    General Health Rating (GeneralHealth)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {['Excellent', 'Very good', 'Good', 'Fair', 'Poor'].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => updateFeature('GeneralHealth', rate)}
                        className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all ${
                          features.GeneralHealth === rate
                            ? 'bg-[#1E7F8C] border-[#1E7F8C] text-white shadow-xs'
                            : 'border-[#BFEAF2] bg-[#EAF7FB]/40 text-[#20343A] hover:bg-white'
                        }`}
                      >
                        {rate}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                    Physical Health Bad Days in Last Month (PhysicalHealthDays: 0-30)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={features.PhysicalHealthDays}
                    onChange={(e) =>
                      updateFeature('PhysicalHealthDays', parseFloat(e.target.value) || 0)
                    }
                    className="w-full rounded-xl border border-[#BFEAF2] bg-white px-3.5 py-2.5 text-sm text-[#20343A] focus:border-[#1E7F8C] focus:outline-none"
                  />
                  <span className="text-[11px] text-[#6A868F]">Days injured or ill</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                    Mental Health Bad Days in Last Month (MentalHealthDays: 0-30)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={features.MentalHealthDays}
                    onChange={(e) =>
                      updateFeature('MentalHealthDays', parseFloat(e.target.value) || 0)
                    }
                    className="w-full rounded-xl border border-[#BFEAF2] bg-white px-3.5 py-2.5 text-sm text-[#20343A] focus:border-[#1E7F8C] focus:outline-none"
                  />
                  <span className="text-[11px] text-[#6A868F]">Days with stress/depression</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                    Average Sleep Hours per Day (SleepHours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="24"
                    value={features.SleepHours}
                    onChange={(e) =>
                      updateFeature('SleepHours', parseFloat(e.target.value) || 7)
                    }
                    className="w-full rounded-xl border border-[#BFEAF2] bg-white px-3.5 py-2.5 text-sm text-[#20343A] focus:border-[#1E7F8C] focus:outline-none"
                  />
                  <span className="text-[11px] text-[#6A868F]">Average hours in 24-hr period</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                    Last Routine Checkup (LastCheckupTime)
                  </label>
                  <select
                    value={features.LastCheckupTime}
                    onChange={(e) => updateFeature('LastCheckupTime', e.target.value)}
                    className="w-full rounded-xl border border-[#BFEAF2] bg-white px-3.5 py-2.5 text-sm text-[#20343A] focus:border-[#1E7F8C] focus:outline-none"
                  >
                    <option value="Within past year (anytime less than 12 months ago)">
                      Within past year (&lt;12 months ago)
                    </option>
                    <option value="Within past 2 years (1 year but less than 2 years ago)">
                      Within past 2 years (1-2 years ago)
                    </option>
                    <option value="Within past 5 years (2 years but less than 5 years ago)">
                      Within past 5 years (2-5 years ago)
                    </option>
                    <option value="5 or more years ago">5 or more years ago</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Medical History (Active Focus Group) */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#BFEAF2]/60 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#20343A]">
                    3. Medical History (Active Focus Group)
                  </h3>
                  <p className="text-xs text-[#4A636A]">
                    Key clinical comorbidities verified during clinical consultation
                  </p>
                </div>
                <span className="rounded-full bg-[#EAF7FB] border border-[#BFEAF2] px-3 py-1 text-xs font-bold text-[#1E7F8C]">
                  Step 3 of 5
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-2xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-[#20343A]">
                      Angina Diagnosis
                    </span>
                    <span className="text-[11px] text-[#6A868F]">HadAngina</span>
                  </div>
                  <TogglePills
                    value={features.HadAngina}
                    onChange={(val) => updateFeature('HadAngina', val)}
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-[#20343A]">Prior Stroke</span>
                    <span className="text-[11px] text-[#6A868F]">HadStroke</span>
                  </div>
                  <TogglePills
                    value={features.HadStroke}
                    onChange={(val) => updateFeature('HadStroke', val)}
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-[#20343A]">Asthma History</span>
                    <span className="text-[11px] text-[#6A868F]">HadAsthma</span>
                  </div>
                  <TogglePills
                    value={features.HadAsthma}
                    onChange={(val) => updateFeature('HadAsthma', val)}
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-[#20343A]">
                      Skin Cancer Case
                    </span>
                    <span className="text-[11px] text-[#6A868F]">HadSkinCancer</span>
                  </div>
                  <TogglePills
                    value={features.HadSkinCancer}
                    onChange={(val) => updateFeature('HadSkinCancer', val)}
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-[#20343A]">COPD History</span>
                    <span className="text-[11px] text-[#6A868F]">HadCOPD</span>
                  </div>
                  <TogglePills
                    value={features.HadCOPD}
                    onChange={(val) => updateFeature('HadCOPD', val)}
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-[#20343A]">
                      Depression Diagnosed
                    </span>
                    <span className="text-[11px] text-[#6A868F]">HadDepressiveDisorder</span>
                  </div>
                  <TogglePills
                    value={features.HadDepressiveDisorder}
                    onChange={(val) => updateFeature('HadDepressiveDisorder', val)}
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-[#20343A]">
                      Kidney Disease History
                    </span>
                    <span className="text-[11px] text-[#6A868F]">HadKidneyDisease</span>
                  </div>
                  <TogglePills
                    value={features.HadKidneyDisease}
                    onChange={(val) => updateFeature('HadKidneyDisease', val)}
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-[#20343A]">
                      Arthritis Diagnosis
                    </span>
                    <span className="text-[11px] text-[#6A868F]">HadArthritis</span>
                  </div>
                  <TogglePills
                    value={features.HadArthritis}
                    onChange={(val) => updateFeature('HadArthritis', val)}
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-[#BFEAF2] bg-[#EAF7FB]/30 sm:col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-[#20343A] mb-1">
                    Diabetes Class Status (HadDiabetes)
                  </label>
                  <select
                    value={features.HadDiabetes}
                    onChange={(e) => updateFeature('HadDiabetes', e.target.value)}
                    className="w-full rounded-lg border border-[#BFEAF2] bg-white p-2 text-xs text-[#20343A] focus:border-[#1E7F8C] focus:outline-none"
                  >
                    <option value="No">No diabetes</option>
                    <option value="No, pre-diabetes or borderline diabetes">
                      Pre-diabetes / Borderline
                    </option>
                    <option value="Yes">Yes, diagnosed diabetes</option>
                    <option value="Yes, but only during pregnancy (female)">
                      Gestational only (pregnancy)
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Functional & Lifestyle */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-[#BFEAF2]/60 pb-3">
                <h3 className="text-base font-bold text-[#20343A]">
                  4. Functional Abilities & Lifestyle Habits
                </h3>
                <p className="text-xs text-[#4A636A]">
                  Physical activities, substance consumption, and functional limitations
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                    Physical Activities in Past 30 Days (PhysicalActivities)
                  </label>
                  <TogglePills
                    value={features.PhysicalActivities}
                    onChange={(val) => updateFeature('PhysicalActivities', val)}
                  />
                  <p className="text-[11px] text-[#6A868F] mt-1">Exercise, walking, running, sports</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                    Alcohol Consumption (AlcoholDrinkers)
                  </label>
                  <TogglePills
                    value={features.AlcoholDrinkers}
                    onChange={(val) => updateFeature('AlcoholDrinkers', val)}
                  />
                  <p className="text-[11px] text-[#6A868F] mt-1">Any alcohol in past 30 days</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                    Smoker Status (SmokerStatus)
                  </label>
                  <select
                    value={features.SmokerStatus}
                    onChange={(e) => updateFeature('SmokerStatus', e.target.value)}
                    className="w-full rounded-xl border border-[#BFEAF2] bg-white px-3.5 py-2.5 text-sm text-[#20343A] focus:border-[#1E7F8C] focus:outline-none"
                  >
                    <option value="Never smoked">Never smoked</option>
                    <option value="Former smoker">Former smoker</option>
                    <option value="Current smoker - now smokes some days">
                      Current smoker - some days
                    </option>
                    <option value="Current smoker - now smokes every day">
                      Current smoker - every day
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                    E-Cigarette Usage (ECigaretteUsage)
                  </label>
                  <select
                    value={features.ECigaretteUsage}
                    onChange={(e) => updateFeature('ECigaretteUsage', e.target.value)}
                    className="w-full rounded-xl border border-[#BFEAF2] bg-white px-3.5 py-2.5 text-sm text-[#20343A] focus:border-[#1E7F8C] focus:outline-none"
                  >
                    <option value="Never used e-cigarettes in my entire life">
                      Never used e-cigarettes
                    </option>
                    <option value="Not at all (right now)">Not at all (right now)</option>
                    <option value="Use them some days">Use them some days</option>
                    <option value="Use them every day">Use them every day</option>
                  </select>
                </div>
              </div>

              {/* Functional Limitations Section */}
              <div className="pt-4 border-t border-[#BFEAF2]/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#20343A] mb-3">
                  Functional & Daily Living Difficulties
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#20343A]">Deaf / Hearing Loss</span>
                    <TogglePills
                      value={features.DeafOrHardOfHearing}
                      onChange={(val) => updateFeature('DeafOrHardOfHearing', val)}
                    />
                  </div>

                  <div className="p-3 rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#20343A]">Blind / Vision Difficulty</span>
                    <TogglePills
                      value={features.BlindOrVisionDifficulty}
                      onChange={(val) => updateFeature('BlindOrVisionDifficulty', val)}
                    />
                  </div>

                  <div className="p-3 rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#20343A]">Difficulty Concentrating</span>
                    <TogglePills
                      value={features.DifficultyConcentrating}
                      onChange={(val) => updateFeature('DifficultyConcentrating', val)}
                    />
                  </div>

                  <div className="p-3 rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#20343A]">Difficulty Walking</span>
                    <TogglePills
                      value={features.DifficultyWalking}
                      onChange={(val) => updateFeature('DifficultyWalking', val)}
                    />
                  </div>

                  <div className="p-3 rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#20343A]">Dressing / Bathing</span>
                    <TogglePills
                      value={features.DifficultyDressingBathing}
                      onChange={(val) => updateFeature('DifficultyDressingBathing', val)}
                    />
                  </div>

                  <div className="p-3 rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#20343A]">Doing Errands Alone</span>
                    <TogglePills
                      value={features.DifficultyErrands}
                      onChange={(val) => updateFeature('DifficultyErrands', val)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Clinical & Measurements */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-[#BFEAF2]/60 pb-3">
                <h3 className="text-base font-bold text-[#20343A]">
                  5. Clinical Biometrics & Preventative Screenings
                </h3>
                <p className="text-xs text-[#4A636A]">
                  Physical biometrics with automatic BMI calculation and vaccination compliance
                </p>
              </div>

              {/* Biometrics Card with Automatic BMI Calculation */}
              <div className="p-5 rounded-2xl border border-[#BFEAF2] bg-[#EAF7FB]/40">
                <h4 className="text-xs font-bold text-[#20343A] uppercase tracking-wider mb-3">
                  Biometrics & BMI Engine
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                      Height in Meters (HeightInMeters)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.5"
                      max="2.5"
                      value={features.HeightInMeters}
                      onChange={(e) =>
                        updateFeature('HeightInMeters', parseFloat(e.target.value) || 1.7)
                      }
                      className="w-full rounded-xl border border-[#BFEAF2] bg-white px-3.5 py-2.5 text-sm text-[#20343A] focus:border-[#1E7F8C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                      Weight in Kilograms (WeightInKilograms)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="20"
                      max="300"
                      value={features.WeightInKilograms}
                      onChange={(e) =>
                        updateFeature('WeightInKilograms', parseFloat(e.target.value) || 70)
                      }
                      className="w-full rounded-xl border border-[#BFEAF2] bg-white px-3.5 py-2.5 text-sm text-[#20343A] focus:border-[#1E7F8C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                      BMI Calculation (Auto-Calculated)
                    </label>
                    <div className="flex items-center justify-between rounded-xl border border-[#1E7F8C] bg-white px-4 py-2.5 text-sm font-extrabold text-[#1E7F8C]">
                      <span>{features.BMI.toFixed(1)}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#EAF7FB]">
                        {features.BMI < 18.5
                          ? 'Underweight'
                          : features.BMI < 25
                          ? 'Normal'
                          : features.BMI < 30
                          ? 'Overweight'
                          : 'Obese'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preventative Screening & History */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                    Teeth Removed Due to Decay (RemovedTeeth)
                  </label>
                  <select
                    value={features.RemovedTeeth}
                    onChange={(e) => updateFeature('RemovedTeeth', e.target.value)}
                    className="w-full rounded-xl border border-[#BFEAF2] bg-white px-3.5 py-2.5 text-sm text-[#20343A] focus:border-[#1E7F8C] focus:outline-none"
                  >
                    <option value="None of them">None of them</option>
                    <option value="1 to 5">1 to 5 teeth</option>
                    <option value="6 or more, but not all">6 or more, but not all</option>
                    <option value="All">All teeth removed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                    Tetanus Shot (Past 10 Yrs) (TetanusLast10Tdap)
                  </label>
                  <select
                    value={features.TetanusLast10Tdap}
                    onChange={(e) => updateFeature('TetanusLast10Tdap', e.target.value)}
                    className="w-full rounded-xl border border-[#BFEAF2] bg-white px-3.5 py-2.5 text-sm text-[#20343A] focus:border-[#1E7F8C] focus:outline-none"
                  >
                    <option value="Yes, received Tdap">Yes, received Tdap</option>
                    <option value="Yes, received tetanus shot but not sure what type">
                      Yes, tetanus shot (unspecified)
                    </option>
                    <option value="Yes, received tetanus shot, but not Tdap">
                      Yes, tetanus shot but not Tdap
                    </option>
                    <option value="No, did not receive any tetanus shot in the past 10 years">
                      No shot in past 10 years
                    </option>
                  </select>
                </div>

                <div className="p-3 rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#20343A]">Ever Had Chest CT/Scan (ChestScan)</span>
                  <TogglePills
                    value={features.ChestScan}
                    onChange={(val) => updateFeature('ChestScan', val)}
                  />
                </div>

                <div className="p-3 rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#20343A]">Ever Tested for HIV (HIVTesting)</span>
                  <TogglePills
                    value={features.HIVTesting}
                    onChange={(val) => updateFeature('HIVTesting', val)}
                  />
                </div>

                <div className="p-3 rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#20343A]">Flu Vaccine (Past 12 Mos) (FluVaxLast12)</span>
                  <TogglePills
                    value={features.FluVaxLast12}
                    onChange={(val) => updateFeature('FluVaxLast12', val)}
                  />
                </div>

                <div className="p-3 rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#20343A]">Pneumonia Vaccine Ever (PneumoVaxEver)</span>
                  <TogglePills
                    value={features.PneumoVaxEver}
                    onChange={(val) => updateFeature('PneumoVaxEver', val)}
                  />
                </div>

                <div className="p-3 rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#20343A]">High Risk Situations (HighRiskLastYear)</span>
                  <TogglePills
                    value={features.HighRiskLastYear}
                    onChange={(val) => updateFeature('HighRiskLastYear', val)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                    Tested Positive for COVID-19 (CovidPos)
                  </label>
                  <select
                    value={features.CovidPos}
                    onChange={(e) => updateFeature('CovidPos', e.target.value)}
                    className="w-full rounded-xl border border-[#BFEAF2] bg-white px-3.5 py-2.5 text-sm text-[#20343A] focus:border-[#1E7F8C] focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="Tested positive using home test without a health professional">
                      Home test positive without clinician
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="mt-8 pt-5 border-t border-[#BFEAF2]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to {steps[currentStep - 2].split(' ').slice(1).join(' ')}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                className="gap-1.5"
              >
                <Save className="h-4 w-4" />
                Save Local Draft
              </Button>

              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="gap-1.5"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleRunPrediction}
                  isLoading={isPredicting}
                  className="gap-2 bg-[#1E7F8C] hover:bg-[#16646F] px-6 py-3 text-sm font-bold shadow-md shadow-[#1E7F8C]/20"
                >
                  <Cpu className="h-4 w-4" />
                  Run Federated Prediction
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Loading Modal while generating prediction */}
      {isPredicting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#BFEAF2] p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF7FB] border border-[#BFEAF2] text-[#1E7F8C] mb-4">
              <HeartPulse className="h-8 w-8 animate-pulse text-[#1E7F8C]" />
            </div>
            <h3 className="text-lg font-bold text-[#20343A]">
              Generating prediction...
            </h3>
            <p className="text-xs text-[#4A636A] mt-1 leading-relaxed">
              Evaluating cardiovascular parameters through local Federated Logistic Regression
              pipeline on institutional node #METRO-04 (3 simulated healthcare nodes).
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#1E7F8C] animate-bounce [animation-delay:-0.3s]" />
              <div className="h-2 w-2 rounded-full bg-[#63C9D6] animate-bounce [animation-delay:-0.15s]" />
              <div className="h-2 w-2 rounded-full bg-[#BFEAF2] animate-bounce" />
            </div>
            <p className="text-[11px] text-[#6A868F] mt-4 font-mono">
              Model: Federated Logistic Regression (FedAvg)
            </p>
          </div>
        </div>
      )}
    </AppShell>
  );
}

