from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base

class FarmProfile(Base):
    __tablename__ = "farm_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    farm_name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    farm_area = Column(Float, nullable=True) # in acres
    number_of_fields = Column(Integer, nullable=True)
    
    crop = Column(String, nullable=False)
    growth_stage = Column(String, nullable=False)
    sowing_date = Column(String, nullable=True)
    
    water_source = Column(String, nullable=False)
    borewell_depth = Column(Float, nullable=True) # in feet
    irrigation_method = Column(String, nullable=True)
    
    pump_type = Column(String, nullable=False)
    pump_capacity = Column(Float, nullable=False) # HP
    pump_rating = Column(String, nullable=True)
    pump_age = Column(Float, nullable=True) # years
    
    solar_pump = Column(String, nullable=False) # 'yes' or 'no'
    solar_capacity = Column(Float, nullable=True) # kW
    panel_capacity = Column(String, nullable=True)
    battery = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="farm_profile")
