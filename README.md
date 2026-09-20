# FounderFlow 🚀

**Startup Exit Intelligence Using Machine Learning**

FounderFlow is a full-stack startup intelligence platform designed to help founders move from **idea → validation → financial planning → competitor analysis → ML-assisted startup outcome analysis** in one workspace.

## 🌐 Live Demo

**FounderFlow:** https://founder-flow-95h6.vercel.app/

**GitHub:** https://github.com/amrrish27/FounderFlow

---

## ✨ What FounderFlow Does

FounderFlow combines a lightweight web dashboard, a FastAPI backend, deterministic founder tools, and a machine-learning prediction pipeline.

### 1. 💡 Startup Idea Analyzer

Turn a raw startup concept into a structured validation brief.

It evaluates:

- Idea clarity
- Customer specificity
- Problem definition
- Solution definition
- MVP budget
- Problem–solution alignment

The analyzer returns:

- Validation score
- Score label
- Strengths
- Weaknesses
- Recommended next steps

> The Idea Analyzer is an explainable validation/completeness heuristic, not a prediction of commercial success.

### 2. 💰 Financial Planner

Build a 12-month startup cash projection from founder-supplied assumptions.

Inputs include:

- Initial investment
- Monthly revenue
- Monthly expenses
- Revenue growth
- Expense growth
- Price per unit
- Variable cost per unit
- Fixed monthly costs

Outputs include:

- Monthly burn rate
- Estimated runway
- Break-even units
- Monthly revenue/expense projection
- Ending cash balance

### 3. ⚔️ Competitor Benchmark

Compare a startup against a competitor using the information provided by the founder.

The benchmark considers:

- Product differentiation
- Customer focus
- Pricing position
- Differentiation strength
- Competitive gap evidence

It also generates practical actions for:

- MVP positioning
- Customer targeting
- Pricing experiments
- Differentiation
- Competitor research

> Competitor results are structured comparisons of supplied information. They do not establish market share or guaranteed product superiority.

### 4. 🤖 ML Startup Prediction

FounderFlow includes a Decision Tree based startup outcome prediction pipeline.

The model uses pre-outcome startup attributes such as:

- Founded year
- Country
- Region
- Industry
- Funding round
- Funding amount
- Lead investor
- Co-investors
- Employee count
- Estimated revenue
- Estimated valuation
- Tags
- Funding year
- Funding month

**Target:** `exited`

**Excluded:** `exit_type`

The target outcome field `exit_type` is deliberately excluded because it is only known after the startup outcome and would introduce target leakage.

The prediction response provides:

- Success probability
- Failure probability
- Confidence
- Predicted outcome
- Feature importance
- Improvement suggestions
- Model source
- Disclaimer

### 5. 📊 Model Insights

The dashboard exposes model metadata and feature importance so users can inspect which input signals the trained model relies on.

---

## 🧠 Machine Learning Design

FounderFlow v7.1 uses a leakage-safe feature set.

### Model version

`7.1.0`

### Training/test data

- Dataset rows: **50,000**
- Test rows: **10,000**
- Target: `exited`
- Excluded feature: `exit_type`

### Compared models

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC |
|---|---:|---:|---:|---:|---:|
| Logistic Regression | 84.93% | 21.43% | 1.02% | 1.95% | 50.70% |
| Decision Tree | 27.07% | 14.83% | 83.71% | 25.19% | 50.46% |
| Random Forest | 85.31% | 0.00% | 0.00% | 0.00% | 50.25% |

These metrics show that the current model has **limited predictive discrimination** on the evaluated test set, with ROC-AUC values close to 0.50. The project therefore treats predictions as experimental decision-support output rather than reliable business forecasts.

> **Important:** Model probabilities are estimates derived from the training data. They are not guarantees of startup success, failure, funding, valuation, or exit.

---

## 🏗️ Architecture

```
FounderFlow/
│
├── app.py
│   └── Root FastAPI application + frontend serving
│
├── backend/
│   ├── app.py
│   ├── predictor.py
│   ├── services.py
│   └── requirements.txt
│
├── frontend/
│   └── index.html
│
├── models/
│   ├── best_model.pkl
│   ├── model_tree.json
│   └── model_metrics.json
│
├── BUILD_VERSION.txt
├── requirements.txt
├── pyproject.toml
├── .gitignore
└── README.md
```

### Runtime flow

