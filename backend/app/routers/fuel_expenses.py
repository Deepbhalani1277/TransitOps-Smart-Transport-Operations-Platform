from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import FuelLog, Expense, Vehicle, Trip
from app.schemas import FuelLogCreate, FuelLogOut, ExpenseCreate, ExpenseOut
from app.auth import require_role

router = APIRouter(tags=["Fuel & Expenses"])

@router.get("/fuel", response_model=List[FuelLogOut])
def list_fuel_logs(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Safety Officer", "Financial Analyst"]))
):
    return db.query(FuelLog).all()


@router.post("/fuel", response_model=FuelLogOut, status_code=status.HTTP_201_CREATED)
def create_fuel_log(
    log_in: FuelLogCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Financial Analyst"]))
):
    # Verify vehicle exists
    vehicle = db.query(Vehicle).filter(Vehicle.id == log_in.vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {log_in.vehicle_id} not found"
        )

    # Verify trip exists if trip_id is provided
    if log_in.trip_id is not None:
        trip = db.query(Trip).filter(Trip.id == log_in.trip_id).first()
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Trip with ID {log_in.trip_id} not found"
            )

    db_log = FuelLog(
        vehicle_id=log_in.vehicle_id,
        trip_id=log_in.trip_id,
        liters=log_in.liters,
        cost=log_in.cost,
        date=log_in.date
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


@router.get("/expenses", response_model=List[ExpenseOut])
def list_expenses(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Financial Analyst"]))
):
    return db.query(Expense).all()


@router.post("/expenses", response_model=ExpenseOut, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense_in: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Financial Analyst"]))
):
    # Verify vehicle exists
    vehicle = db.query(Vehicle).filter(Vehicle.id == expense_in.vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {expense_in.vehicle_id} not found"
        )

    # Verify trip exists if trip_id is provided
    if expense_in.trip_id is not None:
        trip = db.query(Trip).filter(Trip.id == expense_in.trip_id).first()
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Trip with ID {expense_in.trip_id} not found"
            )

    db_expense = Expense(
        vehicle_id=expense_in.vehicle_id,
        trip_id=expense_in.trip_id,
        type=expense_in.type,
        amount=expense_in.amount,
        date=expense_in.date
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense
