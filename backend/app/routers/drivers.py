# STUB ONLY: Drivers router. Implementation by Person 2.

from typing import List
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import DriverCreate, DriverUpdate, DriverOut

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.get("", response_model=List[DriverOut])
def list_drivers(db: Session = Depends(get_db)):
    # TODO: Fetch and return list of all drivers from database
    return []

@router.post("", response_model=DriverOut, status_code=status.HTTP_201_CREATED)
def create_driver(driver_in: DriverCreate, db: Session = Depends(get_db)):
    # TODO: Save driver to DB and return DriverOut
    return {
        "id": 1,
        **driver_in.model_dump()
    }

@router.get("/{driver_id}", response_model=DriverOut)
def get_driver(driver_id: int, db: Session = Depends(get_db)):
    # TODO: Retrieve driver by ID, raise 404 if not found
    return {
        "id": driver_id,
        "name": "Alice Smith",
        "license_number": "DL-987654321",
        "license_category": "Class A CDL",
        "license_expiry": date(2028, 12, 31),
        "contact": "+1-555-0199",
        "safety_score": 98,
        "status": "Available"
    }

@router.patch("/{driver_id}", response_model=DriverOut)
def update_driver(driver_id: int, driver_in: DriverUpdate, db: Session = Depends(get_db)):
    # TODO: Update driver fields dynamically in DB, raise 404 if not found
    return {
        "id": driver_id,
        "name": driver_in.name or "Alice Smith",
        "license_number": "DL-987654321",
        "license_category": "Class A CDL",
        "license_expiry": date(2028, 12, 31),
        "contact": driver_in.contact or "+1-555-0199",
        "safety_score": driver_in.safety_score or 98,
        "status": driver_in.status or "Available"
    }

@router.delete("/{driver_id}")
def delete_driver(driver_id: int, db: Session = Depends(get_db)):
    # TODO: Remove driver from DB, raise 404 if not found
    return {"ok": True}
