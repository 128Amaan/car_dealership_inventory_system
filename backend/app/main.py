from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.routers import auth as auth_router

app = FastAPI(title="Car Dealership Inventory API", version="1.0.0")

app.include_router(auth_router.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _create_tables() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}
