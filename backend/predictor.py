from pathlib import Path
from typing import Any
import joblib
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "best_model.pkl"

FEATURES = [
    "founded_year",
    "country",
    "region",
    "industry",
    "funding_round",
    "funding_amount_usd",
    "lead_investor",
    "co_investors",
    "employee_count",
    "estimated_revenue_usd",
    "estimated_valuation_usd",
    "exit_type",
    "tags",
    "funding_year",
    "funding_month",
]

_model = None


def get_model():
    global _model
    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Model not found: {MODEL_PATH}")
        _model = joblib.load(MODEL_PATH)
    return _model


def predict_startup(x: dict[str, Any]) -> dict[str, Any]:
    model = get_model()
    row = {feature: float(x[feature]) for feature in FEATURES}
    frame = pd.DataFrame([row], columns=FEATURES)
    prediction = int(model.predict(frame)[0])
    probabilities = model.predict_proba(frame)[0]
    classes = list(model.classes_)

    prob_by_class = {int(cls): float(prob) for cls, prob in zip(classes, probabilities)}
    probability_not_exited = prob_by_class.get(0, 0.0)
    probability_exited = prob_by_class.get(1, 0.0)

    return {
        "prediction": prediction,
        "status": "Exited" if prediction == 1 else "Not Exited",
        "probability_not_exited": probability_not_exited,
        "probability_exited": probability_exited,
    }


def get_feature_importance() -> list[dict[str, float | str]]:
    model = get_model()
    importances = getattr(model, "feature_importances_", None)
    if importances is None:
        raise ValueError("Loaded model does not expose feature_importances_.")

    names = list(getattr(model, "feature_names_in_", FEATURES))
    items = [
        {"feature": str(name), "importance": float(value)}
        for name, value in zip(names, importances)
    ]
    return sorted(items, key=lambda item: item["importance"], reverse=True)
