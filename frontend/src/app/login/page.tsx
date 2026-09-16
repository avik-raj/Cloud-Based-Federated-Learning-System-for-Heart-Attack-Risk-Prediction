'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  Sparkles,
  Layers,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { HOSPITAL_OPTIONS, HospitalName } from '@/types/patient';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [hospital, setHospital] = useState<HospitalName>(HOSPITAL_OPTIONS[0]);
  const [doctorName, setDoctorName] = useState('Dr. Elena Rostova');
  const [email, setEmail] = useState('e.rostova@metrocardiology.org');
  const [password, setPassword] = useState('Doctor@Node2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!hospital || !doctorName.trim() || !email.trim()) {
      setErrorMessage('Please select a hospital and provide your doctor credentials.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your institutional password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(hospital, doctorName, email);
      setIsLoading(false);
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#EAF7FB] flex flex-col justify-center px-4 py-8 sm:py-12">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Project Information & About Section (matching Screenshot 2) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Brand header */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#1E7F8C] to-[#63C9D6] text-white shadow-md shadow-[#1E7F8C]/20">
              <Activity className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#20343A] tracking-tight">
                CardioGuard
              </span>
              <span className="rounded-full bg-[#BFEAF2]/60 px-2.5 py-0.5 text-xs font-bold text-[#1E7F8C] border border-[#BFEAF2]">
                Decision Support
              </span>
            </div>
          </div>

          {/* Research Badge from Reference */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#63C9D6]/60 bg-white/80 px-4 py-1.5 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#1E7F8C]" />
            <span className="text-xs font-semibold text-[#1E7F8C] tracking-wide">
              Research Initiative • Privacy-Preserving Healthcare Decision Support
            </span>
          </div>

          {/* Main Headline from Reference */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#20343A] leading-[1.1] tracking-tight">
            Predict Earlier.
            <br />
            Understand Better.
            <br />
            <span className="text-[#1E7F8C]">Treat Smarter.</span>
          </h1>

          {/* Supporting Description from Reference */}
          <p className="text-base sm:text-lg text-[#4A636A] font-medium leading-relaxed max-w-xl">
            AI-powered, privacy-aware healthcare decision support for patients, doctors and
            pharmacists — built on collaborative federated intelligence.
          </p>

          {/* Academic / Research Scope Notice */}
          <div className="rounded-2xl border border-[#BFEAF2] bg-white/70 p-4 max-w-xl text-xs text-[#4A636A] leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#20343A]">
              <Layers className="h-4 w-4 text-[#1E7F8C]" />
              <span>Simulated Multi-Hospital Federated Learning</span>
            </div>
            <p>
              CardioGuard is an academic and research-oriented clinical decision-support system
              that uses federated learning (Logistic Regression + FedAvg) to simulate collaborative
              model training across 3 simulated healthcare nodes while keeping raw patient data
              strictly local.
            </p>
            <p className="text-[11px] text-[#6A868F] italic">
              * Note: Provides statistical risk stratification assistance. This calculation is a
              clinical recommendation aid and does not constitute a diagnostic certainty.
            </p>
          </div>
        </div>

        {/* Right Column: Doctor Login Form */}
        <div className="lg:col-span-5 w-full">
          <div className="w-full bg-white rounded-3xl border border-[#BFEAF2] p-8 sm:p-10 shadow-xl shadow-[#1E7F8C]/5">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#20343A] tracking-tight">
                Node Portal Sign In
              </h2>
              <p className="text-xs text-[#4A636A] mt-1">
                Access local clinical inference and patient risk telemetry
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CHANGE 7: Hospital Dropdown with EXACTLY 3 hospitals */}
              <div>
                <label className="block text-xs font-bold text-[#20343A] mb-1.5 flex items-center justify-between">
                  <span>Hospital Node Affiliation</span>
                  <span className="text-[10px] text-[#1E7F8C] font-semibold">3 Simulated Sites</span>
                </label>
                <div className="relative">
                  <select
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value as HospitalName)}
                    className="w-full rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/40 px-3.5 py-2.5 text-sm font-semibold text-[#20343A] focus:border-[#1E7F8C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E7F8C] transition-all cursor-pointer appearance-none pr-9"
                  >
                    {HOSPITAL_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#1E7F8C]">
                    <Building2 className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Doctor Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                  Doctor Full Name
                </label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Elena Rostova"
                  className="w-full rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30 px-3.5 py-2.5 text-sm text-[#20343A] placeholder-[#6A868F] focus:border-[#1E7F8C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E7F8C] transition-all"
                />
              </div>

              {/* Institutional Email */}
              <div>
                <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@hospital.org"
                  className="w-full rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30 px-3.5 py-2.5 text-sm text-[#20343A] placeholder-[#6A868F] focus:border-[#1E7F8C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E7F8C] transition-all"
                />
              </div>

              {/* CHANGE 5: Password with working Show/Hide Toggle */}
              <div>
                <label className="block text-xs font-bold text-[#20343A] mb-1.5">
                  Institutional Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/30 px-3.5 py-2.5 pr-20 text-sm text-[#20343A] placeholder-[#6A868F] focus:border-[#1E7F8C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E7F8C] transition-all font-mono"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center gap-1 px-3 text-xs font-bold text-[#1E7F8C] hover:text-[#16646F] focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full py-3 text-sm font-bold tracking-wide shadow-md shadow-[#1E7F8C]/20 bg-[#1E7F8C] hover:bg-[#16646F]"
                >
                  Sign In to Node
                </Button>
              </div>
            </form>

            {/* Privacy Footnote */}
            <div className="mt-6 pt-4 border-t border-[#BFEAF2]/60 text-center">
              <p className="text-[11px] text-[#6A868F] leading-relaxed flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#1E7F8C] shrink-0" />
                <span>
                  Zero-knowledge patient data privacy. Node calculations run locally on selected hospital systems.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
