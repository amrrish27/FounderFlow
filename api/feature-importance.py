import os
import sys
from fastapi import FastAPI, HTTPException

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND = os.path.join(ROOT, "backend")
if BACKEND not in sys.path:
    sys.path.insert(0, BACKEND)

from predictor import get_feature_importance

app = FastAPI(title="FounderFlow Feature Importance API")


@app.get("/")
def feature_importance():
    try:
        return {"features": get_feature_importance()}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Feature importance failed: {exc}") from exc
