def _auth(token):
    return {"Authorization": f"Bearer {token}"}


def _seed(client, token):
    rows = [
        {"make": "Toyota", "model": "Corolla", "category": "sedan", "price": 20000, "quantity": 5},
        {"make": "Toyota", "model": "RAV4", "category": "suv", "price": 30000, "quantity": 2},
        {"make": "Honda", "model": "Civic", "category": "sedan", "price": 22000, "quantity": 4},
        {"make": "Ford", "model": "F150", "category": "truck", "price": 45000, "quantity": 1},
    ]
    for r in rows:
        client.post("/api/vehicles", headers=_auth(token), json=r)


def test_search_by_make(client, user_token):
    _seed(client, user_token)
    r = client.get("/api/vehicles/search?make=toyota", headers=_auth(user_token))
    assert r.status_code == 200
    assert len(r.json()) == 2
    assert all(v["make"] == "Toyota" for v in r.json())


def test_search_by_category_and_price_range(client, user_token):
    _seed(client, user_token)
    r = client.get(
        "/api/vehicles/search?category=sedan&min_price=21000&max_price=25000",
        headers=_auth(user_token),
    )
    assert r.status_code == 200
    assert len(r.json()) == 1
    assert r.json()[0]["model"] == "Civic"


def test_search_by_model_substring(client, user_token):
    _seed(client, user_token)
    r = client.get("/api/vehicles/search?model=15", headers=_auth(user_token))
    assert len(r.json()) == 1
    assert r.json()[0]["model"] == "F150"


def test_search_empty_result(client, user_token):
    _seed(client, user_token)
    r = client.get("/api/vehicles/search?make=tesla", headers=_auth(user_token))
    assert r.status_code == 200
    assert r.json() == []
