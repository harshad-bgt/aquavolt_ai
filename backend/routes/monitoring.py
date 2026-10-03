from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from backend.database import get_db
from backend.routes.auth import get_current_user
from backend.schemas.auth import UserResponse
from backend.models.farm_reading import FarmReading
from backend.schemas.monitoring import FarmReadingCreate, FarmReadingResponse

router = APIRouter(
    prefix="/api/monitoring",
    tags=["Monitoring"]
)

@router.post("/", response_model=FarmReadingResponse)
def create_reading(
    reading: FarmReadingCreate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_reading = FarmReading(**reading.model_dump(), user_id=current_user.id)
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading

@router.get("/latest", response_model=FarmReadingResponse)
def get_latest_reading(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reading = db.query(FarmReading)\
        .filter(FarmReading.user_id == current_user.id)\
        .order_by(FarmReading.created_at.desc())\
        .first()
        
    if not reading:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No readings found")
        
    return reading

@router.get("/history", response_model=List[FarmReadingResponse])
def get_reading_history(
    limit: int = 100,
    days: Optional[int] = None,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if limit <= 0 or limit > 1000:
        raise HTTPException(status_code=400, detail="Limit must be between 1 and 1000")
        
    query = db.query(FarmReading).filter(FarmReading.user_id == current_user.id)
    
    if days is not None:
        if days <= 0:
            raise HTTPException(status_code=400, detail="Days parameter must be strictly positive")
        cutoff = datetime.utcnow() - timedelta(days=days)
        query = query.filter(FarmReading.created_at >= cutoff)
        
    readings = query.order_by(FarmReading.created_at.desc()).limit(limit).all()
    return readings
