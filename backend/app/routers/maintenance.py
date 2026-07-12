# STUB ONLY: Maintenance logs router. Implementation by Person 3.

from typing import List
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import MaintenanceLogCreate, MaintenanceLogUpdate, MaintenanceLogOut

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])

@router.get("", response_model=List[MaintenanceLogOut])
def list_maintenance_logs(db: Session = Depends(get_db)):
    # TODO: Fetch and return list of all maintenance logs from database
    return []

@router.post("", response_model=MaintenanceLogOut, status_code=status.HTTP_201_CREATED)
def create_maintenance_log(log_in: MaintenanceLogCreate, db: Session = Depends(get_db)):
    # TODO: Save log to DB, update vehicle status to "In Shop" if log is active, and return MaintenanceLogOut
    return {
        "id": 1,
        **log_in.model_dump()
    }

@router.patch("/{log_id}", response_model=MaintenanceLogOut)
def update_maintenance_log(log_id: int, log_in: MaintenanceLogUpdate, db: Session = Depends(get_db)):
    # TODO: Update log in DB, if closing log (status=Closed) reset vehicle status to "Available", and return MaintenanceLogOut
    return {
        "id": log_id,
        "vehicle_id": 1,
        "service_type": log_in.service_type or "Engine Oil Change",
        "cost": log_in.cost or 150.0,
        "date": date.today(),
        "status": log_in.status or "Closed"
    }
