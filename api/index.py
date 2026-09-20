import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent.parent
BACKEND = ROOT / "backend"
if str(BACKEND) not in sys.path:
    sys.path.insert(0, str(BACKEND))

from predictor import get_feature_importance, get_metrics, predict_startup
from services import analyze_idea, financial_plan, compare_competitor

app = FastAPI(title="FounderFlow ML API", version="7.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=False, allow_methods=["*"], allow_headers=["*"])

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
    tags: float

class IdeaInput(BaseModel):
    idea: str = Field(min_length=3)
    industry: str = "other"
    customer: str = ""
    budget: float = 0
    problem: str = ""
    solution: str = ""

class CompetitorInput(BaseModel):
    startup_name: str = "My Startup"
    startup_product: str = Field(min_length=3)
    startup_customer: str = ""
    startup_price: float = 0
    startup_advantage: str = ""
    competitor_name: str = Field(min_length=1)
    competitor_product: str = ""
    competitor_customer: str = ""
    competitor_price: float = 0
    competitor_strengths: str = ""
    competitor_weaknesses: str = ""

class FinancialInput(BaseModel):
    initial_investment: float = 0
    monthly_revenue: float = 0
    monthly_expenses: float = 0
    monthly_revenue_growth: float = 5
    monthly_expense_growth: float = 3
    price_per_unit: float = 0
    variable_cost_per_unit: float = 0
    fixed_monthly_costs: float = 0

@app.get("/api")
def root():
    return {"name":"FounderFlow ML API","status":"online","version":"7.1.0"}

@app.get("/api/health")
def health():
    return {"status":"healthy"}

@app.get("/api/model-metrics")
def model_metrics():
    return get_metrics()

@app.get("/api/feature-importance")
def feature_importance():
    return {"features": get_feature_importance()}

@app.post("/api/predict")
def predict(payload: StartupInput):
    try:
        return predict_startup(payload.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc

@app.post("/api/idea/analyze")
def idea(payload: IdeaInput):
    return analyze_idea(payload.model_dump())

@app.post("/api/financial/plan")
def finance(payload: FinancialInput):
    return financial_plan(payload.model_dump())

@app.post("/api/competitor/compare")
def competitor(payload: CompetitorInput):
    return compare_competitor(payload.model_dump())
