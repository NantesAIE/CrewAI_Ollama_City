from fastapi import FastAPI
from api.controller import router
import uvicorn

app = FastAPI(
    title="City Crisis Analyzer API",
    description="Analyse intelligente d’images de crise avec CrewAI",
)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("main_api:app", host="localhost", port=8000, reload=True)
