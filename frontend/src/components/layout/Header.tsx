'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Plus, Users, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  greeting?: string;
  showActions?: boolean;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Clinical Risk Analytics Hub',
  greeting,
  subtitle = 'Local model parameters synchronized with 3 external clinical nodes.',
  showActions = false,
  onOpenMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-20 bg-[#EAF7FB]/95 backdrop-blur-md border-b border-[#BFEAF2]/60 px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Title & Subtitles */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl text-[#20343A] hover:bg-white border border-[#BFEAF2]"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#20343A] tracking-tight">
              {title}
            </h1>
            {greeting && (
              <p className="text-sm font-semibold text-[#1E7F8C] mt-0.5">{greeting}</p>
            )}
            {subtitle && (
              <p className="text-xs text-[#4A636A] mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right Side: Node Status Badge & Optional Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Institutional Hub Status Badge */}
          <div className="flex items-center gap-2 rounded-full border border-[#BFEAF2] bg-white px-3.5 py-1.5 shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-[#20343A]">
              Federated Node Active
            </span>
            <span className="text-[11px] text-[#6A868F] border-l border-[#BFEAF2] pl-2">
              Institutional Hub: #METRO-04
            </span>
          </div>

          {/* Action CTAs (for Dashboard or Quick Access) */}
          {showActions && (
            <div className="flex items-center gap-2">
              <Link href="/patients/new">
                <Button size="sm" className="gap-1.5 shadow-sm">
                  <Plus className="h-4 w-4" />
                  New Prediction Run
                </Button>
              </Link>
              <Link href="/patients">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Users className="h-4 w-4" />
                  View Patient Directory
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

