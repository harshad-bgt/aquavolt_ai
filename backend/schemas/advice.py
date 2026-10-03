from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from datetime import datetime

class RecommendationCategory(str, Enum):
    WAIT_BEFORE_IRRIGATING = "WAIT_BEFORE_IRRIGATING"
    IRRIGATION_MAY_BE_NEEDED = "IRRIGATION_MAY_BE_NEEDED"
    BOREWELL_RECOVERY = "BOREWELL_RECOVERY"
    RAIN_DELAY = "RAIN_DELAY"
    SOLAR_WINDOW = "SOLAR_WINDOW"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"

class CurrentConditions(BaseModel):
    soil_moisture_level: Optional[str] = None # LOW, MEDIUM, HIGH
    weather_forecast: Optional[str] = None    # CLEAR, RAIN, OVERCAST
    borewell_water_level: Optional[str] = None # LOW, ADEQUATE
    solar_availability: Optional[str] = None  # LOW, HIGH

class AdviceResponse(BaseModel):
    primary_recommendation: RecommendationCategory
    reasons: List[str]
    contributing_conditions: List[str]
    missing_inputs: List[str]
    suggested_action: str
    confidence: str
    timestamp: datetime
