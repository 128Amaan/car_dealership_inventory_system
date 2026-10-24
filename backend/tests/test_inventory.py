def _auth(token):
    return {"Authorization": f"Bearer {token}"}


def _make(client, token, qty=3):
    r = client.post("/api/vehicles", headers=_auth(token), json={
        "make": "Nissan", "model": "Altima", "category": "sedan",
        "price": 18000, "quantity": qty,
    })
    return r.json()["id"]


def test_purchase_decrements_quantity(client, user_token):
    vid = _make(client, user_token, qty=3)
    r = client.post(f"/api/vehicles/{vid}/purchase", headers=_auth(user_token))
    assert r.status_code == 200
    assert r.json()["quantity"] == 2


def test_purchase_fails_when_out_of_stock(client, user_token):
    vid = _make(client, user_token, qty=0)
    r = client.post(f"/api/vehicles/{vid}/purchase", headers=_auth(user_token))
    assert r.status_code == 400
    assert "stock" in r.json()["detail"].lower()


def test_purchase_unknown_vehicle_404(client, user_token):
    r = client.post("/api/vehicles/9999/purchase", headers=_auth(user_token))
    assert r.status_code == 404


def test_restock_requires_admin(client, user_token):
    vid = _make(client, user_token, qty=1)
    r = client.post(f"/api/vehicles/{vid}/restock",
                    headers=_auth(user_token), json={"amount": 5})
    assert r.status_code == 403


def test_admin_restock_increments_quantity(client, admin_token):
    vid = _make(client, admin_token, qty=1)
    r = client.post(f"/api/vehicles/{vid}/restock",
                    headers=_auth(admin_token), json={"amount": 7})
    assert r.status_code == 200
    assert r.json()["quantity"] == 8


def test_restock_rejects_non_positive_amount(client, admin_token):
    vid = _make(client, admin_token, qty=1)
    r = client.post(f"/api/vehicles/{vid}/restock",
                    headers=_auth(admin_token), json={"amount": 0})
    assert r.status_code == 422
