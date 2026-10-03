from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from datetime import datetime, timezone
from backend.database import Base

class FarmReading(Base):
    __tablename__ = "farm_readings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    
    soil_moisture_level = Column(String, nullable=True)
    soil_temperature = Column(Float, nullable=True)
    
    borewell_water_level = Column(String, nullable=True)
    pump_status = Column(String, nullable=True)
    pump_runtime_hours = Column(Float, nullable=True)
    
    solar_availability = Column(String, nullable=True)
    weather_forecast = Column(String, nullable=True)
    rainfall_mm = Column(Float, nullable=True)
    
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
