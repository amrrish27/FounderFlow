# FounderFlow

AI-powered startup exit intelligence platform that predicts **Exited / Not Exited** outcomes from the production model signals.

## 🚀 Live Demo

**Vercel:** https://founder-flow-nine.vercel.app

**GitHub:** https://github.com/amrrish27/FounderFlow

## ✨ Features

- Startup exit prediction using the trained Random Forest model
- Probability-based prediction results
- Feature importance visualization
- Dark / light mode
- Cinematic FounderFlow startup intro animation
- Responsive dashboard UI
- FastAPI prediction API deployed with Vercel

## 🧠 Model

- Algorithm: Random Forest Classifier
- Estimators: 200 trees
- Model inputs: 15 production features
- Target: Exited / Not Exited
- Model file: `models/best_model.pkl`

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- FastAPI
- Pydantic
- Joblib
- scikit-learn

### Deployment
- GitHub
- Vercel

## 📁 Project Structure

```text
FounderFlow/
├── api/
│   └── index.py
├── backend/
│   └── predictor.py
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── models/
│   └── best_model.pkl
├── dataset/
├── notebooks/
├── reports/
└── vercel.json
```

## 🔌 API Endpoints

```text
GET  /api/health
POST /api/predict
GET  /api/feature-importance
```

## 🌐 Deployment

The production application is deployed on Vercel:

**https://founder-flow-nine.vercel.app**

The frontend uses the same-origin `/api` path, so the deployed UI communicates with the deployed FastAPI API without relying on localhost.

## ⚠️ Note

Prediction probabilities represent the model's confidence for the supplied inputs and are not guarantees of a future acquisition or IPO.
