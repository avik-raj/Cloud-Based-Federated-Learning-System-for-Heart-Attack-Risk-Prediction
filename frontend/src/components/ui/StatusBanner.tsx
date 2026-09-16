import React from 'react';
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

interface StatusBannerProps {
  title: string;
  description: string;
  variant?: 'info' | 'success';
  className?: string;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  title,
  description,
  variant = 'info',
  className = '',
}) => {
  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border border-[#BFEAF2] bg-[#EAF7FB]/80 p-5 ${className}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#BFEAF2] text-[#1E7F8C]">
        {variant === 'success' ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <ShieldCheck className="h-5 w-5" />
        )}
      </div>
      <div>
        <h4 className="font-semibold text-[#20343A] text-sm">{title}</h4>
        <p className="mt-0.5 text-xs text-[#4A636A] leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

