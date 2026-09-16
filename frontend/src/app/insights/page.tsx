'use client';

import React, { useState } from 'react';
import {
  Server,
  Repeat,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  Layers,
  Database,
  Building2,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { StatusBanner } from '@/components/ui/StatusBanner';
import {
  validationMetrics,
  modelBenchmarks,
  hospitalWeights,
  targetDistribution,
  confusionMatrices,
  rocCurveData,
} from '@/data/modelData';
import { ModelBenchmarkChart } from '@/components/insights/ModelBenchmarkChart';

export default function InsightsPage() {
  const [activeMetricTab, setActiveMetricTab] = useState<'accuracy' | 'precision' | 'recall' | 'f1' | 'rocAuc'>('accuracy');

  return (
    <AppShell
      title="Federated Learning Architecture Insights"
      subtitle="Federated vs. Centralized Model Metrics • Compare parameters with no active client data exchange."
      showActions={false}
    >
      <div className="space-y-8">
        {/* Top 3 Stat Cards from PDF */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Active Network Nodes */}
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#4A636A]">
                Active Network Nodes
              </p>
              <h3 className="text-3xl font-extrabold text-[#20343A] mt-2">
                3 Healthcare Nodes
              </h3>
              <p className="text-xs font-medium text-[#1E7F8C] mt-1">
                Participating Clinical Systems
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7FB] border border-[#BFEAF2] text-[#1E7F8C]">
              <Server className="h-6 w-6" />
            </div>
          </Card>

          {/* Card 2: Training Architecture */}
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#4A636A]">
                Training Architecture
              </p>
              <h3 className="text-3xl font-extrabold text-[#20343A] mt-2">
                150 Local Rounds
              </h3>
              <p className="text-xs font-medium text-[#1E7F8C] mt-1">
                Local epochs per global aggregation
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7FB] border border-[#BFEAF2] text-[#1E7F8C]">
              <Repeat className="h-6 w-6" />
            </div>
          </Card>

          {/* Card 3: Privacy Protection Status */}
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#4A636A]">
                Privacy Protection Status
              </p>
              <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">
                Compliant
              </h3>
              <p className="text-xs font-medium text-[#4A636A] mt-1">
                Local data never leaves raw nodes
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </Card>
        </div>

        {/* Validation Metrics Table matching PDF */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-[#BFEAF2]/60 bg-white">
            <h3 className="text-base font-bold text-[#20343A]">
              Validation Metrics (100k Test Dataset Approximation)
            </h3>
            <p className="text-xs text-[#4A636A] mt-0.5">
              Empirical side-by-side comparison of Centralized vs Federated parameter convergence
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#BFEAF2] bg-[#EAF7FB]/60 text-xs font-bold uppercase tracking-wider text-[#4A636A]">
                <tr>
                  <th className="px-6 py-4">Clinical Metric</th>
                  <th className="px-6 py-4">Centralized Logistic Reg.</th>
                  <th className="px-6 py-4">Federated Logistic Reg.</th>
                  <th className="px-6 py-4 text-right">Deviation Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BFEAF2]/40 bg-white">
                {validationMetrics.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#EAF7FB]/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#20343A]">
                      {row.metric}
                    </td>
                    <td className="px-6 py-4 text-[#4A636A] font-mono font-medium">
                      {row.centralized}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-[#1E7F8C]">
                      {row.federated}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          row.isPositive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-[#EAF7FB] text-[#20343A] border border-[#BFEAF2]'
                        }`}
                      >
                        {row.deviation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Clinical Evaluation Note Callout from PDF */}
        <StatusBanner
          title="Clinical Evaluation Note"
          description="Statistical results indicate that the federated training model loses minimal prediction metrics (ROC-AUC drop of only 0.003) compared to a centralized approach requiring a unified aggregate dataset. The model retains robust diagnostic sensitivity while adhering fully to zero egress compliance rules across nodes."
        />

        {/* Interactive Model Benchmark Comparison (Centralized LR, RF, XGBoost, Federated LR) */}
        <Card className="p-6 sm:p-8 bg-white">
          <ModelBenchmarkChart />
        </Card>

        {/* 2-Column: ROC Curve & Confusion Matrices */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: ROC Curve Comparison */}
          <Card className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#BFEAF2]/60 mb-5">
                <div>
                  <h3 className="text-base font-bold text-[#20343A]">
                    ROC Curve: Centralized vs. Federated
                  </h3>
                  <p className="text-xs text-[#4A636A]">
                    True Positive Rate vs. False Positive Rate
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#1E7F8C] block">
                    Fed AUC: 0.892
                  </span>
                  <span className="text-[11px] text-[#6A868F] block">
                    Central AUC: 0.895
                  </span>
                </div>
              </div>

              {/* SVG ROC Plot */}
              <div className="bg-[#EAF7FB]/40 p-4 rounded-2xl border border-[#BFEAF2]">
                <div className="relative h-64 w-full">
                  <svg
                    viewBox="0 0 300 200"
                    className="w-full h-full overflow-visible"
                  >
                    {/* Grid lines */}
                    <line x1="30" y1="20" x2="30" y2="180" stroke="#BFEAF2" strokeWidth="1" />
                    <line x1="30" y1="180" x2="290" y2="180" stroke="#BFEAF2" strokeWidth="1" />
                    <line x1="30" y1="100" x2="290" y2="100" stroke="#BFEAF2" strokeDasharray="3 3" strokeWidth="0.8" />
                    <line x1="160" y1="20" x2="160" y2="180" stroke="#BFEAF2" strokeDasharray="3 3" strokeWidth="0.8" />

                    {/* Diagonal baseline (random classifier) */}
                    <line
                      x1="30"
                      y1="180"
                      x2="290"
                      y2="20"
                      stroke="#A0AEC0"
                      strokeDasharray="4 4"
                      strokeWidth="1.5"
                    />

                    {/* Centralized curve */}
                    <path
                      d="M 30 180 Q 50 50, 160 35 T 290 20"
                      fill="none"
                      stroke="#63C9D6"
                      strokeWidth="3"
                    />

                    {/* Federated curve (FedAvg) */}
                    <path
                      d="M 30 180 Q 55 53, 165 37 T 290 20"
                      fill="none"
                      stroke="#1E7F8C"
                      strokeWidth="3"
                    />

                    {/* Axis text */}
                    <text x="160" y="198" textAnchor="middle" fontSize="10" fill="#4A636A">
                      False Positive Rate (FPR)
                    </text>
                    <text
                      x="-100"
                      y="14"
                      transform="rotate(-90)"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#4A636A"
                    >
                      True Positive Rate (TPR)
                    </text>
                  </svg>
                </div>

                {/* Legend */}
                <div className="mt-3 pt-3 border-t border-[#BFEAF2]/60 flex items-center justify-center gap-6 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-6 rounded-full bg-[#1E7F8C]" />
                    <span className="text-[#20343A]">Federated LR (0.892)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-6 rounded-full bg-[#63C9D6]" />
                    <span className="text-[#20343A]">Centralized LR (0.895)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-0.5 w-6 border-b border-dashed border-gray-400" />
                    <span className="text-[#6A868F]">Random Classifier</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Right: Confusion Matrices */}
          <Card className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#BFEAF2]/60 mb-5">
                <div>
                  <h3 className="text-base font-bold text-[#20343A]">
                    Confusion Matrix Comparison
                  </h3>
                  <p className="text-xs text-[#4A636A]">
                    Centralized vs. Federated Test Evaluations (N = 36,902)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Centralized Confusion Matrix */}
                <div className="rounded-2xl border border-[#BFEAF2] bg-[#EAF7FB]/30 p-4">
                  <h4 className="text-xs font-bold text-[#20343A] mb-3 text-center">
                    Centralized LR
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-white p-3 rounded-xl border border-[#BFEAF2]">
                      <span className="text-[10px] text-[#6A868F] block">TN</span>
                      <span className="text-sm font-bold text-[#20343A]">
                        {confusionMatrices.centralized.trueNegative.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                      <span className="text-[10px] text-amber-700 block">FP</span>
                      <span className="text-sm font-bold text-amber-800">
                        {confusionMatrices.centralized.falsePositive.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
                      <span className="text-[10px] text-rose-700 block">FN</span>
                      <span className="text-sm font-bold text-rose-800">
                        {confusionMatrices.centralized.falseNegative.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-[#1E7F8C] text-white p-3 rounded-xl shadow-xs">
                      <span className="text-[10px] text-[#BFEAF2] block">TP</span>
                      <span className="text-sm font-bold text-white">
                        {confusionMatrices.centralized.truePositive.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Federated Confusion Matrix */}
                <div className="rounded-2xl border border-[#1E7F8C] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-center gap-1.5 mb-3">
                    <h4 className="text-xs font-bold text-[#1E7F8C]">
                      Federated LR (FedAvg)
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-white p-3 rounded-xl border border-[#BFEAF2]">
                      <span className="text-[10px] text-[#6A868F] block">TN</span>
                      <span className="text-sm font-bold text-[#20343A]">
                        {confusionMatrices.federated.trueNegative.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                      <span className="text-[10px] text-amber-700 block">FP</span>
                      <span className="text-sm font-bold text-amber-800">
                        {confusionMatrices.federated.falsePositive.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
                      <span className="text-[10px] text-rose-700 block">FN</span>
                      <span className="text-sm font-bold text-rose-800">
                        {confusionMatrices.federated.falseNegative.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-[#1E7F8C] text-white p-3 rounded-xl shadow-xs">
                      <span className="text-[10px] text-[#BFEAF2] block">TP</span>
                      <span className="text-sm font-bold text-white">
                        {confusionMatrices.federated.truePositive.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 2-Column: Hospital FedAvg Aggregation Weights & Target Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hospital Aggregation Weights */}
          <Card className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#BFEAF2]/60 mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#20343A]">
                    Hospital Aggregation Weights
                  </h3>
                  <p className="text-xs text-[#4A636A]">
                    FedAvg aggregation weights based on local patient dataset sizes
                  </p>
                </div>
                <span className="text-xs font-bold text-[#1E7F8C] bg-[#EAF7FB] px-2.5 py-1 rounded-lg border border-[#BFEAF2]">
                  FedAvg Weights
                </span>
              </div>

              <div className="space-y-4">
                {hospitalWeights.map((h, i) => (
                  <div key={i} className="p-4 rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="text-[#20343A] flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-[#1E7F8C]" />
                        {h.hospital}
                      </span>
                      <span className="font-extrabold text-[#1E7F8C] text-sm">
                        {h.weight}%
                      </span>
                    </div>
                    <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-[#BFEAF2]">
                      <div
                        className="bg-[#1E7F8C] h-full rounded-full"
                        style={{ width: `${h.weight}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#6A868F] mt-1 block">
                      Local Dataset Volume: {h.datasetRecords} records
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-[#6A868F] italic mt-4 pt-3 border-t border-[#BFEAF2]/60">
              * Note: Weights represent mathematical FedAvg gradient aggregation factors, not raw data-sharing percentages.
            </p>
          </Card>

          {/* Target / Class Distribution */}
          <Card className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#BFEAF2]/60 mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#20343A]">
                    Test Set Target Distribution
                  </h3>
                  <p className="text-xs text-[#4A636A]">
                    Evaluated on 36,902 stratified hold-out test samples
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {targetDistribution.map((t, i) => (
                  <div key={i} className="p-4 rounded-xl border border-[#BFEAF2] bg-white">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-[#20343A]">{t.label}</span>
                      <span className="font-mono text-[#20343A]">
                        {t.count.toLocaleString()} ({t.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#EAF7FB] h-3.5 rounded-full overflow-hidden border border-[#BFEAF2]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${t.percentage}%`,
                          backgroundColor: t.color,
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-[#6A868F] mt-1 block">
                      Class Imbalance: Evaluated using Precision, Recall, and ROC-AUC.
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-[#EAF7FB]/60 border border-[#BFEAF2] text-xs text-[#4A636A] flex items-center gap-2">
              <Info className="h-4 w-4 text-[#1E7F8C] shrink-0" />
              <span>Balanced class weighting applied during local logistic loss updates.</span>
            </div>
          </Card>
        </div>

        {/* Interactive Federated Learning Architecture Diagram */}
        <Card className="p-6 sm:p-8">
          <div className="border-b border-[#BFEAF2]/60 pb-4 mb-6">
            <h3 className="text-base font-bold text-[#20343A]">
              Federated Learning Architecture & Zero-Egress Pipeline
            </h3>
            <p className="text-xs text-[#4A636A] mt-0.5">
              Simulated distributed multi-institutional architecture preserving raw patient records on local systems
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#EAF7FB]/40 border border-[#BFEAF2]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Box 1: Hospital 1/2/3 Local Systems */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A636A] block text-center">
                  1. Local Hospitals (Simulated)
                </span>
                <div className="p-3 rounded-xl bg-white border border-[#BFEAF2] shadow-xs text-center">
                  <span className="text-xs font-bold text-[#20343A] block">Hospital 1 (40%)</span>
                  <span className="text-[10px] text-[#6A868F]">Raw Patient Data Stored Locally</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#BFEAF2] shadow-xs text-center">
                  <span className="text-xs font-bold text-[#20343A] block">Hospital 2 (35%)</span>
                  <span className="text-[10px] text-[#6A868F]">Raw Patient Data Stored Locally</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#BFEAF2] shadow-xs text-center">
                  <span className="text-xs font-bold text-[#20343A] block">Hospital 3 (25%)</span>
                  <span className="text-[10px] text-[#6A868F]">Raw Patient Data Stored Locally</span>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex flex-col items-center justify-center text-[#1E7F8C]">
                <span className="text-[11px] font-bold text-[#1E7F8C] mb-1">Local Training</span>
                <div className="w-full h-0.5 bg-[#1E7F8C] relative">
                  <div className="absolute right-0 -top-1 border-y-4 border-y-transparent border-l-6 border-l-[#1E7F8C]" />
                </div>
                <span className="text-[10px] text-[#6A868F] mt-1">Weights Only (No Egress)</span>
              </div>

              {/* Box 2: Cloud FedAvg Aggregation */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A636A] block text-center">
                  2. Cloud FedAvg Server
                </span>
                <div className="p-5 rounded-2xl bg-white border-2 border-[#1E7F8C] shadow-sm text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF7FB] text-[#1E7F8C] mb-2">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-extrabold text-[#20343A]">
                    FedAvg Aggregator
                  </h4>
                  <p className="text-[11px] text-[#4A636A] mt-1 leading-relaxed">
                    Weighted Parameter Average:
                    <br />
                    <code className="font-mono text-[10px] text-[#1E7F8C] font-bold">
                      W = 0.40W₁ + 0.35W₂ + 0.25W₃
                    </code>
                  </p>
                </div>
              </div>

              {/* Box 3: Synchronized Node */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A636A] block text-center">
                  3. Clinical Node #METRO-04
                </span>
                <div className="p-5 rounded-2xl bg-[#1E7F8C] text-white shadow-md text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white mb-2">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-extrabold text-white">
                    Global LR Model
                  </h4>
                  <p className="text-[11px] text-[#BFEAF2] mt-1">
                    Deployed at FastAPI Node for inference
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

