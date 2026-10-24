import os
import sys
import tempfile

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture
def client(tmp_path):
    db_file = tmp_path / "test.db"
    engine = create_engine(
        f"sqlite:///{db_file}", connect_args={"check_same_thread": False}
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def admin_token(client):
    client.post("/api/auth/register", json={"email": "admin@test.com", "password": "pw12345", "is_admin": True})
    r = client.post("/api/auth/login", json={"email": "admin@test.com", "password": "pw12345"})
    return r.json()["access_token"]


@pytest.fixture
def user_token(client):
    client.post("/api/auth/register", json={"email": "user@test.com", "password": "pw12345"})
    r = client.post("/api/auth/login", json={"email": "user@test.com", "password": "pw12345"})
    return r.json()["access_token"]
