from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class FarmReadingBase(BaseModel):
    soil_moisture_level: Optional[str] = None
    soil_temperature: Optional[float] = None
    borewell_water_level: Optional[str] = None
    pump_status: Optional[str] = None
    pump_runtime_hours: Optional[float] = None
    solar_availability: Optional[str] = None
    weather_forecast: Optional[str] = None
    rainfall_mm: Optional[float] = None
    is_demo: bool = False

class FarmReadingCreate(FarmReadingBase):
    pass

class FarmReadingResponse(FarmReadingBase):
    id: int
    user_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
