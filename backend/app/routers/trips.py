from typing import List, Optional
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Trip, Vehicle, Driver, FuelLog, TripStatus, VehicleStatus, DriverStatus
from app.schemas import TripCreate, TripUpdate, TripOut, TripCompleteRequest
from app.auth import get_current_user, require_role

router = APIRouter(prefix="/trips", tags=["Trips"])

# Helper function to validate assignment compatibility
def validate_trip_assignments(
    db: Session,
    cargo_weight_kg: float,
    vehicle_id: Optional[int] = None,
    driver_id: Optional[int] = None
):
    if vehicle_id is not None:
        vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Vehicle with ID {vehicle_id} not found"
            )
        if vehicle.status == VehicleStatus.RETIRED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Vehicle '{vehicle.name}' is Retired and cannot be assigned"
            )
        if cargo_weight_kg > vehicle.max_capacity_kg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cargo weight ({cargo_weight_kg} kg) exceeds vehicle '{vehicle.name}' max capacity ({vehicle.max_capacity_kg} kg)"
            )

    if driver_id is not None:
        driver = db.query(Driver).filter(Driver.id == driver_id).first()
        if not driver:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Driver with ID {driver_id} not found"
            )


@router.get("", response_model=List[TripOut])
def list_trips(
    status: Optional[TripStatus] = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"]))
):
    query = db.query(Trip)
    if status:
        query = query.filter(Trip.status == status)
    return query.all()


@router.post("", response_model=TripOut, status_code=status.HTTP_201_CREATED)
def create_trip(
    trip_in: TripCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Dispatcher"]))
):
    # Enforce basic validations for cargo capacity and driver license / suspended status
    validate_trip_assignments(
        db=db,
        cargo_weight_kg=trip_in.cargo_weight_kg,
        vehicle_id=trip_in.vehicle_id,
        driver_id=trip_in.driver_id
    )

    db_trip = Trip(
        source=trip_in.source,
        destination=trip_in.destination,
        vehicle_id=trip_in.vehicle_id,
        driver_id=trip_in.driver_id,
        cargo_weight_kg=trip_in.cargo_weight_kg,
        planned_distance_km=trip_in.planned_distance_km,
        status=TripStatus.DRAFT
    )
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip


@router.get("/{trip_id}", response_model=TripOut)
def get_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"]))
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found"
        )
    return trip


@router.patch("/{trip_id}", response_model=TripOut)
def update_trip(
    trip_id: int,
    trip_in: TripUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Dispatcher"]))
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found"
        )

    if trip.status != TripStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only Draft trips can be modified. Current status: {trip.status}"
        )

    # Prepare values to validate
    new_cargo = trip_in.cargo_weight_kg if trip_in.cargo_weight_kg is not None else trip.cargo_weight_kg
    new_vehicle_id = trip_in.vehicle_id if trip_in.vehicle_id is not None else trip.vehicle_id
    new_driver_id = trip_in.driver_id if trip_in.driver_id is not None else trip.driver_id

    validate_trip_assignments(
        db=db,
        cargo_weight_kg=new_cargo,
        vehicle_id=new_vehicle_id,
        driver_id=new_driver_id
    )

    # Apply changes
    for var, val in trip_in.model_dump(exclude_unset=True).items():
        setattr(trip, var, val)

    db.commit()
    db.refresh(trip)
    return trip


