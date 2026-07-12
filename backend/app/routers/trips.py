# STUB ONLY: Trips router. Implementation by Person 3.

from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import TripCreate, TripUpdate, TripOut

router = APIRouter(prefix="/trips", tags=["Trips"])

class TripCompleteRequest(BaseModel):
    actual_distance_km: float
    fuel_consumed_l: float

@router.get("", response_model=List[TripOut])
def list_trips(db: Session = Depends(get_db)):
    # TODO: Fetch and return list of all trips from database
    return []

@router.post("", response_model=TripOut, status_code=status.HTTP_201_CREATED)
def create_trip(trip_in: TripCreate, db: Session = Depends(get_db)):
    # TODO: Validate driver and vehicle status/capacity, save trip as Draft, and return TripOut
    return {
        "id": 1,
        "source": trip_in.source,
        "destination": trip_in.destination,
        "vehicle_id": trip_in.vehicle_id,
        "driver_id": trip_in.driver_id,
        "cargo_weight_kg": trip_in.cargo_weight_kg,
        "planned_distance_km": trip_in.planned_distance_km,
        "actual_distance_km": None,
        "fuel_consumed_l": None,
        "status": "Draft",
        "created_at": datetime.now(),
        "dispatched_at": None,
        "completed_at": None
    }

@router.get("/{trip_id}", response_model=TripOut)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    # TODO: Retrieve trip by ID, raise 404 if not found
    return {
        "id": trip_id,
        "source": "New York, NY",
        "destination": "Boston, MA",
        "vehicle_id": 1,
        "driver_id": 1,
        "cargo_weight_kg": 15000.0,
        "planned_distance_km": 350.0,
        "actual_distance_km": None,
        "fuel_consumed_l": None,
        "status": "Draft",
        "created_at": datetime.now(),
        "dispatched_at": None,
        "completed_at": None
    }

@router.patch("/{trip_id}", response_model=TripOut)
def update_trip(trip_id: int, trip_in: TripUpdate, db: Session = Depends(get_db)):
    # TODO: Update trip fields, raise 404 if not found
    return {
        "id": trip_id,
        "source": "New York, NY",
        "destination": "Boston, MA",
        "vehicle_id": trip_in.vehicle_id or 1,
        "driver_id": trip_in.driver_id or 1,
        "cargo_weight_kg": trip_in.cargo_weight_kg or 15000.0,
        "planned_distance_km": 350.0,
        "actual_distance_km": trip_in.actual_distance_km,
        "fuel_consumed_l": trip_in.fuel_consumed_l,
        "status": trip_in.status or "Draft",
        "created_at": datetime.now(),
        "dispatched_at": None,
        "completed_at": None
    }

@router.post("/{trip_id}/dispatch", response_model=TripOut)
def dispatch_trip(trip_id: int, db: Session = Depends(get_db)):
    # TODO: Change status to Dispatched, set dispatched_at, and update vehicle/driver status to On Trip
    return {
        "id": trip_id,
        "source": "New York, NY",
        "destination": "Boston, MA",
        "vehicle_id": 1,
        "driver_id": 1,
        "cargo_weight_kg": 15000.0,
        "planned_distance_km": 350.0,
        "actual_distance_km": None,
        "fuel_consumed_l": None,
        "status": "Dispatched",
        "created_at": datetime.now(),
        "dispatched_at": datetime.now(),
        "completed_at": None
    }

@router.post("/{trip_id}/complete", response_model=TripOut)
def complete_trip(trip_id: int, completion_data: TripCompleteRequest, db: Session = Depends(get_db)):
    # TODO: Change status to Completed, set completed_at, actual distance, fuel, update odometer, update safety score, reset vehicle/driver status to Available
    return {
        "id": trip_id,
        "source": "New York, NY",
        "destination": "Boston, MA",
        "vehicle_id": 1,
        "driver_id": 1,
        "cargo_weight_kg": 15000.0,
        "planned_distance_km": 350.0,
        "actual_distance_km": completion_data.actual_distance_km,
        "fuel_consumed_l": completion_data.fuel_consumed_l,
        "status": "Completed",
        "created_at": datetime.now(),
        "dispatched_at": datetime.now(),
        "completed_at": datetime.now()
    }
