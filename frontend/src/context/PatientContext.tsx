'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, PatientFeatures, PredictionResult } from '@/types/patient';
import { initialPatients } from '@/data/seedPatients';

interface PatientContextType {
  patients: Patient[];
  totalPatientCount: number;
  getPatient: (id: string) => Patient | undefined;
  addPatient: (name: string, age: number, sex: 'Male' | 'Female', features: PatientFeatures, prediction?: PredictionResult) => Patient;
  updatePrediction: (patientId: string, prediction: PredictionResult) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);

  useEffect(() => {
    const saved =
      localStorage.getItem('cardioguard_patients') ||
      localStorage.getItem('cardiofed_patients');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPatients(parsed);
        }
      } catch {
        // fallback to initial
      }
    }
  }, []);

  const saveToStorage = (updatedList: Patient[]) => {
    setPatients(updatedList);
    try {
      localStorage.setItem('cardioguard_patients', JSON.stringify(updatedList));
    } catch {
      // storage quota or error
    }
  };

  const getPatient = (id: string) => {
    return patients.find((p) => p.id.toLowerCase() === id.toLowerCase());
  };

  const addPatient = (
    name: string,
    age: number,
    sex: 'Male' | 'Female',
    features: PatientFeatures,
    prediction?: PredictionResult
  ): Patient => {
    // Generate next PAT ID
    const nextNumber = patients.length + 1;
    const padded = String(nextNumber).padStart(3, '0');
    const newId = `PAT-${padded}`;
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newPatient: Patient = {
      id: newId,
      name,
      age,
      sex,
      createdAt: new Date().toISOString(),
      lastPredictionDate: today,
      prediction,
      features,
    };

    const updated = [newPatient, ...patients];
    saveToStorage(updated);
    return newPatient;
  };

  const updatePrediction = (patientId: string, prediction: PredictionResult) => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const updated = patients.map((p) => {
      if (p.id.toLowerCase() === patientId.toLowerCase()) {
        return {
          ...p,
          prediction,
          lastPredictionDate: today,
        };
      }
      return p;
    });
    saveToStorage(updated);
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        totalPatientCount: 124 + (patients.length - initialPatients.length),
        getPatient,
        addPatient,
        updatePrediction,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
}

