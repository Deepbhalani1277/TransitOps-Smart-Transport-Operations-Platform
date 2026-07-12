# STUB ONLY: Vehicles router. Implementation by Person 2.

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import VehicleCreate, VehicleUpdate, VehicleOut

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

@router.get("", response_model=List[VehicleOut])
def list_vehicles(db: Session = Depends(get_db)):
    # TODO: Fetch and return list of all vehicles from database
    return []

@router.post("", response_model=VehicleOut, status_code=status.HTTP_201_CREATED)
def create_vehicle(vehicle_in: VehicleCreate, db: Session = Depends(get_db)):
    # TODO: Validate uniqueness of reg_number, save to DB and return VehicleOut
    return {
        "id": 1,
        **vehicle_in.model_dump()
    }

@router.get("/{vehicle_id}", response_model=VehicleOut)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    # TODO: Retrieve vehicle by ID, raise 404 if not found
    return {
        "id": vehicle_id,
        "reg_number": "TX-1234-OP",
        "name": "Volvo FH16",
        "type": "Heavy Duty Truck",
        "max_capacity_kg": 25000.0,
        "odometer": 12500.5,
        "acquisition_cost": 135000.0,
        "status": "Available",
        "region": "North"
    }

@router.patch("/{vehicle_id}", response_model=VehicleOut)
def update_vehicle(vehicle_id: int, vehicle_in: VehicleUpdate, db: Session = Depends(get_db)):
    # TODO: Update vehicle fields dynamically in DB, raise 404 if not found
    return {
        "id": vehicle_id,
        "reg_number": "TX-1234-OP",
        "name": vehicle_in.name or "Volvo FH16",
        "type": "Heavy Duty Truck",
        "max_capacity_kg": 25000.0,
        "odometer": 12500.5,
        "acquisition_cost": 135000.0,
        "status": vehicle_in.status or "Available",
        "region": vehicle_in.region or "North"
    }

@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    # TODO: Remove vehicle from DB, raise 404 if not found
    return {"ok": True}
