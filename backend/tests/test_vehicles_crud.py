def _auth(token):
    return {"Authorization": f"Bearer {token}"}


def test_create_vehicle_requires_auth(client):
    r = client.post("/api/vehicles", json={
        "make": "Toyota", "model": "Corolla", "category": "sedan",
        "price": 20000, "quantity": 5,
    })
    assert r.status_code == 401


def test_create_vehicle_returns_201_with_body(client, user_token):
    r = client.post("/api/vehicles", headers=_auth(user_token), json={
        "make": "Honda", "model": "Civic", "category": "sedan",
        "price": 22500.5, "quantity": 3, "year": 2024,
    })
    assert r.status_code == 201
    body = r.json()
    assert body["id"] > 0
    assert body["make"] == "Honda"
    assert body["quantity"] == 3


def test_list_vehicles_returns_all(client, user_token):
    for i in range(3):
        client.post("/api/vehicles", headers=_auth(user_token), json={
            "make": f"M{i}", "model": "x", "category": "suv",
            "price": 10000 + i, "quantity": 1,
        })
    r = client.get("/api/vehicles", headers=_auth(user_token))
    assert r.status_code == 200
    assert len(r.json()) == 3


def test_update_vehicle_changes_fields(client, user_token):
    r = client.post("/api/vehicles", headers=_auth(user_token), json={
        "make": "Ford", "model": "F150", "category": "truck",
        "price": 40000, "quantity": 2,
    })
    vid = r.json()["id"]
    r = client.put(f"/api/vehicles/{vid}", headers=_auth(user_token), json={"price": 38000})
    assert r.status_code == 200
    assert r.json()["price"] == 38000
    assert r.json()["make"] == "Ford"


def test_update_unknown_vehicle_returns_404(client, user_token):
    r = client.put("/api/vehicles/9999", headers=_auth(user_token), json={"price": 1})
    assert r.status_code == 404


def test_delete_vehicle_requires_admin(client, user_token):
    r = client.post("/api/vehicles", headers=_auth(user_token), json={
        "make": "Kia", "model": "Rio", "category": "sedan",
        "price": 15000, "quantity": 1,
    })
    vid = r.json()["id"]
    r = client.delete(f"/api/vehicles/{vid}", headers=_auth(user_token))
    assert r.status_code == 403


def test_admin_can_delete_vehicle(client, admin_token):
    r = client.post("/api/vehicles", headers=_auth(admin_token), json={
        "make": "BMW", "model": "M3", "category": "coupe",
        "price": 70000, "quantity": 1,
    })
    vid = r.json()["id"]
    r = client.delete(f"/api/vehicles/{vid}", headers=_auth(admin_token))
    assert r.status_code == 204
    r = client.get("/api/vehicles", headers=_auth(admin_token))
    assert all(v["id"] != vid for v in r.json())
