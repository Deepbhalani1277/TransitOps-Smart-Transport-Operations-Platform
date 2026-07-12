# STUB ONLY: Auth helper signatures. Real implementation to be filled in by Person 2.

from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # TODO: Implement password verification using passlib bcrypt
    # return pwd_context.verify(plain_password, hashed_password)
    return False

def get_password_hash(password: str) -> str:
    # TODO: Implement password hashing using passlib bcrypt
    # return pwd_context.hash(password)
    return "hashed_password_stub"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    # TODO: Create and sign a JWT access token using python-jose
    return "stub_token_jwt"

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    # TODO: Decode token, verify, and return the User database object
    # If invalid or not found, raise credentials_exception
    # credentials_exception = HTTPException(
    #     status_code=status.HTTP_401_UNAUTHORIZED,
    #     detail="Could not validate credentials",
    #     headers={"WWW-Authenticate": "Bearer"},
    # )
    pass
