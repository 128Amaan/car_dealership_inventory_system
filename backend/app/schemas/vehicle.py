from typing import Optional

from pydantic import BaseModel, Field


class VehicleBase(BaseModel):
    make: str = Field(min_length=1, max_length=64)
    model: str = Field(min_length=1, max_length=64)
    category: str = Field(min_length=1, max_length=64)
    price: float = Field(ge=0)
    quantity: int = Field(ge=0)
    year: Optional[int] = Field(default=None, ge=1900, le=2100)
    image_url: Optional[str] = None


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = Field(default=None, ge=0)
    quantity: Optional[int] = Field(default=None, ge=0)
    year: Optional[int] = None
    image_url: Optional[str] = None


class VehicleOut(VehicleBase):
    id: int

    class Config:
        from_attributes = True
