import { PatientFeatures, PredictionResult, RiskLevel } from '@/types/patient';

export interface PredictApiResponse {
  prediction: 'Yes' | 'No';
  probability: number;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

/**
 * Calculates dynamic contributing risk factors based on the patient's individual clinical features
 */
function deriveContributingFactors(features: PatientFeatures, probability: number) {
  const factors: { factor: string; impact: number; isNegative?: boolean }[] = [];

  if (features.HadAngina === 'Yes') {
    factors.push({ factor: 'Angina History Diagnosis', impact: 24 });
  }
  if (features.HadStroke === 'Yes') {
    factors.push({ factor: 'Prior Stroke History Indicator', impact: 22 });
  }
  if (features.AgeCategory.includes('60') || features.AgeCategory.includes('65') || features.AgeCategory.includes('70') || features.AgeCategory.includes('75') || features.AgeCategory.includes('80')) {
    factors.push({ factor: `Age Bracket Category (${features.AgeCategory})`, impact: 18 });
  }
  if (features.SleepHours < 6) {
    factors.push({ factor: `Sleep Quality Restriction (Avg ${features.SleepHours} Hours)`, impact: 12 });
  }
  if (features.BMI >= 28) {
    factors.push({ factor: `Elevated BMI Index (${features.BMI.toFixed(1)})`, impact: 10 });
  }
  if (features.HadDiabetes === 'Yes' || features.HadDiabetes.includes('pre-diabetes')) {
    factors.push({ factor: 'Diabetic / Borderline Marker', impact: 14 });
  }
  if (features.SmokerStatus.includes('Current smoker')) {
    factors.push({ factor: 'Current Active Tobacco Usage', impact: 16 });
  }
  if (features.PhysicalActivities === 'No') {
    factors.push({ factor: 'Sedentary Physical Activity Profile', impact: 8 });
  }

  // Favorable protective factors if low risk
  if (features.PhysicalActivities === 'Yes' && factors.length < 3) {
    factors.push({ factor: 'Regular Cardiorespiratory Physical Activity', impact: 15, isNegative: true });
  }
  if (features.SmokerStatus === 'Never smoked' && factors.length < 3) {
    factors.push({ factor: 'Non-Smoker History', impact: 12, isNegative: true });
  }
  if (features.GeneralHealth === 'Excellent' || features.GeneralHealth === 'Very good') {
    factors.push({ factor: `Positive Self-Reported Health (${features.GeneralHealth})`, impact: 10, isNegative: true });
  }

  if (factors.length === 0) {
    factors.push({ factor: 'Baseline Demographic Factor Distribution', impact: 5 });
  }

  return factors.slice(0, 4);
}

export async function runFederatedPrediction(features: PatientFeatures): Promise<PredictionResult> {
  let response: Response | null = null;
  let data: PredictApiResponse | null = null;

  // 1. Try direct call to FastAPI backend
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    response = await fetch(`${BACKEND_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(features),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      data = await response.json();
    }
  } catch {
    // If direct fetch fails, fallback to Next.js API route proxy
  }

  // 2. Fallback to internal Next.js proxy route /api/predict
  if (!data) {
    try {
      const internalRes = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(features),
      });

      if (internalRes.ok) {
        data = await internalRes.json();
      }
    } catch {
      // Both attempts failed
    }
  }

  if (!data) {
    throw new Error('Unable to connect to the prediction service. Please try again.');
  }

  const rawProb = typeof data.probability === 'number' ? data.probability : 0.0;
  const riskPercentage = Math.min(Math.max(Math.round(rawProb * 100), 0), 100);

  let riskLevel: RiskLevel = 'Low Risk';
  if (riskPercentage >= 60) {
    riskLevel = 'High Risk';
  } else if (riskPercentage >= 30) {
    riskLevel = 'Moderate Risk';
  }

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} Local Node Time`;

  return {
    prediction: data.prediction,
    probability: rawProb,
    riskPercentage,
    riskLevel,
    modelName: 'Federated Logistic Regression',
    algorithm: 'FedAvg',
    computedAt: formattedDate,
    contributingFactors: deriveContributingFactors(features, rawProb),
  };
}

