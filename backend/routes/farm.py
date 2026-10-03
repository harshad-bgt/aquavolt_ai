from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any

from backend.database import get_db
from backend.models.farm_profile import FarmProfile
from backend.models.user import User
from backend.schemas.farm import FarmProfileCreate, FarmProfileUpdate, FarmProfileResponse
from backend.routes.auth import get_current_user

router = APIRouter(prefix="/api/farm", tags=["farm"])

@router.get("/profile", response_model=FarmProfileResponse)
def get_farm_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(FarmProfile).filter(FarmProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Farm profile not found")
    return profile

@router.post("/profile", response_model=FarmProfileResponse)
def create_farm_profile(profile_in: FarmProfileCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing_profile = db.query(FarmProfile).filter(FarmProfile.user_id == current_user.id).first()
    if existing_profile:
        # If it already exists, update instead of create to avoid duplicates
        return update_farm_profile(profile_in, current_user, db)
        
    db_profile = FarmProfile(
        user_id=current_user.id,
        **profile_in.model_dump()
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.put("/profile", response_model=FarmProfileResponse)
def update_farm_profile(profile_in: FarmProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_profile = db.query(FarmProfile).filter(FarmProfile.user_id == current_user.id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Farm profile not found")
        
    update_data = profile_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_profile, key, value)
        
    db.commit()
    db.refresh(db_profile)
    return db_profile
