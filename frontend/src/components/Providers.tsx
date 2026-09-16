'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { PatientProvider } from '@/context/PatientContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PatientProvider>{children}</PatientProvider>
    </AuthProvider>
  );
}