@router.post("/{trip_id}/dispatch", response_model=TripOut)
def dispatch_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Dispatcher"]))
):
    # Everything inside one transaction using FOR UPDATE locks for vehicle/driver safety
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found"
        )

    if trip.status != TripStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Trip must be in Draft status to dispatch. Current status: {trip.status}"
        )

    if not trip.vehicle_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot dispatch: no vehicle is assigned to this trip"
        )
    if not trip.driver_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot dispatch: no driver is assigned to this trip"
        )

    # Lock resources for update to ensure consistency
    vehicle = db.query(Vehicle).filter(Vehicle.id == trip.vehicle_id).with_for_update().first()
    driver = db.query(Driver).filter(Driver.id == trip.driver_id).with_for_update().first()

    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assigned vehicle not found")
    if not driver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assigned driver not found")

    # Vehicle status validation
    if vehicle.status == VehicleStatus.ON_TRIP:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Vehicle '{vehicle.name}' is already On Trip"
        )
    if vehicle.status == VehicleStatus.IN_SHOP:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Vehicle '{vehicle.name}' is In Shop for maintenance and cannot be dispatched"
        )
    if vehicle.status == VehicleStatus.RETIRED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Vehicle '{vehicle.name}' is Retired and cannot be dispatched"
        )

    # Driver status validation
    if driver.status == DriverStatus.SUSPENDED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Driver '{driver.name}' is Suspended and cannot be dispatched"
        )
    if driver.status == DriverStatus.ON_TRIP:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Driver '{driver.name}' is already On Trip"
        )
    if driver.status == DriverStatus.OFF_DUTY:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Driver '{driver.name}' is Off Duty"
        )

    # License expiry validation
    if driver.license_expiry < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Driver '{driver.name}' license has expired ({driver.license_expiry})"
        )

    # Cargo weight validation
    if trip.cargo_weight_kg > vehicle.max_capacity_kg:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cargo weight ({trip.cargo_weight_kg} kg) exceeds vehicle max capacity ({vehicle.max_capacity_kg} kg)"
        )

    # Atomically apply updates
    trip.status = TripStatus.DISPATCHED
    trip.dispatched_at = datetime.utcnow()
    vehicle.status = VehicleStatus.ON_TRIP
    driver.status = DriverStatus.ON_TRIP

    db.commit()
    db.refresh(trip)
    return trip


@router.post("/{trip_id}/complete", response_model=TripOut)
def complete_trip(
    trip_id: int,
    completion_data: TripCompleteRequest,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Dispatcher"]))
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found"
        )

    if trip.status != TripStatus.DISPATCHED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only Dispatched trips can be completed. Current status: {trip.status}"
        )

    vehicle = db.query(Vehicle).filter(Vehicle.id == trip.vehicle_id).with_for_update().first()
    driver = db.query(Driver).filter(Driver.id == trip.driver_id).with_for_update().first()

    # Record completion data on the trip
    trip.actual_distance_km = completion_data.actual_distance_km
    trip.fuel_consumed_l = completion_data.fuel_consumed_l
    trip.status = TripStatus.COMPLETED
    trip.completed_at = datetime.utcnow()

    # Update vehicle odometer
    if vehicle:
        vehicle.odometer += completion_data.actual_distance_km
        vehicle.status = VehicleStatus.AVAILABLE

    # Auto-create FuelLog
    if completion_data.fuel_consumed_l > 0:
        fuel_log = FuelLog(
            vehicle_id=trip.vehicle_id,
            trip_id=trip.id,
            liters=completion_data.fuel_consumed_l,
            cost=completion_data.fuel_consumed_l * 1.50,  # $1.50 per liter default rate
            date=date.today()
        )
        db.add(fuel_log)

    # Adjust driver status and safety score
    if driver:
        driver.status = DriverStatus.AVAILABLE
        # Complete trip gives +1 to safety score, capped at 100
        driver.safety_score = min(100, driver.safety_score + 1)
        
        # Calculate fuel efficiency: liters per 100 km
        if completion_data.actual_distance_km > 0:
            efficiency = (completion_data.fuel_consumed_l / completion_data.actual_distance_km) * 100
            # Poor fuel efficiency (> 10 L / 100 km) subtracts 2
            if efficiency > 10.0:
                driver.safety_score = max(0, driver.safety_score - 2)

    db.commit()
    db.refresh(trip)
    return trip


@router.post("/{trip_id}/cancel", response_model=TripOut)
def cancel_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Dispatcher"]))
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found"
        )

    if trip.status in [TripStatus.COMPLETED, TripStatus.CANCELLED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel a trip that is already {trip.status}"
        )

    vehicle = db.query(Vehicle).filter(Vehicle.id == trip.vehicle_id).with_for_update().first()
    driver = db.query(Driver).filter(Driver.id == trip.driver_id).with_for_update().first()

    # If dispatched, release vehicle and driver to Available
    if trip.status == TripStatus.DISPATCHED:
        if vehicle:
            vehicle.status = VehicleStatus.AVAILABLE
        if driver:
            driver.status = DriverStatus.AVAILABLE

    trip.status = TripStatus.CANCELLED
    db.commit()
    db.refresh(trip)
    return trip
