from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Any

from backend.database import get_db
from backend.models.user import User
from backend.schemas.auth import UserCreate, UserLogin, UserResponse, Token, TokenData
from backend.services.auth_service import get_password_hash, verify_password, create_access_token, decode_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/signup", response_model=UserResponse)
def signup(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    # Check if user exists by mobile
    user_mobile = db.query(User).filter(User.mobile == user_in.mobile).first()
    if user_mobile:
        raise HTTPException(
            status_code=400,
            detail="A user with this mobile number already exists.",
        )
    # Check if user exists by email
    if user_in.email:
        user_email = db.query(User).filter(User.email == user_in.email).first()
        if user_email:
            raise HTTPException(
                status_code=400,
                detail="A user with this email already exists.",
            )
    
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        name=user_in.name,
        mobile=user_in.mobile,
        email=user_in.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    # user_in.identifier could be mobile or email
    user = db.query(User).filter((User.mobile == user_in.identifier) | (User.email == user_in.identifier)).first()
    
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout():
    # In stateless JWT, logout is handled by the client discarding the token.
    # We can just return success here.
    return {"message": "Successfully logged out"}
