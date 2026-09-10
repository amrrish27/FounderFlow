from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from predictor import FEATURES, get_feature_importance, predict_startup

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


@app.get("/")
def root():
    return {"name": "FounderFlow API", "status": "online"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/predict")
def predict(payload: StartupInput):
    try:
        return predict_startup(payload.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc


@app.get("/feature-importance")
def feature_importance():
    try:
        features = get_feature_importance()
        return {"features": features}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Feature importance failed: {exc}") from exc
