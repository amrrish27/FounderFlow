import os
import sys
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND = os.path.join(ROOT, "backend")
if BACKEND not in sys.path:
    sys.path.insert(0, BACKEND)

from predictor import get_feature_importance, predict_startup

app = FastAPI(title="FounderFlow API", version="1.0.0")


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


@app.get("/api")
def root():
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
