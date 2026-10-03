from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.routes.auth import get_current_user
from backend.schemas.auth import UserResponse
from backend.models.farm_profile import FarmProfile
from backend.schemas.advice import CurrentConditions, AdviceResponse
from backend.services.advice_engine import evaluate_conditions

router = APIRouter(
    prefix="/api/advice",
    tags=["Advice"]
)

@router.post("/evaluate", response_model=AdviceResponse)
def evaluate_farm_advice(
    conditions: CurrentConditions,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch the user's farm profile
    farm_profile = db.query(FarmProfile).filter(FarmProfile.user_id == current_user.id).first()
    
    if not farm_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm profile not found. Please complete onboarding first."
        )
        
    from backend.models.farm_reading import FarmReading
    from datetime import datetime, timezone

    latest_reading = db.query(FarmReading)\
        .filter(FarmReading.user_id == current_user.id)\
        .order_by(FarmReading.created_at.desc())\
        .first()
        
    merged_conditions = conditions.model_copy()
    
    is_stale = False
    
    if latest_reading:
        # Check if stale (e.g., older than 12 hours)
        delta = datetime.utcnow() - latest_reading.created_at
        if delta.total_seconds() > 12 * 3600:
            is_stale = True

        # Fallback to reading values if not provided explicitly in request
        if merged_conditions.soil_moisture_level is None:
            merged_conditions.soil_moisture_level = latest_reading.soil_moisture_level
        if merged_conditions.weather_forecast is None:
            merged_conditions.weather_forecast = latest_reading.weather_forecast
        if merged_conditions.borewell_water_level is None:
            merged_conditions.borewell_water_level = latest_reading.borewell_water_level
        if merged_conditions.solar_availability is None:
            merged_conditions.solar_availability = latest_reading.solar_availability
            
    advice = evaluate_conditions(farm_profile, merged_conditions)
    
    if is_stale:
        advice.reasons.append("Warning: Using stale data from previous readings (older than 12 hours). Please update measurements.")
    
    return advice
