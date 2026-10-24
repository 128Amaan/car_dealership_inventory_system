def test_register_creates_user_and_returns_201(client):
    r = client.post(
        "/api/auth/register",
        json={"email": "alice@example.com", "password": "secret12"},
    )
    assert r.status_code == 201
    body = r.json()
    assert body["email"] == "alice@example.com"
    assert "id" in body
    assert "hashed_password" not in body


def test_register_rejects_duplicate_email(client):
    client.post("/api/auth/register", json={"email": "a@b.com", "password": "secret12"})
    r = client.post("/api/auth/register", json={"email": "a@b.com", "password": "secret12"})
    assert r.status_code == 400


def test_register_rejects_short_password(client):
    r = client.post("/api/auth/register", json={"email": "x@y.com", "password": "123"})
    assert r.status_code == 422


def test_login_returns_jwt_on_valid_credentials(client):
    client.post("/api/auth/register", json={"email": "bob@example.com", "password": "secret12"})
    r = client.post("/api/auth/login", json={"email": "bob@example.com", "password": "secret12"})
    assert r.status_code == 200
    body = r.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"


def test_login_rejects_wrong_password(client):
    client.post("/api/auth/register", json={"email": "c@d.com", "password": "secret12"})
    r = client.post("/api/auth/login", json={"email": "c@d.com", "password": "wrong-pw"})
    assert r.status_code == 401


def test_login_rejects_unknown_user(client):
    r = client.post("/api/auth/login", json={"email": "nobody@nowhere.com", "password": "secret12"})
    assert r.status_code == 401
