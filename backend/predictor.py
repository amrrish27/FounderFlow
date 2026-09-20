from pathlib import Path
from typing import Any
import json
import joblib
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "best_model.pkl"
TREE_PATH = BASE_DIR / "models" / "model_tree.json"

FEATURES = ["founded_year","country","region","industry","funding_round","funding_amount_usd","lead_investor","co_investors","employee_count","estimated_revenue_usd","estimated_valuation_usd","tags","funding_year","funding_month"]

_model = None
_tree = None

def get_model():
    global _model
    if _model is None and MODEL_PATH.exists():
        try:
            _model = joblib.load(MODEL_PATH)
        except Exception:
            _model = False
    return _model if _model is not False else None

def get_tree():
    global _tree
    if _tree is None:
        _tree = json.loads(TREE_PATH.read_text(encoding="utf-8"))
    return _tree

def _tree_probability(values: dict[str, float]) -> tuple[float, int]:
    t = get_tree()
    names = t["features"]
    node = 0
    while t["children_left"][node] != t["children_right"][node]:
        feature_index = t["feature"][node]
        threshold = t["threshold"][node]
        value = float(values[names[feature_index]])
        node = t["children_left"][node] if value <= threshold else t["children_right"][node]
    counts = t["value"][node][0]
    total = sum(float(v) for v in counts)
    success = float(counts[1]) / total if total else 0.5
    return success, node

def _explanations(row: pd.DataFrame, model):
    importances = getattr(model, "feature_importances_", None)
    names = list(getattr(model, "feature_names_in_", FEATURES))
    if importances is None:
        t = get_tree()
        importances = t["feature_importances"]
        names = t["features"]
    values = row.iloc[0].to_dict()
    return sorted(
        [{"feature": str(n), "importance": float(v), "value": float(values.get(n, 0))} for n, v in zip(names, importances)],
        key=lambda x: x["importance"],
        reverse=True
    )[:6]

def _improvements(x: dict[str, Any], success: float, explanations):
    actions = []
    revenue = float(x.get("estimated_revenue_usd", 0) or 0)
    funding = float(x.get("funding_amount_usd", 0) or 0)
    employees = float(x.get("employee_count", 0) or 0)
    valuation = float(x.get("estimated_valuation_usd", 0) or 0)
    rounds = float(x.get("funding_round", 0) or 0)
    if revenue <= 0:
        actions.append("Validate a measurable revenue path and run a small paid-user or pilot experiment.")
    elif revenue < 100000:
        actions.append("Strengthen early revenue validation: track conversion, retention and repeat usage before scaling.")
    if employees < 5:
        actions.append("Check whether the current team can deliver the MVP; assign clear ownership for product and engineering.")
    if funding <= 0:
        actions.append("Build a lean financing plan and validate the MVP before committing to a large funding requirement.")
    elif funding > 0 and revenue == 0:
        actions.append("Tie future funding to measurable milestones so capital is connected to product and customer validation.")
    if valuation > 0 and revenue > 0 and valuation / revenue > 30:
        actions.append("Validate the valuation assumption against revenue, growth and comparable companies rather than relying on a headline valuation.")
    if rounds <= 1:
        actions.append("Focus on proving the core product and customer demand before adding complexity or pursuing additional rounds.")
    if success < 0.5:
        actions.append("Prioritize the lowest-confidence business assumptions first and rerun the prediction after collecting stronger operating data.")
    else:
        actions.append("Keep validating customer demand and unit economics; a model probability is not a guarantee of future success.")
    return list(dict.fromkeys(actions))[:5]

def predict_startup(x: dict[str, Any]):
    row = {f: float(x[f]) for f in FEATURES}
    frame = pd.DataFrame([row], columns=FEATURES)
    model = get_model()
    if model is not None:
        probabilities = model.predict_proba(frame)[0]
        classes = list(model.classes_)
        probs = {int(c): float(p) for c, p in zip(classes, probabilities)}
        success = probs.get(1, 0.0)
    else:
        success, _ = _tree_probability(row)
    failure = 1.0 - success
    prediction = 1 if success >= 0.5 else 0
    explanations = _explanations(frame, model) 
    return {
        "prediction": prediction,
        "outcome": "Success" if prediction else "Failure",
        "success_probability": success,
        "failure_probability": failure,
        "confidence": max(success, failure),
        "explanations": explanations,
        "improvements": _improvements(x, success, explanations),
        "disclaimer": "These percentages are model estimates from the training data, not guarantees of startup success or failure. Suggested improvements are validation actions, not causal guarantees.",
        "model_source": "serialized Decision Tree" if model is not None else "portable Decision Tree fallback"
    }

def get_feature_importance():
    model = get_model()
    if model is not None:
        imps = getattr(model, "feature_importances_", None)
        names = list(getattr(model, "feature_names_in_", FEATURES))
    else:
        t = get_tree()
        imps = t["feature_importances"]
        names = t["features"]
    return sorted([{"feature": str(n), "importance": float(v)} for n, v in zip(names, imps)], key=lambda x: x["importance"], reverse=True)

def get_metrics():
    path = BASE_DIR / "models" / "model_metrics.json"
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else {"model":"Decision Tree","model_version":"7.1.0","leakage_safe":True}
