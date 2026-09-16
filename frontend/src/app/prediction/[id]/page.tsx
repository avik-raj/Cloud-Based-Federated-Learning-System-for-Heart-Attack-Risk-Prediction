'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  HeartPulse,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePatients } from '@/context/PatientContext';

export default function PredictionResultPage() {
  const params = useParams();
  const router = useRouter();
  const { getPatient } = usePatients();

  const patientId = Array.isArray(params.id) ? params.id[0] : params.id;
  const patient = getPatient(patientId || '');

  // Fallback defaults if viewing a patient whose prediction just generated
  const prediction = patient?.prediction || {
    prediction: 'Yes' as const,
    probability: 0.7842,
    riskPercentage: 78,
    riskLevel: 'High Risk' as const,
    modelName: 'Federated Logistic Regression',
    algorithm: 'FedAvg',
    computedAt: 'October 24, 2026, 09:44 AM Local Node Time',
    contributingFactors: [
      { factor: 'Angina History Diagnosis', impact: 24 },
      { factor: 'Age Bracket (58 Years)', impact: 18 },
      { factor: 'Sleep Quality Restriction (Avg 5.5 Hours)', impact: 12 },
    ],
  };

  const isHigh = prediction.riskPercentage >= 60;
  const isMod = prediction.riskPercentage >= 30 && prediction.riskPercentage < 60;

  return (
    <AppShell
      title="Local Inference Computation Result"
      subtitle="Federated model parameter computation evaluated with zero clinical data egress."
      showActions={false}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Main Result Card */}
        <Card className="p-6 sm:p-10 bg-white shadow-md">
          {/* Patient Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BFEAF2]/70 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#20343A]">
                {patient?.name || 'James Morrison'}
              </h2>
              <p className="text-xs font-semibold text-[#4A636A] mt-1">
                Patient ID: {patient?.id || patientId} • Age {patient?.age || 58} •{' '}
                {patient?.sex || 'Male'}
              </p>
            </div>

            {/* Federated Model Badge */}
            <div className="flex items-center gap-2 rounded-xl bg-[#EAF7FB] border border-[#BFEAF2] px-3.5 py-1.5 w-fit">
              <Layers className="h-4 w-4 text-[#1E7F8C]" />
              <div className="text-right">
                <span className="block text-[10px] font-bold text-[#1E7F8C] uppercase tracking-wider">
                  Model Architecture
                </span>
                <span className="block text-xs font-bold text-[#20343A]">
                  Federated Logistic Regression
                </span>
              </div>
            </div>
          </div>

          {/* Large Risk Metric & Visual Scale */}
          <div className="py-8 text-center border-b border-[#BFEAF2]/70">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4A636A]">
              Predicted Cardiovascular Risk
            </span>

            <div className="mt-2 flex items-center justify-center gap-3">
              <span
                className={`text-6xl sm:text-7xl font-black tracking-tight ${
                  isHigh ? 'text-red-600' : isMod ? 'text-amber-600' : 'text-[#1E7F8C]'
                }`}
              >
                {prediction.riskPercentage}%
              </span>
            </div>

            <p
              className={`mt-2 text-sm font-bold tracking-wide ${
                isHigh ? 'text-red-600' : isMod ? 'text-amber-600' : 'text-[#1E7F8C]'
              }`}
            >
              {isHigh
                ? 'High Cardiovascular Risk'
                : isMod
                ? 'Moderate Cardiovascular Risk'
                : 'Low Cardiovascular Risk'}
            </p>

            {/* Risk Scale Bar */}
            <div className="mt-8 max-w-lg mx-auto">
              <div className="relative">
                {/* Pointer indicator */}
                <div
                  className="absolute -top-7 transform -translate-x-1/2 transition-all duration-500"
                  style={{ left: `${Math.max(5, Math.min(prediction.riskPercentage, 95))}%` }}
                >
                  <div className="bg-[#20343A] text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                    <span>{prediction.riskPercentage}%</span>
                  </div>
                  <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#20343A] mx-auto" />
                </div>

                {/* Triple-segmented bar */}
                <div className="h-3.5 w-full rounded-full bg-gray-100 flex overflow-hidden border border-[#BFEAF2]">
                  <div className="w-[30%] bg-[#1E7F8C] h-full" title="Low Risk: 0-30%" />
                  <div className="w-[30%] bg-[#63C9D6] h-full" title="Moderate Risk: 30-60%" />
                  <div className="w-[40%] bg-[#D1383A] h-full" title="High Risk: 60-100%" />
                </div>
              </div>

              {/* Bar Labels */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-[#4A636A]">
                <span>Low Risk (0–30%)</span>
                <span>Moderate (30–60%)</span>
                <span>High Risk (60–100%)</span>
              </div>
            </div>
          </div>

          {/* Key Risk Contributions (Local Node Calculation) */}
          <div className="py-6 border-b border-[#BFEAF2]/70">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#20343A]">
                Key Risk Contributions (Local Node Calculation)
              </h3>
              <span className="text-xs text-[#6A868F]">FedAvg Feature Weights</span>
            </div>

            <div className="space-y-3">
              {prediction.contributingFactors && prediction.contributingFactors.length > 0 ? (
                prediction.contributingFactors.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#EAF7FB]/40 border border-[#BFEAF2]/50"
                  >
                    <span className="text-xs font-semibold text-[#20343A]">
                      {item.factor}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden border border-[#BFEAF2]">
                        <div
                          className={`h-full rounded-full ${
                            item.isNegative ? 'bg-[#1E7F8C]' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(item.impact * 3, 100)}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold w-16 text-right ${
                          item.isNegative ? 'text-[#1E7F8C]' : 'text-red-600'
                        }`}
                      >
                        {item.isNegative ? `-${item.impact}%` : `+${item.impact}%`} impact
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[#6A868F] italic">
                  Standard baseline parameter distribution evaluated.
                </div>
              )}
            </div>
          </div>

          {/* Computed Timestamp & Medical Disclaimer */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4A636A]">
              <Clock className="h-4 w-4 text-[#1E7F8C]" />
              <span>Prediction Computed: {prediction.computedAt}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#EAF7FB]/50 border border-[#BFEAF2] text-[11px] text-[#4A636A] leading-relaxed">
              <p>
                <strong className="text-[#20343A]">Clinical Recommendation Aid:</strong>{' '}
                Federated Logistic Regression models output statistical predicted risk
                assessments based on historical aggregate databases. This calculation is a
                clinical recommendation aid and does not constitute absolute diagnostic medical
                certainty.
              </p>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="mt-8 pt-6 border-t border-[#BFEAF2]/70 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              href={patient?.id ? `/patients/${patient.id}` : '/patients'}
              className="w-full sm:w-auto"
            >
              <Button
                variant="primary"
                className="w-full sm:w-auto gap-2 bg-[#1E7F8C] hover:bg-[#16646F]"
              >
                <FileText className="h-4 w-4" />
                Save to Patient Record
              </Button>
            </Link>

            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

