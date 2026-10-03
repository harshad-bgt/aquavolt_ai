import pytest
from backend.models.farm_profile import FarmProfile
from backend.schemas.advice import CurrentConditions, RecommendationCategory
from backend.services.advice_engine import evaluate_conditions

def test_evaluate_conditions_rain():
    profile = FarmProfile(crop="Wheat", growth_stage="Vegetative", pump_capacity=5.0, solar_pump="No")
    conditions = CurrentConditions(soil_moisture_level="LOW", weather_forecast="RAIN", borewell_water_level="ADEQUATE", solar_availability="LOW")
    
    advice = evaluate_conditions(profile, conditions)
    
    assert advice.primary_recommendation == RecommendationCategory.RAIN_DELAY
    assert "RAIN" in advice.contributing_conditions[1]

def test_evaluate_conditions_high_moisture():
    profile = FarmProfile(crop="Rice", growth_stage="Seedling", pump_capacity=3.0, solar_pump="Yes")
    conditions = CurrentConditions(soil_moisture_level="HIGH", weather_forecast="CLEAR", borewell_water_level="ADEQUATE", solar_availability="HIGH")
    
    advice = evaluate_conditions(profile, conditions)
    
    assert advice.primary_recommendation == RecommendationCategory.WAIT_BEFORE_IRRIGATING

def test_evaluate_conditions_low_borewell():
    profile = FarmProfile(crop="Sugarcane", growth_stage="Mature", pump_capacity=10.0, solar_pump="No")
    conditions = CurrentConditions(soil_moisture_level="LOW", weather_forecast="CLEAR", borewell_water_level="LOW", solar_availability="HIGH")
    
    advice = evaluate_conditions(profile, conditions)
    
    assert advice.primary_recommendation == RecommendationCategory.BOREWELL_RECOVERY

def test_evaluate_conditions_solar_window():
    profile = FarmProfile(crop="Wheat", growth_stage="Vegetative", pump_capacity=5.0, solar_pump="Yes")
    conditions = CurrentConditions(soil_moisture_level="LOW", weather_forecast="CLEAR", borewell_water_level="ADEQUATE", solar_availability="HIGH")
    
    advice = evaluate_conditions(profile, conditions)
    
    assert advice.primary_recommendation == RecommendationCategory.SOLAR_WINDOW

def test_evaluate_conditions_insufficient_data():
    profile = FarmProfile(crop="Wheat", growth_stage="Vegetative", pump_capacity=5.0, solar_pump="No")
    conditions = CurrentConditions(soil_moisture_level=None, weather_forecast=None, borewell_water_level=None, solar_availability=None)
    
    advice = evaluate_conditions(profile, conditions)
    
    assert advice.primary_recommendation == RecommendationCategory.INSUFFICIENT_DATA
    assert len(advice.missing_inputs) == 4

def test_evaluate_conditions_solar_window_lowercase_yes():
    # Regression test for BUG-001: Web onboarding saves lowercase 'yes'
    profile = FarmProfile(crop="Wheat", growth_stage="Vegetative", pump_capacity=5.0, solar_pump="yes")
    conditions = CurrentConditions(soil_moisture_level="LOW", weather_forecast="CLEAR", borewell_water_level="ADEQUATE", solar_availability="HIGH")
    
    advice = evaluate_conditions(profile, conditions)
    
    assert advice.primary_recommendation == RecommendationCategory.SOLAR_WINDOW
    assert any("Pump: Solar" in c for c in advice.contributing_conditions)
    assert advice.confidence == "High"

def test_evaluate_conditions_solar_window_uppercase_yes():
    profile = FarmProfile(crop="Wheat", growth_stage="Vegetative", pump_capacity=5.0, solar_pump="YES")
    conditions = CurrentConditions(soil_moisture_level="LOW", weather_forecast="CLEAR", borewell_water_level="ADEQUATE", solar_availability="HIGH")
    
    advice = evaluate_conditions(profile, conditions)
    
    assert advice.primary_recommendation == RecommendationCategory.SOLAR_WINDOW
    assert any("Pump: Solar" in c for c in advice.contributing_conditions)

def test_evaluate_conditions_solar_window_mixed_casing():
    profile = FarmProfile(crop="Wheat", growth_stage="Vegetative", pump_capacity=5.0, solar_pump="Yes")
    conditions = CurrentConditions(soil_moisture_level="LOW", weather_forecast="CLEAR", borewell_water_level="ADEQUATE", solar_availability="HIGH")
    
    advice = evaluate_conditions(profile, conditions)
    
    assert advice.primary_recommendation == RecommendationCategory.SOLAR_WINDOW
    assert any("Pump: Solar" in c for c in advice.contributing_conditions)

def test_evaluate_conditions_no_solar_pump():
    profile = FarmProfile(crop="Wheat", growth_stage="Vegetative", pump_capacity=5.0, solar_pump="no")
    conditions = CurrentConditions(soil_moisture_level="LOW", weather_forecast="CLEAR", borewell_water_level="ADEQUATE", solar_availability="HIGH")
    
    advice = evaluate_conditions(profile, conditions)
    
    # Must NOT return SOLAR_WINDOW for non-solar farms
    assert advice.primary_recommendation != RecommendationCategory.SOLAR_WINDOW
    assert advice.primary_recommendation == RecommendationCategory.IRRIGATION_MAY_BE_NEEDED
    assert any("Pump: Grid" in c for c in advice.contributing_conditions)

def test_evaluate_conditions_none_or_missing_solar_pump():
    profile = FarmProfile(crop="Wheat", growth_stage="Vegetative", pump_capacity=5.0, solar_pump=None)
    conditions = CurrentConditions(soil_moisture_level="LOW", weather_forecast="CLEAR", borewell_water_level="ADEQUATE", solar_availability="HIGH")
    
    advice = evaluate_conditions(profile, conditions)
    
    assert advice.primary_recommendation != RecommendationCategory.SOLAR_WINDOW
    assert advice.primary_recommendation == RecommendationCategory.IRRIGATION_MAY_BE_NEEDED
    assert any("Pump: Grid" in c for c in advice.contributing_conditions)

def test_evaluate_conditions_solar_pump_low_solar_availability():
    profile = FarmProfile(crop="Wheat", growth_stage="Vegetative", pump_capacity=5.0, solar_pump="yes")
    conditions = CurrentConditions(soil_moisture_level="LOW", weather_forecast="CLEAR", borewell_water_level="ADEQUATE", solar_availability="LOW")
    
    advice = evaluate_conditions(profile, conditions)
    
    assert advice.primary_recommendation == RecommendationCategory.WAIT_BEFORE_IRRIGATING
    assert "Wait for a better solar window" in advice.suggested_action

