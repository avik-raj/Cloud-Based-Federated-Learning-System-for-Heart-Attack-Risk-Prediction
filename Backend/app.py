import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd


app = FastAPI(
    title="Heart Attack Prediction API",
    description="Federated Learning Based Heart Attack Prediction API"
)

# Enable CORS for Next.js frontend
# Enable CORS for Next.js frontend and local testing
allowed_origins_env = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,*"
)
cors_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained federated model and preprocessing pipeline
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "Model", "federated_model.pkl")
PREPROCESSOR_PATH = os.path.join(BASE_DIR, "..", "Model", "preprocessor.pkl")
MODEL_DIR = os.environ.get(
    "MODEL_DIR",
    os.path.join(BASE_DIR, "..", "Model")
    if os.path.exists(os.path.join(BASE_DIR, "..", "Model", "federated_model.pkl"))
    else os.path.join(BASE_DIR, "Model")
)
MODEL_PATH = os.path.join(MODEL_DIR, "federated_model.pkl")
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, "preprocessor.pkl")

model = joblib.load(MODEL_PATH)
preprocessor = joblib.load(PREPROCESSOR_PATH)


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
    RaceEthnicityCategory: str = "White only, Non-Hispanic"
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
    if not patient_dict.get("RaceEthnicityCategory"):
        patient_dict["RaceEthnicityCategory"] = "White only, Non-Hispanic"

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