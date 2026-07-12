# STUB ONLY: Auth router. Implementation by Person 2.

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import UserCreate, UserLogin, UserOut, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # TODO: Hash password, save user to database, return UserOut
    # Example stub:
    return {
        "id": 1,
        "name": user_in.name,
        "email": user_in.email,
        "role": user_in.role
    }

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    # TODO: Authenticate user, generate and return access token
    # Example stub:
    return {
        "access_token": "stubbed_jwt_token_for_user",
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserOut)
def get_me():
    # TODO: Retrieve authenticated user using get_current_user dependency
    # Example stub:
    return {
        "id": 1,
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "Fleet Manager"
    }
