"""Business logic for vehicle operations.

Routers stay HTTP-focused; this module owns the rules
(stock > 0 before purchase, filters applied to a search query).
"""
from typing import List, Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle


def get_or_404(db: Session, vehicle_id: int) -> Vehicle:
    v = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if v is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return v


def search(
    db: Session,
    *,
    make: Optional[str] = None,
    model: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
) -> List[Vehicle]:
    q = db.query(Vehicle)
    if make:
        q = q.filter(Vehicle.make.ilike(f"%{make}%"))
    if model:
        q = q.filter(Vehicle.model.ilike(f"%{model}%"))
    if category:
        q = q.filter(Vehicle.category.ilike(f"%{category}%"))
    if min_price is not None:
        q = q.filter(Vehicle.price >= min_price)
    if max_price is not None:
        q = q.filter(Vehicle.price <= max_price)
    return q.order_by(Vehicle.id.desc()).all()


def purchase(db: Session, vehicle_id: int) -> Vehicle:
    vehicle = get_or_404(db, vehicle_id)
    if vehicle.quantity <= 0:
        raise HTTPException(status_code=400, detail="Vehicle is out of stock")
    vehicle.quantity -= 1
    db.commit()
    db.refresh(vehicle)
    return vehicle


def restock(db: Session, vehicle_id: int, amount: int) -> Vehicle:
    vehicle = get_or_404(db, vehicle_id)
    vehicle.quantity += amount
    db.commit()
    db.refresh(vehicle)
    return vehicle
