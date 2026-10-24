from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_admin
from app.models.user import User
from app.models.vehicle import Vehicle
from app.schemas.inventory import RestockRequest
from app.schemas.vehicle import VehicleCreate, VehicleOut, VehicleUpdate

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])


@router.post("", response_model=VehicleOut, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    payload: VehicleCreate,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
) -> Vehicle:
    vehicle = Vehicle(**payload.model_dump())
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.get("", response_model=List[VehicleOut])
def list_vehicles(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
) -> List[Vehicle]:
    return db.query(Vehicle).order_by(Vehicle.id.desc()).all()


@router.get("/search", response_model=List[VehicleOut])
def search_vehicles(
    make: Optional[str] = None,
    model: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = Query(default=None, ge=0),
    max_price: Optional[float] = Query(default=None, ge=0),
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
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


def _get_or_404(db: Session, vehicle_id: int) -> Vehicle:
    v = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if v is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return v


@router.put("/{vehicle_id}", response_model=VehicleOut)
def update_vehicle(
    vehicle_id: int,
    payload: VehicleUpdate,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
) -> Vehicle:
    vehicle = _get_or_404(db, vehicle_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(vehicle, field, value)
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.post("/{vehicle_id}/purchase", response_model=VehicleOut)
def purchase_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
) -> Vehicle:
    vehicle = _get_or_404(db, vehicle_id)
    if vehicle.quantity <= 0:
        raise HTTPException(status_code=400, detail="Vehicle is out of stock")
    vehicle.quantity -= 1
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.post("/{vehicle_id}/restock", response_model=VehicleOut)
def restock_vehicle(
    vehicle_id: int,
    payload: RestockRequest,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
) -> Vehicle:
    vehicle = _get_or_404(db, vehicle_id)
    vehicle.quantity += payload.amount
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
) -> Response:
    vehicle = _get_or_404(db, vehicle_id)
    db.delete(vehicle)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
