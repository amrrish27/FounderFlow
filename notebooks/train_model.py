import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

# ======================================================
# PROJECT PATHS
# ======================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATASET_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "cleaned_startup_valuation_dataset.csv"
)

MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODEL_DIR, "best_model.pkl")

# ======================================================
# LOAD DATASET
# ======================================================

df = pd.read_csv(DATASET_PATH)

print("=" * 60)
print("DATASET LOADED")
print("=" * 60)

print(df.head())

# ------------------------------------------------------
# Convert bool target to integer if needed
# ------------------------------------------------------

if df["exited"].dtype == bool:
    df["exited"] = df["exited"].astype(int)

# ======================================================
# FEATURES & TARGET
# ======================================================

X = df.drop("exited", axis=1)
y = df["exited"]

# ======================================================
# TRAIN TEST SPLIT
# ======================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining Samples :", len(X_train))
print("Testing Samples  :", len(X_test))

# ======================================================
# MODELS
# ======================================================

models = {
    "Logistic Regression": LogisticRegression(
        max_iter=5000,
        class_weight="balanced"
    ),

    "Decision Tree": DecisionTreeClassifier(
        random_state=42,
        class_weight="balanced"
    ),

    "Random Forest": RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        class_weight="balanced"
    )
}
# ======================================================
# MODEL TRAINING
# ======================================================

results = {}

best_model = None
best_accuracy = 0

print("\n" + "=" * 60)
print("MODEL TRAINING")
print("=" * 60)

for name, model in models.items():

    print("\n" + "-" * 50)
    print(name)
    print("-" * 50)

    model.fit(X_train, y_train)

    prediction = model.predict(X_test)

    accuracy = accuracy_score(y_test, prediction)
    precision = precision_score(y_test, prediction, zero_division=0)
    recall = recall_score(y_test, prediction, zero_division=0)
    f1 = f1_score(y_test, prediction, zero_division=0)

    print("Accuracy :", round(accuracy * 100, 2), "%")
    print("Precision:", round(precision, 4))
    print("Recall   :", round(recall, 4))
    print("F1 Score :", round(f1, 4))

    print("\nConfusion Matrix")
    print(confusion_matrix(y_test, prediction))

    print("\nClassification Report")
    print(classification_report(y_test, prediction, zero_division=0))

    results[name] = accuracy

    if accuracy > best_accuracy:
        best_accuracy = accuracy
        best_model = model
# ======================================================
# MODEL COMPARISON
# ======================================================

print("\n" + "=" * 60)
print("MODEL COMPARISON")
print("=" * 60)

for model_name, score in results.items():
    print(f"{model_name:<25} {score*100:.2f}%")

best_model_name = max(results, key=results.get)

print("\nBest Model :", best_model_name)
print("Accuracy   :", round(best_accuracy * 100, 2), "%")

# ======================================================
# FEATURE IMPORTANCE
# ======================================================

if isinstance(best_model, RandomForestClassifier):

    importance = pd.DataFrame({

        "Feature": X.columns,

        "Importance": best_model.feature_importances_

    })

    importance = importance.sort_values(
        by="Importance",
        ascending=False
    )

    print("\n" + "=" * 60)
    print("TOP 15 IMPORTANT FEATURES")
    print("=" * 60)

    print(importance.head(15))

# ======================================================
# SAVE MODEL
# ======================================================

joblib.dump(best_model, MODEL_PATH)

print("\n" + "=" * 60)
print("MODEL SAVED SUCCESSFULLY")
print("=" * 60)

print(MODEL_PATH)
