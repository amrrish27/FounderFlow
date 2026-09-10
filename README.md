# FounderFlow

> AI-powered startup exit intelligence using a trained Random Forest model.

FounderFlow is a full-stack machine-learning application that predicts whether a startup is historically classified as **Exited** or **Not Exited** from 15 model inputs. The project includes a polished dashboard, prediction workflow, feature-importance visualization, model details, dark/light mode, and a cinematic startup experience.

## Live Demo

**Production:** https://founder-flow-nine.vercel.app

## Repository

**GitHub:** https://github.com/amrrish27/FounderFlow

## Features

- Startup exit prediction with class probabilities
- 15 model-compatible input signals
- Random Forest model with 200 trees
- Feature-importance dashboard
- Prediction explanation and confidence guidance
- Dark / light theme
- Responsive dashboard UI
- Cinematic FounderFlow intro animation
- FastAPI-powered prediction API
- Vercel deployment with API routes under `/api/*`

## Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript

### Backend / API

- Python
- FastAPI
- Pydantic
- Uvicorn

### Machine Learning

- scikit-learn
- Random Forest Classifier
- pandas
- joblib

### Deployment

- GitHub
- Vercel

## Project Structure

```text
FounderFlow/
├── api/
│   └── index.py                 # Canonical Vercel FastAPI entrypoint
├── backend/
│   ├── predictor.py             # Model loading and prediction logic
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── index.html               # FounderFlow UI
│   ├── style.css                # UI styling and animations
│   └── script.js                # Frontend controller + API integration
├── models/
│   └── best_model.pkl           # Trained production model
├── dataset/
│   ├── cleaned_startup_valuation_dataset.csv
│   └── final_startup_data.csv
├── notebooks/
│   ├── eda.py
│   └── train_model.py
├── reports/
│   └── EDA_Graphs/
└── vercel.json
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/amrrish27/FounderFlow.git
cd FounderFlow
```

### 2. Create a Python virtual environment (recommended)

**Windows:**

```cmd
python -m venv .venv
.venv\Scripts\activate
```

**macOS / Linux:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Python dependencies

```bash
pip install -r backend/requirements.txt
```

The required packages are FastAPI, Uvicorn, Pydantic, pandas, scikit-learn, and joblib.

## Run Locally

FounderFlow is configured for Vercel with a Python FastAPI entrypoint under `api/`.

### Option A — Run the frontend only

From the project root:

```bash
cd frontend
python -m http.server 5500
```

Open:

```text
http://127.0.0.1:5500
```

This is useful for previewing the UI. The production frontend uses the same-origin `/api` path, so prediction requests require the API environment as described below.

### Option B — Run the complete Vercel application locally

Install the Vercel CLI:

```bash
npm install -g vercel
```

Then, from the project root:

```bash
vercel dev
```

Vercel will run the Python API functions and serve the configured frontend together.

## API Endpoints

The deployed application exposes these endpoints:

```text
GET  /api/health
POST /api/predict
GET  /api/feature-importance
```

### Health check

```text
https://founder-flow-nine.vercel.app/api/health
```

Expected response:

```json
{
  "status": "healthy"
}
```

### Prediction

Send the 15 model inputs as JSON to:

```text
POST /api/predict
```

The production model expects:

```text
founded_year
country
region
industry
employee_count
estimated_revenue_usd
estimated_valuation_usd
funding_round
funding_amount_usd
lead_investor
co_investors
funding_year
funding_month
exit_type
tags
```

## Model

FounderFlow currently uses the production model stored at:

```text
models/best_model.pkl
```

The trained production model is a **Random Forest Classifier with 200 trees** and 15 input features.

The application returns two class probabilities:

- **Exited probability**
- **Not Exited probability**

These are model probabilities for the supplied inputs, not guarantees of a future acquisition or IPO.

## Feature Importance

The dashboard exposes the model's feature-importance values through:

```text
GET /api/feature-importance
```

This powers the Feature Importance page and the smaller model-signal panels throughout the UI.

## Deployment

FounderFlow is deployed to Vercel from the `main` branch of this GitHub repository.

**Production URL:** https://founder-flow-nine.vercel.app

### Deploy your own copy

1. Fork or clone the repository.
2. Import the repository into Vercel.
3. Keep the project root as the repository root.
4. Deploy from the `main` branch.

Vercel detects the Python FastAPI entrypoint in `api/index.py` and serves the application API under `/api/*`.

## Git Workflow

After making local changes:

```bash
git add .
git commit -m "Describe your change"
git push origin main
```

A push to `main` triggers a new deployment when Git integration is enabled in Vercel.

## Notes

- The production model file is approximately 94 MB. GitHub accepts the file, but recommends Git LFS for large binaries.
- The existing production model is intentionally kept unchanged.
- `exit_type` is a required input because it is part of the trained production feature set.
- Dataset and EDA files are included for project documentation and reproducibility.

## Project Status

**Status: Production-ready demo**

The application is live on Vercel with the frontend and FastAPI prediction endpoints integrated.