```
Browser
   │
   ▼
FounderFlow Dashboard
   │
   ├── Idea Analyzer
   ├── Financial Planner
   ├── Competitor Benchmark
   ├── ML Prediction
   └── Model Insights
   │
   ▼
FastAPI /api/*
   │
   ├── services.py
   └── predictor.py
          │
          ├── best_model.pkl
          └── model_tree.json fallback
```

---

## 🔌 API

The deployed application exposes the following endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api` | API information |
| GET | `/api/health` | Health check |
| GET | `/api/model-metrics` | Model metadata and evaluation metrics |
| GET | `/api/feature-importance` | Feature importance |
| POST | `/api/predict` | ML startup prediction |
| POST | `/api/idea/analyze` | Startup idea analysis |
| POST | `/api/financial/plan` | Financial projection |
| POST | `/api/competitor/compare` | Competitor benchmark |

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Responsive dashboard UI
- Dark/light mode
- Startup intelligence workspace

### Backend

- Python
- FastAPI
- Pydantic
- pandas
- scikit-learn
- joblib

### ML

- Logistic Regression
- Decision Tree
- Random Forest
- Feature importance
- Leakage-safe feature selection
- Portable Decision Tree fallback

### Deployment

- GitHub
- Vercel
- Python/FastAPI
- Static frontend serving

---

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/amrrish27/FounderFlow.git
cd FounderFlow
```

### 2. Create a virtual environment

#### Windows

```bash
python -m venv .venv
.venv\\Scripts\\activate
```

#### Linux/macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

or:

```bash
pip install -r backend/requirements.txt
```

### 4. Start FounderFlow

From the project root:

```bash
uvicorn app:app --reload --port 8000
```

Open:

```
http://127.0.0.1:8000
```

The root FastAPI application serves both the API and the frontend.

---

## 📦 Model Fallback

FounderFlow attempts to load:

```
models/best_model.pkl
```

If the serialized model cannot be loaded in the deployment environment, the backend can use:

```
models/model_tree.json
```

This portable artifact contains the Decision Tree structure and feature information required for prediction.

This makes the ML endpoint more resilient across deployment environments.

---

## 🔐 Leakage-Safe Prediction

A key design goal of FounderFlow is avoiding information that would only become available after the startup outcome.

The model predicts:

```
exited
```

while explicitly excluding:

```
exit_type
```

This prevents the model from receiving a post-outcome field as an input.

The prediction feature set is:

```
founded_year
country
region
industry
funding_round
funding_amount_usd
lead_investor
co_investors
employee_count
estimated_revenue_usd
estimated_valuation_usd
tags
funding_year
funding_month
```

---

## 🎨 Dashboard

The FounderFlow dashboard includes:

- Startup intelligence overview
- Intro/loading experience
- Dark mode and light mode
- Idea Analyzer
- Financial Planner
- Competitor Benchmark
- ML Prediction
- Model Insights
- API health indicator
- Feature importance visualization
- Prediction improvement recommendations
- Responsive layout

---

## 📁 Project Status

**Current version:** `7.1.0`

**Build:** Vercel-ready

**Primary branch:** `main`

The current release focuses on integrating founder-facing intelligence tools with the ML prediction pipeline while keeping the prediction workflow leakage-safe and deployment-resilient.

---

## ⚠️ Limitations

FounderFlow is an experimental learning/project platform.

Results can be affected by:

- Training-data quality
- Dataset bias
- Feature encoding
- Historical vs. current startup conditions
- Missing or inaccurate founder inputs
- Model calibration
- Limited predictive signal in the evaluated dataset

The Idea Analyzer, Financial Planner, and Competitor Benchmark use deterministic rules rather than a trained commercial-success model.

FounderFlow should therefore be used alongside:

- Customer interviews
- Market research
- Product validation
- Financial analysis
- Competitor research
- Founder judgment

---

## 👨‍💻 Author

**Amrrish Roshan**

GitHub: https://github.com/amrrish27

---

## 📌 Project Links

| Resource | Link |
|---|---|
| Live Demo | https://founder-flow-95h6.vercel.app/ |
| GitHub Repository | https://github.com/amrrish27/FounderFlow |

---

## 📄 License

No license is currently specified for this repository.

If the project is intended for public redistribution or open-source use, add an appropriate license file such as MIT before redistribution.

---

**FounderFlow — Build smarter. Validate earlier. Understand the numbers.**
