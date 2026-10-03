import os
import sys
from datetime import datetime, timedelta, timezone

# Ensure the app can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal, Base, engine
from backend.models.user import User
from backend.models.farm_profile import FarmProfile
from backend.models.farm_reading import FarmReading
from backend.services.auth_service import get_password_hash

def seed_demo_data():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        email = "demo@aquavolt.com"
        mobile = "9999999999"
        
        # 1. Clean up existing demo user
        user = db.query(User).filter(User.mobile == mobile).first()
        if user:
            print(f"Cleaning up existing data for {mobile}...")
            db.query(FarmReading).filter(FarmReading.user_id == user.id).delete()
            db.query(FarmProfile).filter(FarmProfile.user_id == user.id).delete()
            db.delete(user)
            db.commit()
            
        # 2. Create User
        print(f"Creating demo user {email}...")
        demo_user = User(
            name="Demo Farmer",
            mobile=mobile,
            email=email,
            password_hash=get_password_hash("password")
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        
        # 3. Create Farm Profile
        print("Creating farm profile...")
        profile = FarmProfile(
            user_id=demo_user.id,
            farm_name="AquaVolt Demo Farm",
            location="Maharashtra, India",
            farm_area=5.0,
            number_of_fields=2,
            crop="Wheat",
            growth_stage="Vegetative",
            sowing_date="2026-08-01",
            water_source="Borewell",
            borewell_depth=400.0,
            irrigation_method="Drip",
            pump_type="Submersible",
            pump_capacity=5.0,
            solar_pump="yes",
            solar_capacity=10.0
        )
        db.add(profile)
        db.commit()
        
        # 4. Generate 30 days of correlated history
        print("Generating 30 days of historical readings...")
        now = datetime.utcnow()
        readings = []
        
        for i in range(30, 0, -1):
            date_morning = now - timedelta(days=i, hours=10) # ~ 8 AM if now is 6 PM
            date_evening = now - timedelta(days=i, hours=2)  # ~ 4 PM
            
            # Simple correlated logic
            # Day 30 to 25: Normal
            # Day 24 to 20: Rain
            # Day 19 to 10: Dry
            # Day 9 to 1: Normal
            
            if i >= 25:
                # Normal
                moisture = "MEDIUM"
                weather = "CLEAR"
                borewell = "ADEQUATE"
                solar = "HIGH"
                rainfall = 0.0
                pump_hours_m = 2.0
                pump_hours_e = 1.0
            elif i >= 20:
                # Rain
                moisture = "HIGH"
                weather = "RAIN"
                borewell = "ADEQUATE"
                solar = "LOW"
                rainfall = 15.0
                pump_hours_m = 0.0
                pump_hours_e = 0.0
            elif i >= 10:
                # Dry / Pumping heavily
                moisture = "LOW"
                weather = "CLEAR"
                borewell = "LOW"
                solar = "HIGH"
                rainfall = 0.0
                pump_hours_m = 4.0
                pump_hours_e = 3.0
            else:
                # Normal / Recovery
                moisture = "MEDIUM"
                weather = "CLEAR"
                borewell = "ADEQUATE"
                solar = "HIGH"
                rainfall = 0.0
                pump_hours_m = 2.5
                pump_hours_e = 1.5

            # Morning Reading
            r_morning = FarmReading(
                user_id=demo_user.id,
                soil_moisture_level=moisture,
                soil_temperature=22.0 + (5.0 if weather == "CLEAR" else 0.0),
                borewell_water_level="ADEQUATE", # Morning usually recovers
                pump_status="ON" if pump_hours_m > 0 else "OFF",
                pump_runtime_hours=pump_hours_m,
                solar_availability=solar,
                weather_forecast=weather,
                rainfall_mm=rainfall if weather == "RAIN" else 0.0,
                is_demo=True,
                created_at=date_morning
            )
            readings.append(r_morning)
            
            # Evening Reading
            r_evening = FarmReading(
                user_id=demo_user.id,
                soil_moisture_level=moisture,
                soil_temperature=26.0 + (5.0 if weather == "CLEAR" else 0.0),
                borewell_water_level=borewell, # Reflects the condition
                pump_status="OFF",
                pump_runtime_hours=pump_hours_e,
                solar_availability="LOW", # Evening
                weather_forecast=weather,
                rainfall_mm=0.0,
                is_demo=True,
                created_at=date_evening
            )
            readings.append(r_evening)
            
        db.bulk_save_objects(readings)
        db.commit()
        
        print("Demo data seeded successfully!")
        print(f"Login with: {mobile} or {email} / password: password")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
