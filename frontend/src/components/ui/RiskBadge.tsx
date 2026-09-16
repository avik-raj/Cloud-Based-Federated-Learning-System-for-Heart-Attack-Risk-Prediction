import React from 'react';
import { RiskLevel } from '@/types/patient';

interface RiskBadgeProps {
  level: RiskLevel | 'High Risk' | 'Low Risk' | 'Moderate Risk' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const isHigh = level.toLowerCase().includes('high');
  const isMod = level.toLowerCase().includes('mod');

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-semibold',
  }[size];

  if (isHigh) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 text-red-700 ${sizeClasses}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
        High Risk
      </span>
    );
  }

  if (isMod) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 ${sizeClasses}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Moderate Risk
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[#BFEAF2] bg-[#EAF7FB] text-[#1E7F8C] ${sizeClasses}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#1E7F8C]" />
      Low Risk
    </span>
  );
};

