'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DoctorProfile, HOSPITAL_OPTIONS } from '@/types/patient';

interface AuthContextType {
  doctor: DoctorProfile;
  isAuthenticated: boolean;
  login: (hospital: string, doctorName: string, email: string) => void;
  logout: () => void;
}

const defaultDoctor: DoctorProfile = {
  name: 'Dr. Elena Rostova',
  hospital: HOSPITAL_OPTIONS[0], // 'Apollo Crest Medical Center'
  email: 'e.rostova@metrocardiology.org',
  nodeId: '#METRO-04',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [doctor, setDoctor] = useState<DoctorProfile>(defaultDoctor);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    const saved =
      localStorage.getItem('cardioguard_auth') || localStorage.getItem('cardiofed_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDoctor(parsed);
        setIsAuthenticated(true);
      } catch {
        // ignore parse error
      }
    }
  }, []);

  const login = (hospital: string, doctorName: string, email: string) => {
    const profile: DoctorProfile = {
      hospital: hospital || HOSPITAL_OPTIONS[0],
      name: doctorName || defaultDoctor.name,
      email: email || defaultDoctor.email,
      nodeId: '#METRO-04',
    };
    setDoctor(profile);
    setIsAuthenticated(true);
    localStorage.setItem('cardioguard_auth', JSON.stringify(profile));
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cardioguard_auth');
    localStorage.removeItem('cardiofed_auth');
  };

  return (
    <AuthContext.Provider value={{ doctor, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
