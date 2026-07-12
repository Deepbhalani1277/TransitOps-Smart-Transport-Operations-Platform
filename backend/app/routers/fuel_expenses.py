# STUB ONLY: Fuel & Expenses router. Implementation by Person 3.

from typing import List
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import FuelLogCreate, FuelLogOut, ExpenseCreate, ExpenseOut

router = APIRouter(tags=["Fuel & Expenses"])

@router.get("/fuel", response_model=List[FuelLogOut])
def list_fuel_logs(db: Session = Depends(get_db)):
    # TODO: Fetch and return list of all fuel logs from database
    return []

@router.post("/fuel", response_model=FuelLogOut, status_code=status.HTTP_201_CREATED)
def create_fuel_log(log_in: FuelLogCreate, db: Session = Depends(get_db)):
    # TODO: Save fuel log to DB and return FuelLogOut
    return {
        "id": 1,
        **log_in.model_dump()
    }

@router.get("/expenses", response_model=List[ExpenseOut])
def list_expenses(db: Session = Depends(get_db)):
    # TODO: Fetch and return list of all expenses from database
    return []

@router.post("/expenses", response_model=ExpenseOut, status_code=status.HTTP_201_CREATED)
def create_expense(expense_in: ExpenseCreate, db: Session = Depends(get_db)):
    # TODO: Save expense to DB and return ExpenseOut
    return {
        "id": 1,
        **expense_in.model_dump()
    }
