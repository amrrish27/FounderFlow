from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

ROOT = Path(__file__).resolve().parent.parent
FRONTEND = ROOT / "frontend"

app = FastAPI(title="FounderFlow", version="1.0.0")


# The root Vercel Python entrypoint also serves the static FounderFlow UI.
# API endpoints remain separate file-based Vercel Functions under /api/.
app.mount("/", StaticFiles(directory=str(FRONTEND), html=True), name="frontend")
