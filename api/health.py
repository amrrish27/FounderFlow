from fastapi import FastAPI

app = FastAPI(title="FounderFlow Health")


@app.get("/")
def health():
    return {"status": "healthy"}
