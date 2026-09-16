// Hospital Options - Exactly 3 fictional healthcare nodes for simulation
export const HOSPITAL_OPTIONS = [
  'Apollo Crest Medical Center',
  'Green Valley Heart Institute',
  'Sunrise Care Hospital',
] as const;

export type HospitalName = (typeof HOSPITAL_OPTIONS)[number];

// The features expected by the backend Federated Heart Attack Prediction model
export interface PatientFeatures {
  State: string;
  Sex: string;
  GeneralHealth: string;
  PhysicalHealthDays: number;
  MentalHealthDays: number;
  LastCheckupTime: string;
  PhysicalActivities: string;
  SleepHours: number;
  RemovedTeeth: string;
  HadAngina: string;
  HadStroke: string;
  HadAsthma: string;
  HadSkinCancer: string;
  HadCOPD: string;
  HadDepressiveDisorder: string;
  HadKidneyDisease: string;
  HadArthritis: string;
  HadDiabetes: string;
  DeafOrHardOfHearing: string;
  BlindOrVisionDifficulty: string;
  DifficultyConcentrating: string;
  DifficultyWalking: string;
  DifficultyDressingBathing: string;
  DifficultyErrands: string;
  SmokerStatus: string;
  ECigaretteUsage: string;
  ChestScan: string;
  RaceEthnicityCategory?: string; // Not displayed in frontend; default supplied for model compatibility
  AgeCategory: string;
  HeightInMeters: number;
  WeightInKilograms: number;
  BMI: number;
  AlcoholDrinkers: string;
  HIVTesting: string;
  FluVaxLast12: string;
  PneumoVaxEver: string;
  TetanusLast10Tdap: string;
  HighRiskLastYear: string;
  CovidPos: string;
}

export type RiskLevel = 'Low Risk' | 'Moderate Risk' | 'High Risk';

export interface PredictionResult {
  prediction: 'Yes' | 'No';
  probability: number; // 0.0000 to 1.0000
  riskPercentage: number; // e.g. 78
  riskLevel: RiskLevel;
  modelName: string; // 'Federated Logistic Regression'
  algorithm: string; // 'FedAvg'
  computedAt: string; // ISO or formatted date
  contributingFactors?: {
    factor: string;
    impact: number; // e.g. +24
    isNegative?: boolean;
  }[];
}

export interface Patient {
  id: string; // e.g. "PAT-001"
  name: string; // e.g. "James Morrison"
  age: number;
  sex: 'Male' | 'Female';
  createdAt: string;
  lastPredictionDate: string;
  prediction?: PredictionResult;
  features: PatientFeatures;
}

export interface DoctorProfile {
  name: string;
  hospital: string;
  email: string;
  nodeId: string;
}
