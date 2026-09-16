'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  User,
  Heart,
  Activity,
  Calendar,
  Layers,
  ArrowLeft,
  Eye,
  Shield,
  Stethoscope,
  Weight,
  Sparkles,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { usePatients } from '@/context/PatientContext';

export default function PatientDetailPage() {
  const params = useParams();
  const { getPatient } = usePatients();

  const patientId = Array.isArray(params.id) ? params.id[0] : params.id;
  const patient = getPatient(patientId || '');

  if (!patient) {
    return (
      <AppShell
        title="Patient Record"
        subtitle="Clinical file record not found"
        showActions={false}
      >
        <Card className="p-12 text-center max-w-lg mx-auto">
          <p className="text-base font-bold text-[#20343A]">Patient Record Not Found</p>
          <p className="text-xs text-[#4A636A] mt-2">
            The requested identifier ({patientId}) could not be resolved from local node records.
          </p>
          <div className="mt-6">
            <Link href="/patients">
              <Button variant="primary" size="sm">
                Back to Patient Records
              </Button>
            </Link>
          </div>
        </Card>
      </AppShell>
    );
  }

  const { features, prediction } = patient;
  const riskPercent = prediction?.riskPercentage ?? 0;
  const riskLevel = prediction?.riskLevel ?? 'Low Risk';

  const formatBoolean = (val: string) => {
    return val === 'Yes' ? (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Yes
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6A868F]">
        <XCircle className="h-3.5 w-3.5 text-[#6A868F]" /> No
      </span>
    );
  };

  return (
    <AppShell
      title={`Patient Record: ${patient.name}`}
      subtitle={`Local Institutional Identification: ${patient.id} • Registered on ${patient.lastPredictionDate}`}
      showActions={false}
    >
      <div className="space-y-6">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/patients"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1E7F8C] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Patient Directory
          </Link>

          <div className="flex items-center gap-3">
            <Link href={`/prediction/${patient.id}`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Eye className="h-4 w-4" />
                View Full Inference Result
              </Button>
            </Link>
            <Link href="/patients/new">
              <Button size="sm" className="gap-1.5">
                <Sparkles className="h-4 w-4" />
                Run New Prediction
              </Button>
            </Link>
          </div>
        </div>

        {/* Prediction Summary Header Card */}
        <Card className="bg-gradient-to-r from-white to-[#EAF7FB]/60 border border-[#BFEAF2]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1E7F8C] text-white font-black text-lg shadow-sm">
                {patient.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold text-[#20343A]">{patient.name}</h2>
                  <RiskBadge level={riskLevel} />
                </div>
                <p className="text-xs text-[#4A636A] mt-1">
                  ID: <span className="font-semibold text-[#1E7F8C]">{patient.id}</span> •{' '}
                  {patient.sex} • Age {patient.age} • {features.State}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 rounded-2xl bg-white border border-[#BFEAF2] p-4 shadow-xs">
              <div>
                <span className="block text-[11px] font-semibold text-[#4A636A]">
                  Latest Predicted Risk
                </span>
                <span
                  className={`text-2xl font-black ${
                    riskPercent >= 60
                      ? 'text-red-600'
                      : riskPercent >= 30
                      ? 'text-amber-600'
                      : 'text-[#1E7F8C]'
                  }`}
                >
                  {riskPercent}%
                </span>
              </div>
              <div className="border-l border-[#BFEAF2] pl-6">
                <span className="block text-[11px] font-semibold text-[#4A636A]">
                  Calculation Node
                </span>
                <span className="text-xs font-bold text-[#20343A] flex items-center gap-1 mt-1">
                  <Shield className="h-3.5 w-3.5 text-[#1E7F8C]" />
                  #METRO-04
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Organized 4-Card Clinical Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Patient Demographics */}
          <Card>
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#BFEAF2]/60 mb-4">
              <div className="p-2 rounded-xl bg-[#EAF7FB] text-[#1E7F8C]">
                <User className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-[#20343A]">
                1. Patient Demographics & Identification
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#6A868F] block">Jurisdiction / State</span>
                <span className="font-semibold text-[#20343A]">{features.State}</span>
              </div>
              <div>
                <span className="text-[#6A868F] block">Biological Sex</span>
                <span className="font-semibold text-[#20343A]">{features.Sex}</span>
              </div>
              <div>
                <span className="text-[#6A868F] block">Age Bracket</span>
                <span className="font-semibold text-[#20343A]">{features.AgeCategory}</span>
              </div>
              <div>
                <span className="text-[#6A868F] block">Patient Identifier</span>
                <span className="font-semibold text-[#1E7F8C]">
                  {patient.id}
                </span>
              </div>
            </div>
          </Card>

          {/* Card 2: Health Status & Well-being */}
          <Card>
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#BFEAF2]/60 mb-4">
              <div className="p-2 rounded-xl bg-[#EAF7FB] text-[#1E7F8C]">
                <Activity className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-[#20343A]">
                2. General Health Status & Days of Illness
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#6A868F] block">Self-Reported Health</span>
                <span className="font-semibold text-[#20343A]">
                  {features.GeneralHealth} Health
                </span>
              </div>
              <div>
                <span className="text-[#6A868F] block">Last Routine Checkup</span>
                <span className="font-semibold text-[#20343A]">
                  {features.LastCheckupTime}
                </span>
              </div>
              <div>
                <span className="text-[#6A868F] block">Physical Health Bad Days</span>
                <span className="font-semibold text-[#20343A]">
                  {features.PhysicalHealthDays} Days / Month
                </span>
              </div>
              <div>
                <span className="text-[#6A868F] block">Mental Health Bad Days</span>
                <span className="font-semibold text-[#20343A]">
                  {features.MentalHealthDays} Days / Month
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#6A868F] block">Sleep Duration Average</span>
                <span className="font-semibold text-[#20343A]">
                  {features.SleepHours} Hours per Day
                </span>
              </div>
            </div>
          </Card>

          {/* Card 3: Medical Comorbidities History */}
          <Card>
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#BFEAF2]/60 mb-4">
              <div className="p-2 rounded-xl bg-[#EAF7FB] text-[#1E7F8C]">
                <Heart className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-[#20343A]">
                3. Clinical Comorbidities & Diagnostics
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-[#EAF7FB]/40 border border-[#BFEAF2]/50">
                <span className="text-[#6A868F] block text-[11px]">Angina</span>
                {formatBoolean(features.HadAngina)}
              </div>
              <div className="p-2.5 rounded-xl bg-[#EAF7FB]/40 border border-[#BFEAF2]/50">
                <span className="text-[#6A868F] block text-[11px]">Prior Stroke</span>
                {formatBoolean(features.HadStroke)}
              </div>
              <div className="p-2.5 rounded-xl bg-[#EAF7FB]/40 border border-[#BFEAF2]/50">
                <span className="text-[#6A868F] block text-[11px]">Asthma</span>
                {formatBoolean(features.HadAsthma)}
              </div>
              <div className="p-2.5 rounded-xl bg-[#EAF7FB]/40 border border-[#BFEAF2]/50">
                <span className="text-[#6A868F] block text-[11px]">Skin Cancer</span>
                {formatBoolean(features.HadSkinCancer)}
              </div>
              <div className="p-2.5 rounded-xl bg-[#EAF7FB]/40 border border-[#BFEAF2]/50">
                <span className="text-[#6A868F] block text-[11px]">COPD History</span>
                {formatBoolean(features.HadCOPD)}
              </div>
              <div className="p-2.5 rounded-xl bg-[#EAF7FB]/40 border border-[#BFEAF2]/50">
                <span className="text-[#6A868F] block text-[11px]">Depression</span>
                {formatBoolean(features.HadDepressiveDisorder)}
              </div>
              <div className="p-2.5 rounded-xl bg-[#EAF7FB]/40 border border-[#BFEAF2]/50">
                <span className="text-[#6A868F] block text-[11px]">Kidney Disease</span>
                {formatBoolean(features.HadKidneyDisease)}
              </div>
              <div className="p-2.5 rounded-xl bg-[#EAF7FB]/40 border border-[#BFEAF2]/50">
                <span className="text-[#6A868F] block text-[11px]">Arthritis</span>
                {formatBoolean(features.HadArthritis)}
              </div>
              <div className="p-2.5 rounded-xl bg-[#EAF7FB]/40 border border-[#BFEAF2]/50">
                <span className="text-[#6A868F] block text-[11px]">Diabetes</span>
                <span className="text-xs font-semibold text-[#20343A] block truncate">
                  {features.HadDiabetes}
                </span>
              </div>
            </div>
          </Card>

          {/* Card 4: Lifestyle, Biometrics & Screenings */}
          <Card>
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#BFEAF2]/60 mb-4">
              <div className="p-2 rounded-xl bg-[#EAF7FB] text-[#1E7F8C]">
                <Stethoscope className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-[#20343A]">
                4. Biometrics, Screenings & Lifestyle Habits
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#EAF7FB]/50 border border-[#BFEAF2]">
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-[#1E7F8C]" />
                  <span className="font-semibold text-[#20343A]">
                    {features.HeightInMeters} m • {features.WeightInKilograms} kg
                  </span>
                </div>
                <div className="font-extrabold text-[#1E7F8C]">
                  BMI: {features.BMI.toFixed(1)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[#6A868F] block">Physical Activities</span>
                  {formatBoolean(features.PhysicalActivities)}
                </div>
                <div>
                  <span className="text-[#6A868F] block">Smoker Category</span>
                  <span className="font-semibold text-[#20343A] truncate block">
                    {features.SmokerStatus}
                  </span>
                </div>
                <div>
                  <span className="text-[#6A868F] block">Alcohol Consumption</span>
                  {formatBoolean(features.AlcoholDrinkers)}
                </div>
                <div>
                  <span className="text-[#6A868F] block">Ever Had Chest CT/Scan</span>
                  {formatBoolean(features.ChestScan)}
                </div>
                <div>
                  <span className="text-[#6A868F] block">Flu Vaccine (Past 12 Mo)</span>
                  {formatBoolean(features.FluVaxLast12)}
                </div>
                <div>
                  <span className="text-[#6A868F] block">Pneumonia Vaccine</span>
                  {formatBoolean(features.PneumoVaxEver)}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

