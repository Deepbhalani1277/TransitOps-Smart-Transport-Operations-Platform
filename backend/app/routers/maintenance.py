from typing import List
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import MaintenanceLog, Vehicle, MaintenanceStatus, VehicleStatus
from app.schemas import MaintenanceLogCreate, MaintenanceLogUpdate, MaintenanceLogOut
from app.auth import require_role

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])

@router.get("", response_model=List[MaintenanceLogOut])
def list_maintenance_logs(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"]))
):
    return db.query(MaintenanceLog).all()


@router.post("", response_model=MaintenanceLogOut, status_code=status.HTTP_201_CREATED)
def create_maintenance_log(
    log_in: MaintenanceLogCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager"]))
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == log_in.vehicle_id).with_for_update().first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {log_in.vehicle_id} not found"
        )

    # Block if vehicle is currently On Trip
    if vehicle.status == VehicleStatus.ON_TRIP:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot log maintenance for vehicle '{vehicle.name}' because it is currently On Trip"
        )

    db_log = MaintenanceLog(
        vehicle_id=log_in.vehicle_id,
        service_type=log_in.service_type,
        cost=log_in.cost,
        date=log_in.date,
        status=log_in.status
    )
    db.add(db_log)

    # If maintenance is active, set vehicle status to In Shop
    if log_in.status == MaintenanceStatus.ACTIVE:
        vehicle.status = VehicleStatus.IN_SHOP

    db.commit()
    db.refresh(db_log)
    return db_log


@router.post("/{log_id}/close", response_model=MaintenanceLogOut)
def close_maintenance_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager"]))
):
    log = db.query(MaintenanceLog).filter(MaintenanceLog.id == log_id).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance log with ID {log_id} not found"
        )

    if log.status == MaintenanceStatus.CLOSED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This maintenance log is already closed"
        )

    vehicle = db.query(Vehicle).filter(Vehicle.id == log.vehicle_id).with_for_update().first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle associated with this log not found"
        )

    # Close the maintenance log
    log.status = MaintenanceStatus.CLOSED

    # Check if vehicle is Retired
    if vehicle.status != VehicleStatus.RETIRED:
        # Check if there are other Active maintenance logs for this vehicle
        other_active = db.query(MaintenanceLog).filter(
            MaintenanceLog.vehicle_id == vehicle.id,
            MaintenanceLog.id != log.id,
            MaintenanceLog.status == MaintenanceStatus.ACTIVE
        ).first()

        # If no other active logs, restore status to Available
        if not other_active:
            vehicle.status = VehicleStatus.AVAILABLE

    db.commit()
    db.refresh(log)
    return log
