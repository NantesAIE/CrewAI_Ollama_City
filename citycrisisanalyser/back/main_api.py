import sys
try:
    import pysqlite3
    sys.modules["sqlite3"] = pysqlite3
except ImportError:
    pass  # en local Windows on garde sqlite3 standard
from fastapi import FastAPI
from api.controller import router
import uvicorn

app = FastAPI(
    title="City Crisis Analyzer API",
    description="Analyse intelligente d’images de crise avec CrewAI",
)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("main_api:app", host="0.0.0.0", port=8000, reload=True)
