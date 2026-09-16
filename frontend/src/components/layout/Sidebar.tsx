'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  LineChart,
  Activity,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();
  const { doctor, logout } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Patient Records',
      href: '/patients',
      icon: Users,
    },
    {
      name: 'Add Patient',
      href: '/patients/new',
      icon: UserPlus,
    },
    {
      name: 'Model Insights',
      href: '/insights',
      icon: LineChart,
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white border-r border-[#BFEAF2]/80 p-5 shadow-sm">
      <div>
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E7F8C] to-[#63C9D6] text-white shadow-sm">
            <Activity className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="block text-lg font-bold text-[#20343A] leading-tight tracking-tight">
              CardioGuard
            </span>
            <span className="block text-xs font-semibold text-[#1E7F8C] tracking-wide">
              Federated AI
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#1E7F8C] text-white shadow-sm shadow-[#1E7F8C]/20'
                    : 'text-[#4A636A] hover:bg-[#EAF7FB] hover:text-[#20343A]'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-[#1E7F8C]'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Institutional Node Info */}
      <div className="border-t border-[#BFEAF2]/80 pt-4 mt-6">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-[#EAF7FB]/60 border border-[#BFEAF2]/60">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E7F8C] text-white font-bold text-sm shadow-inner">
            {doctor.name
              .split(' ')
              .map((n) => n[0])
              .filter((_, i, arr) => i === 0 || i === arr.length - 1)
              .join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#20343A] truncate">{doctor.name}</p>
            <p className="text-[11px] text-[#4A636A] truncate">{doctor.hospital}</p>
          </div>
          <Link
            href="/login"
            onClick={logout}
            title="Sign out of local node"
            className="p-1.5 text-[#4A636A] hover:text-red-600 rounded-lg hover:bg-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-3 px-2 flex items-center justify-between text-[11px] text-[#6A868F]">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-[#1E7F8C]" />
            Node: #METRO-04
          </span>
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-64 shadow-xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

