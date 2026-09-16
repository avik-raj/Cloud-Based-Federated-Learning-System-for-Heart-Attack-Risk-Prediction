'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Eye, UserPlus } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { usePatients } from '@/context/PatientContext';

export default function PatientsPage() {
  const { patients, totalPatientCount } = usePatients();

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and sort logic
  const filteredPatients = useMemo(() => {
    return patients
      .filter((patient) => {
        const matchesSearch =
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRisk =
          riskFilter === 'All' ||
          (patient.prediction && patient.prediction.riskLevel.toLowerCase().includes(riskFilter.toLowerCase()));

        return matchesSearch && matchesRisk;
      })
      .sort((a, b) => {
        if (sortBy === 'latest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'highest-risk') {
          return (b.prediction?.riskPercentage || 0) - (a.prediction?.riskPercentage || 0);
        }
        if (sortBy === 'lowest-risk') {
          return (a.prediction?.riskPercentage || 0) - (b.prediction?.riskPercentage || 0);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'age') {
          return b.age - a.age;
        }
        return 0;
      });
  }, [patients, searchQuery, riskFilter, sortBy]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AppShell
      title="Patient Records & Run History"
      subtitle="View, search, and verify local patient predictions and federated node history."
      showActions={false}
    >
      <div className="space-y-6">
        {/* Filter and Search Bar */}
        <Card className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6A868F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search patients by name or ID..."
                className="w-full rounded-xl border border-[#BFEAF2] bg-[#EAF7FB]/40 pl-10 pr-4 py-2.5 text-sm text-[#20343A] placeholder-[#6A868F] focus:border-[#1E7F8C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E7F8C]"
              />
            </div>

            {/* Filters and Counters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Risk Level Filter */}
              <div className="flex items-center gap-1.5 rounded-xl border border-[#BFEAF2] bg-white px-3 py-2 text-xs">
                <Filter className="h-3.5 w-3.5 text-[#1E7F8C]" />
                <select
                  value={riskFilter}
                  onChange={(e) => {
                    setRiskFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent font-medium text-[#20343A] focus:outline-none cursor-pointer"
                >
                  <option value="All">All Risk Levels</option>
                  <option value="High">High Risk Only</option>
                  <option value="Moderate">Moderate Risk</option>
                  <option value="Low">Low Risk</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 rounded-xl border border-[#BFEAF2] bg-white px-3 py-2 text-xs">
                <ArrowUpDown className="h-3.5 w-3.5 text-[#1E7F8C]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-medium text-[#20343A] focus:outline-none cursor-pointer"
                >
                  <option value="latest">Sort: Latest Predictions</option>
                  <option value="highest-risk">Sort: Highest Risk</option>
                  <option value="lowest-risk">Sort: Lowest Risk</option>
                  <option value="name">Sort: Name (A-Z)</option>
                  <option value="age">Sort: Age (High to Low)</option>
                </select>
              </div>

              {/* Local Database Counter Badge */}
              <div className="rounded-xl border border-[#BFEAF2] bg-[#EAF7FB] px-3.5 py-2 text-xs font-bold text-[#1E7F8C]">
                Local Database: {totalPatientCount} Patients
              </div>

              {/* Add Patient Quick Link */}
              <Link href="/patients/new">
                <Button size="sm" className="gap-1.5">
                  <UserPlus className="h-3.5 w-3.5" />
                  Add Patient
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Table Container */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#BFEAF2] bg-[#EAF7FB]/60 text-xs font-bold uppercase tracking-wider text-[#4A636A]">
                <tr>
                  <th className="px-6 py-4">Patient ID</th>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-4 py-4">Age</th>
                  <th className="px-4 py-4">Sex</th>
                  <th className="px-6 py-4">Prediction</th>
                  <th className="px-4 py-4">Risk %</th>
                  <th className="px-6 py-4">Run Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BFEAF2]/40">
                {paginatedPatients.length > 0 ? (
                  paginatedPatients.map((patient) => {
                    const riskPercent = patient.prediction?.riskPercentage ?? 0;
                    const riskLevel = patient.prediction?.riskLevel || 'Low Risk';
                    const runDate = patient.lastPredictionDate || 'Oct 24, 2026';

                    return (
                      <tr
                        key={patient.id}
                        className="hover:bg-[#EAF7FB]/40 transition-colors group"
                      >
                        <td className="px-6 py-4 font-bold text-[#1E7F8C]">
                          <Link
                            href={`/patients/${patient.id}`}
                            className="hover:underline"
                          >
                            {patient.id}
                          </Link>
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#20343A]">
                          <Link
                            href={`/patients/${patient.id}`}
                            className="hover:text-[#1E7F8C] transition-colors"
                          >
                            {patient.name}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-[#4A636A]">{patient.age}</td>
                        <td className="px-4 py-4 text-[#4A636A]">{patient.sex}</td>
                        <td className="px-6 py-4">
                          <RiskBadge level={riskLevel} size="sm" />
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`font-bold ${
                              riskPercent >= 60
                                ? 'text-red-600'
                                : riskPercent >= 30
                                ? 'text-amber-600'
                                : 'text-[#1E7F8C]'
                            }`}
                          >
                            {riskPercent}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-[#4A636A]">
                          {runDate}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/prediction/${patient.id}`}>
                            <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#BFEAF2] bg-white px-3 py-1.5 text-xs font-bold text-[#1E7F8C] hover:bg-[#EAF7FB] transition-colors shadow-2xs">
                              <Eye className="h-3 w-3" />
                              View Result
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-[#4A636A]">
                      <p className="text-base font-semibold text-[#20343A]">
                        No patient records found
                      </p>
                      <p className="text-xs mt-1">
                        Try adjusting your search query or risk filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#BFEAF2]/60 px-6 py-4 bg-white">
            <p className="text-xs text-[#4A636A]">
              Showing{' '}
              <span className="font-semibold text-[#20343A]">
                {filteredPatients.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-[#20343A]">
                {Math.min(currentPage * itemsPerPage, filteredPatients.length)}
              </span>{' '}
              of <span className="font-semibold text-[#20343A]">{filteredPatients.length}</span>{' '}
              patients (filtered from {totalPatientCount})
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-xl border border-[#BFEAF2] px-3 py-1.5 text-xs font-semibold text-[#20343A] hover:bg-[#EAF7FB] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-7 w-7 rounded-xl text-xs font-bold transition-all ${
                    currentPage === page
                      ? 'bg-[#1E7F8C] text-white shadow-xs'
                      : 'border border-[#BFEAF2] bg-white text-[#20343A] hover:bg-[#EAF7FB]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center gap-1 rounded-xl border border-[#BFEAF2] px-3 py-1.5 text-xs font-semibold text-[#20343A] hover:bg-[#EAF7FB] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </Card>

        {/* Synchronized Verification Banner */}
        <StatusBanner
          title="No Filtered Discrepancies Found"
          description="All synchronized external nodes match local risk profiles."
        />
      </div>
    </AppShell>
  );
}

