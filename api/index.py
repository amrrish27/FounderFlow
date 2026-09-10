from fastapi import FastAPI

app = FastAPI(title="FounderFlow Vercel Entrypoint", version="1.0.0")


@app.get("/")
def root():
    return {"name": "FounderFlow API", "status": "online"}
