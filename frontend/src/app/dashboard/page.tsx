'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Activity,
  Server,
  HeartPulse,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { useAuth } from '@/context/AuthContext';
import { usePatients } from '@/context/PatientContext';

export default function DashboardPage() {
  const { doctor } = useAuth();
  const { patients } = usePatients();

  // Get recent predictions (with predictions present)
  const recentPredictions = patients
    .filter((p) => p.prediction)
    .slice(0, 4);

  return (
    <AppShell
      title="Clinical Risk Analytics Hub"
      greeting={`Good Morning, ${doctor.name}`}
      subtitle="Local model parameters synchronized with 3 external clinical nodes."
      showActions={true}
    >
      <div className="space-y-6">
        {/* Top 3 Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Total Patients Tracked */}
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#4A636A]">
                Total Patients Tracked
              </p>
              <h3 className="text-3xl font-extrabold text-[#20343A] mt-2">1,248</h3>
              <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+24 this week</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7FB] border border-[#BFEAF2] text-[#1E7F8C]">
              <Users className="h-6 w-6" />
            </div>
          </Card>

          {/* Card 2: Predictions Run Locally */}
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#4A636A]">
                Predictions Run Locally
              </p>
              <h3 className="text-3xl font-extrabold text-[#20343A] mt-2">3,892</h3>
              <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#1E7F8C]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>No data egress</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7FB] border border-[#BFEAF2] text-[#1E7F8C]">
              <HeartPulse className="h-6 w-6" />
            </div>
          </Card>

          {/* Card 3: High Risk Detected */}
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#4A636A]">
                High Risk Detected
              </p>
              <h3 className="text-3xl font-extrabold text-[#20343A] mt-2">114</h3>
              <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-rose-600">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Require immediate triage</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 border border-rose-200 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </Card>
        </div>

        {/* Two Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Recent Local Predictions */}
          <Card className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#BFEAF2]/60">
                <div>
                  <h3 className="text-base font-bold text-[#20343A]">
                    Recent Local Predictions
                  </h3>
                  <p className="text-xs text-[#4A636A] mt-0.5">
                    Latest inferences computed on local institutional node
                  </p>
                </div>
                <Link
                  href="/patients"
                  className="text-xs font-semibold text-[#1E7F8C] hover:text-[#16646F] flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Patient Rows List */}
              <div className="divide-y divide-[#BFEAF2]/50">
                {recentPredictions.map((patient) => {
                  const riskPercent = patient.prediction?.riskPercentage || 0;
                  const riskLevel = patient.prediction?.riskLevel || 'Low Risk';

                  return (
                    <Link
                      key={patient.id}
                      href={`/prediction/${patient.id}`}
                      className="group flex items-center justify-between py-4 hover:bg-[#EAF7FB]/50 px-2 -mx-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF7FB] border border-[#BFEAF2] text-xs font-bold text-[#1E7F8C]">
                          {patient.id}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#20343A] group-hover:text-[#1E7F8C] transition-colors">
                            {patient.name}
                          </h4>
                          <p className="text-xs text-[#4A636A]">
                            {patient.sex}, Age {patient.age}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <RiskBadge level={riskLevel} />
                        <div className="text-right w-12">
                          <span
                            className={`text-base font-extrabold ${
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
                        <ArrowUpRight className="h-4 w-4 text-[#6A868F] group-hover:text-[#1E7F8C] transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#BFEAF2]/40 text-center">
              <Link
                href="/patients/new"
                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#1E7F8C] hover:underline"
              >
                + Run prediction on a new patient record
              </Link>
            </div>
          </Card>

          {/* Right Column: Federated Local Node #METRO-04 */}
          <Card className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#BFEAF2]/60">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#EAF7FB] border border-[#BFEAF2] text-[#1E7F8C]">
                    <Server className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#20343A]">
                      Federated Local Node #METRO-04
                    </h3>
                    <p className="text-[11px] text-[#4A636A]">
                      Model and validation runtime metrics
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Model Risk Distribution (Last 100) */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-bold text-[#20343A] mb-2">
                  <span>Model Risk Distribution (Last 100)</span>
                </div>

                {/* Segmented Risk Bar */}
                <div className="h-4 w-full rounded-full bg-gray-100 overflow-hidden flex border border-[#BFEAF2]">
                  <div
                    style={{ width: '47%' }}
                    className="bg-[#1E7F8C] h-full"
                    title="Low Risk: 47%"
                  />
                  <div
                    style={{ width: '21%' }}
                    className="bg-[#63C9D6] h-full"
                    title="Moderate Risk: 21%"
                  />
                  <div
                    style={{ width: '32%' }}
                    className="bg-[#D1383A] h-full"
                    title="High Risk: 32%"
                  />
                </div>

                {/* Legend */}
                <div className="mt-3 flex items-center justify-between text-xs text-[#4A636A]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#1E7F8C]" />
                    <span>Low (47%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#63C9D6]" />
                    <span>Moderate (21%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#D1383A]" />
                    <span>High (32%)</span>
                  </div>
                </div>
              </div>

              {/* Accuracy Verification Status */}
              <div className="mt-6 pt-5 border-t border-[#BFEAF2]/60">
                <h4 className="text-xs font-bold text-[#20343A] uppercase tracking-wider mb-3">
                  Accuracy Verification Status
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/40 p-3 text-center">
                    <span className="block text-[11px] font-medium text-[#4A636A]">
                      Federated ROC-AUC
                    </span>
                    <span className="block text-lg font-extrabold text-[#20343A] mt-1">
                      0.892
                    </span>
                  </div>

                  <div className="rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/40 p-3 text-center">
                    <span className="block text-[11px] font-medium text-[#4A636A]">
                      Precision
                    </span>
                    <span className="block text-lg font-extrabold text-[#20343A] mt-1">
                      86.4%
                    </span>
                  </div>

                  <div className="rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/40 p-3 text-center">
                    <span className="block text-[11px] font-medium text-[#4A636A]">
                      Participating Nodes
                    </span>
                    <span className="block text-lg font-extrabold text-[#1E7F8C] mt-1">
                      3 Hospitals
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/insights">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#BFEAF2] bg-white py-2.5 text-xs font-bold text-[#1E7F8C] hover:bg-[#EAF7FB] transition-colors shadow-xs">
                  <Activity className="h-4 w-4" />
                  Explore Full Federated Insights & ROC Curves
                </button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

