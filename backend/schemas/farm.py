from pydantic import BaseModel, field_validator, ConfigDict
from typing import Optional, Any
from datetime import datetime

class FarmProfileBase(BaseModel):
    farm_name: str
    location: str
    farm_area: Optional[float] = None
    number_of_fields: Optional[int] = None
    
    crop: str
    growth_stage: str
    sowing_date: Optional[str] = None
    
    water_source: str
    borewell_depth: Optional[float] = None
    irrigation_method: Optional[str] = None
    
    pump_type: str
    pump_capacity: float
    pump_rating: Optional[str] = None
    pump_age: Optional[float] = None
    
    solar_pump: str
    solar_capacity: Optional[float] = None
    panel_capacity: Optional[str] = None
    battery: Optional[str] = None

    @field_validator("solar_pump", mode="before")
    @classmethod
    def normalize_solar_pump(cls, v: Any) -> str:
        if isinstance(v, str):
            clean = v.strip().lower()
            if clean in ("yes", "y", "true", "1"):
                return "yes"
            elif clean in ("no", "n", "false", "0"):
                return "no"
            return clean
        elif isinstance(v, bool):
            return "yes" if v else "no"
        return "no" if not v else str(v)

class FarmProfileCreate(FarmProfileBase):
    pass

class FarmProfileUpdate(FarmProfileBase):
    pass

class FarmProfileResponse(FarmProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
