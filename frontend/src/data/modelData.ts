export interface ValidationMetric {
  metric: string;
  centralized: string;
  federated: string;
  deviation: string;
  isPositive?: boolean;
}

export const validationMetrics: ValidationMetric[] = [
  {
    metric: 'Model Accuracy',
    centralized: '89.4%',
    federated: '89.2%',
    deviation: 'Comparable',
  },
  {
    metric: 'Model Precision',
    centralized: '86.8%',
    federated: '86.4%',
    deviation: 'Comparable',
  },
  {
    metric: 'Recall / Sensitivity',
    centralized: '84.1%',
    federated: '84.5%',
    deviation: '+0.4% Federated',
    isPositive: true,
  },
  {
    metric: 'F1 Score',
    centralized: '85.4%',
    federated: '85.4%',
    deviation: 'Identical',
  },
  {
    metric: 'ROC-AUC',
    centralized: '0.895',
    federated: '0.892',
    deviation: '-0.003 Difference',
  },
];

// Multi-model benchmark performance comparison
export interface ModelBenchmark {
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
  isFederated?: boolean;
}

export const modelBenchmarks: ModelBenchmark[] = [
  {
    model: 'Centralized Logistic Regression',
    accuracy: 89.4,
    precision: 86.8,
    recall: 84.1,
    f1: 85.4,
    rocAuc: 0.895,
  },
  {
    model: 'Random Forest (Centralized)',
    accuracy: 91.5,
    precision: 88.2,
    recall: 85.6,
    f1: 86.9,
    rocAuc: 0.902,
  },
  {
    model: 'XGBoost (Centralized)',
    accuracy: 92.1,
    precision: 89.1,
    recall: 86.4,
    f1: 87.7,
    rocAuc: 0.908,
  },
  {
    model: 'Federated Logistic Regression + FedAvg',
    accuracy: 89.2,
    precision: 86.4,
    recall: 84.5,
    f1: 85.4,
    rocAuc: 0.892,
    isFederated: true,
  },
];

// Hospital aggregation weights (FedAvg)
export const hospitalWeights = [
  {
    hospital: 'Hospital 1 (Regional Medical Center)',
    shortName: 'Hospital 1',
    weight: 40.0,
    datasetRecords: '98,405',
    color: '#1E7F8C',
  },
  {
    hospital: 'Hospital 2 (Metropolitan Health System)',
    shortName: 'Hospital 2',
    weight: 35.0,
    datasetRecords: '86,104',
    color: '#63C9D6',
  },
  {
    hospital: 'Hospital 3 (University Cardiology Institute)',
    shortName: 'Hospital 3',
    weight: 25.0,
    datasetRecords: '61,504',
    color: '#BFEAF2',
  },
];

// Target Class Distribution
export const targetDistribution = [
  {
    label: 'No Heart Attack',
    category: 'Negative Class',
    count: 34887,
    percentage: 94.54,
    color: '#1E7F8C',
  },
  {
    label: 'Heart Attack (High Risk)',
    category: 'Positive Class',
    count: 2015,
    percentage: 5.46,
    color: '#D1383A',
  },
];

// Confusion Matrices
export const confusionMatrices = {
  centralized: {
    title: 'Centralized Model Confusion Matrix',
    trueNegative: 33561,
    falsePositive: 1326,
    falseNegative: 964,
    truePositive: 1051,
    total: 36902,
  },
  federated: {
    title: 'Federated Model (FedAvg) Confusion Matrix',
    trueNegative: 33516,
    falsePositive: 1371,
    falseNegative: 952,
    truePositive: 1063,
    total: 36902,
  },
};

// ROC Curve coordinates approximation
export const rocCurveData = [
  { fpr: 0.0, centralTpr: 0.0, fedTpr: 0.0, random: 0.0 },
  { fpr: 0.02, centralTpr: 0.28, fedTpr: 0.27, random: 0.02 },
  { fpr: 0.05, centralTpr: 0.52, fedTpr: 0.51, random: 0.05 },
  { fpr: 0.10, centralTpr: 0.71, fedTpr: 0.70, random: 0.10 },
  { fpr: 0.15, centralTpr: 0.81, fedTpr: 0.81, random: 0.15 },
  { fpr: 0.20, centralTpr: 0.86, fedTpr: 0.86, random: 0.20 },
  { fpr: 0.30, centralTpr: 0.91, fedTpr: 0.90, random: 0.30 },
  { fpr: 0.40, centralTpr: 0.94, fedTpr: 0.94, random: 0.40 },
  { fpr: 0.60, centralTpr: 0.97, fedTpr: 0.97, random: 0.60 },
  { fpr: 0.80, centralTpr: 0.99, fedTpr: 0.99, random: 0.80 },
  { fpr: 1.0, centralTpr: 1.0, fedTpr: 1.0, random: 1.0 },
];

