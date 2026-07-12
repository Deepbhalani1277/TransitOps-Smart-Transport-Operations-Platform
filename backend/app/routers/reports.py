# STUB ONLY: Reports router. Implementation by Person 3.

from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/fleet-summary")
def get_fleet_summary(db: Session = Depends(get_db)):
    # TODO: Calculate and return real-time fleet aggregates
    return {
        "total_vehicles": 12,
        "active_trips": 3,
        "vehicles_in_shop": 1,
        "total_odometer_km": 154200.5
    }

@router.get("/cost-breakdown")
def get_cost_breakdown(
    start_date: Optional[date] = Query(None, alias="from"),
    end_date: Optional[date] = Query(None, alias="to"),
    db: Session = Depends(get_db)
):
    # TODO: Calculate fuel, maintenance, and miscellaneous costs in date range
    return {
        "total_fuel_cost": 1500.0,
        "total_maintenance_cost": 950.0,
        "total_expenses_cost": 340.0,
        "grand_total": 2790.0
    }

@router.get("/fuel-efficiency")
def get_fuel_efficiency(
    start_date: Optional[date] = Query(None, alias="from"),
    end_date: Optional[date] = Query(None, alias="to"),
    db: Session = Depends(get_db)
):
    # TODO: Calculate liters per 100km efficiency for vehicles
    return [
        {
            "vehicle_id": 1,
            "reg_number": "TX-1234-OP",
            "total_distance_km": 1200.0,
            "total_fuel_liters": 115.0,
            "liters_per_100km": 9.58
        }
    ]

@router.get("/driver-performance")
def get_driver_performance(db: Session = Depends(get_db)):
    # TODO: Aggregate driver safety scores and completed trips
    return [
        {
            "driver_id": 1,
            "name": "Alice Smith",
            "safety_score": 98,
            "trips_completed": 15
        }
    ]
