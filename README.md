# FounderFlow 🚀

**Startup Exit Intelligence Using Machine Learning**

FounderFlow is a full-stack startup intelligence platform that combines a trained machine-learning model with practical founder tools for idea validation, financial planning, competitor benchmarking, and startup outcome analysis.

## Features

- Startup Idea Analyzer
- Startup Risk Assessment
- Competitor Benchmarking
- Financial Projection Planner
- ML Startup Prediction
- Model Insights
- Dark / Light Mode
- Vercel-ready Python API and static frontend

## Machine Learning

The prediction pipeline is designed to avoid target leakage by excluding the target outcome field from the model inputs. The model uses pre-outcome startup attributes such as founding year, geography, industry, funding, employees, estimated revenue and valuation, investor information, funding date, and tags.

The prediction response includes:
- success probability
- failure probability
- confidence
- outcome label
- feature importance
- practical improvement suggestions

> ML output is decision-support information and is not a guarantee of startup success or failure.

## Architecture

```
FounderFlow/
├── api/
│   └── index.py
├── backend/
│   ├── app.py
│   ├── predictor.py
│   ├── services.py
│   └── requirements.txt
├── frontend/
│   ├── v7.html
│   ├── index.html
│   ├── style.css
│   └── script.js
├── models/
│   ├── best_model.pkl
│   └── model_metrics.json
├── dataset/
├── notebooks/
├── reports/
├── vercel.json
└── README.md
```

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api | API information |
| GET | /api/health | Health check |
| GET | /api/model-metrics | Model metrics and metadata |
| GET | /api/feature-importance | Feature importance |
| POST | /api/predict | Startup ML prediction |
| POST | /api/idea/analyze | Analyze a startup idea |
| POST | /api/financial/plan | Build a financial projection |
| POST | /api/competitor/compare | Compare a startup with a competitor |

## Run Locally

### Create environment

Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Linux/macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Install dependencies

```bash
pip install -r backend/requirements.txt
```

### Start API

```bash
uvicorn backend.app:app --reload --port 8000
```

API:
```
http://127.0.0.1:8000
```

### Start frontend

Serve the `frontend` directory with a static web server. The included Windows helper is:

```
run_frontend.cmd
```

Dashboard:
```
http://127.0.0.1:5500
```

## Vercel Deployment

The repository includes `vercel.json` configured for:
- Python/FastAPI through `api/index.py`
- static frontend files in `frontend/`
- `/api/*` routing
- the FounderFlow v7 dashboard at the root route

Deployment:
1. Open Vercel.
2. Choose Add New Project.
3. Import `amrrish27/FounderFlow`.
4. Deploy from the `main` branch.

The frontend automatically uses the local API during development and `/api` on Vercel.

## Tech Stack

- HTML, CSS, JavaScript
- Python, FastAPI, Pydantic
- pandas, scikit-learn, joblib
- GitHub
- Vercel

## Limitations

Prediction quality depends on training-data quality, feature encoding, the difference between historical and new startup populations, calibration, and the accuracy of supplied inputs.

Use FounderFlow alongside customer validation, market research, financial analysis, and founder judgment.

## Author

**Amrrish Roshan**

GitHub: https://github.com/amrrish27

## License

Add the preferred open-source license before redistribution if required.
