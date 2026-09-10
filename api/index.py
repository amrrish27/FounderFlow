import sys
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

ROOT = Path(__file__).resolve().parent.parent
BACKEND = ROOT / "backend"
FRONTEND = ROOT / "frontend"

if str(BACKEND) not in sys.path:
    sys.path.insert(0, str(BACKEND))

from predictor import get_feature_importance, predict_startup

app = FastAPI(
    title="FounderFlow API",
    description="Startup exit prediction API powered by the trained Random Forest model.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StartupInput(BaseModel):
    founded_year: float
    country: float
    region: float
    industry: float
    employee_count: float
    estimated_revenue_usd: float
    estimated_valuation_usd: float
    funding_round: float
    funding_amount_usd: float
    lead_investor: float
    co_investors: float
    funding_year: float
    funding_month: float
    exit_type: float
    tags: float


# Vercel maps api/index.py to /api/*, so the FastAPI routes must retain
# the /api prefix to match the incoming production URL.
@app.get("/api")
def api_root():
    return {"name": "FounderFlow API", "status": "online"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}


@app.post("/api/predict")
def predict(payload: StartupInput):
    try:
        return predict_startup(payload.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc


@app.get("/api/feature-importance")
def feature_importance():
    try:
        return {"features": get_feature_importance()}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Feature importance failed: {exc}") from exc


# Serve the existing static UI from the FastAPI application root.
if FRONTEND.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND), html=True), name="frontend")
