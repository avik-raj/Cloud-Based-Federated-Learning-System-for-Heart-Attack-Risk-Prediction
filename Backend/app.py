from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd


app = FastAPI(
    title="Heart Attack Prediction API",
    description="Federated Learning Based Heart Attack Prediction API"
)


# Load trained federated model and preprocessing pipeline
model = joblib.load("../Model/federated_model.pkl")
preprocessor = joblib.load("../Model/preprocessor.pkl")


# Patient input structure
class PatientData(BaseModel):

    State: str
    Sex: str
    GeneralHealth: str
    PhysicalHealthDays: float
    MentalHealthDays: float
    LastCheckupTime: str
    PhysicalActivities: str
    SleepHours: float
    RemovedTeeth: str
    HadAngina: str
    HadStroke: str
    HadAsthma: str
    HadSkinCancer: str
    HadCOPD: str
    HadDepressiveDisorder: str
    HadKidneyDisease: str
    HadArthritis: str
    HadDiabetes: str
    DeafOrHardOfHearing: str
    BlindOrVisionDifficulty: str
    DifficultyConcentrating: str
    DifficultyWalking: str
    DifficultyDressingBathing: str
    DifficultyErrands: str
    SmokerStatus: str
    ECigaretteUsage: str
    ChestScan: str
    RaceEthnicityCategory: str
    AgeCategory: str
    HeightInMeters: float
    WeightInKilograms: float
    BMI: float
    AlcoholDrinkers: str
    HIVTesting: str
    FluVaxLast12: str
    PneumoVaxEver: str
    TetanusLast10Tdap: str
    HighRiskLastYear: str
    CovidPos: str


@app.get("/")
def home():
    return {
        "message": "Heart Attack Prediction API is running"
    }


@app.post("/predict")
def predict(patient: PatientData):

    # Convert patient input into a dictionary
    patient_dict = patient.model_dump()

    # Convert dictionary into DataFrame
    input_data = pd.DataFrame([patient_dict])

    # Apply the same preprocessing used during training
    input_encoded = preprocessor.transform(input_data)

    # Get probability of heart attack
    probability = model.predict_proba(input_encoded)[0][1]

    # Threshold selected during validation
    threshold = 0.82

    # Final prediction
    prediction = "Yes" if probability >= threshold else "No"

    return {
        "prediction": prediction,
        "probability": round(float(probability), 4)
    }