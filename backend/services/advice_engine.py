from datetime import datetime, timezone
from backend.schemas.advice import CurrentConditions, AdviceResponse, RecommendationCategory
from backend.models.farm_profile import FarmProfile

def evaluate_conditions(profile: FarmProfile, conditions: CurrentConditions) -> AdviceResponse:
    reasons = []
    contributing = []
    missing = []
    
    # Check what is missing
    if not conditions.soil_moisture_level:
        missing.append("soil_moisture_level")
    else:
        contributing.append(f"Soil moisture is {conditions.soil_moisture_level}")
        
    if not conditions.weather_forecast:
        missing.append("weather_forecast")
    else:
        contributing.append(f"Weather forecast is {conditions.weather_forecast}")
        
    if not conditions.borewell_water_level:
        missing.append("borewell_water_level")
    else:
        contributing.append(f"Borewell level is {conditions.borewell_water_level}")
        
    if not conditions.solar_availability:
        missing.append("solar_availability")
    else:
        contributing.append(f"Solar availability is {conditions.solar_availability}")

    # Farm profile conditions
    has_solar_pump = bool(profile.solar_pump and str(profile.solar_pump).strip().lower() in ("yes", "y", "true", "1"))
    contributing.append(f"Crop: {profile.crop} ({profile.growth_stage})")
    if has_solar_pump:
        contributing.append(f"Pump: Solar ({profile.pump_capacity} HP)")
    else:
        contributing.append(f"Pump: Grid ({profile.pump_capacity} HP)")

    if len(missing) >= 3:
        return AdviceResponse(
            primary_recommendation=RecommendationCategory.INSUFFICIENT_DATA,
            reasons=["Not enough current condition data provided to make a confident recommendation."],
            contributing_conditions=contributing,
            missing_inputs=missing,
            suggested_action="Please provide at least soil moisture and weather forecast.",
            confidence="Low",
            timestamp=datetime.now(timezone.utc)
        )

    # Logic rules
    if conditions.weather_forecast == 'RAIN':
        return AdviceResponse(
            primary_recommendation=RecommendationCategory.RAIN_DELAY,
            reasons=["Rain is forecasted, reducing the immediate need for artificial irrigation."],
            contributing_conditions=contributing,
            missing_inputs=missing,
            suggested_action="Wait for rain to pass before re-evaluating soil moisture.",
            confidence="High",
            timestamp=datetime.now(timezone.utc)
        )

    if conditions.soil_moisture_level == 'HIGH':
        return AdviceResponse(
            primary_recommendation=RecommendationCategory.WAIT_BEFORE_IRRIGATING,
            reasons=["Soil moisture is currently sufficient for the crop's needs."],
            contributing_conditions=contributing,
            missing_inputs=missing,
            suggested_action="No irrigation needed today. Check again tomorrow.",
            confidence="High",
            timestamp=datetime.now(timezone.utc)
        )

    if conditions.borewell_water_level == 'LOW':
        return AdviceResponse(
            primary_recommendation=RecommendationCategory.BOREWELL_RECOVERY,
            reasons=["Borewell water level is too low to sustain continuous pumping."],
            contributing_conditions=contributing,
            missing_inputs=missing,
            suggested_action="Allow the borewell to recover for several hours. Do not run the pump.",
            confidence="High",
            timestamp=datetime.now(timezone.utc)
        )

    if conditions.soil_moisture_level == 'LOW':
        if has_solar_pump:
            if conditions.solar_availability == 'LOW':
                return AdviceResponse(
                    primary_recommendation=RecommendationCategory.WAIT_BEFORE_IRRIGATING,
                    reasons=["Soil needs water, but solar power is currently low."],
                    contributing_conditions=contributing,
                    missing_inputs=missing,
                    suggested_action="Wait for a better solar window (typically between 10 AM and 3 PM).",
                    confidence="Medium",
                    timestamp=datetime.now(timezone.utc)
                )
            elif conditions.solar_availability == 'HIGH':
                return AdviceResponse(
                    primary_recommendation=RecommendationCategory.SOLAR_WINDOW,
                    reasons=["Soil needs water and solar availability is currently optimal."],
                    contributing_conditions=contributing,
                    missing_inputs=missing,
                    suggested_action="Start irrigation now to maximize free solar energy.",
                    confidence="High",
                    timestamp=datetime.now(timezone.utc)
                )
        
        return AdviceResponse(
            primary_recommendation=RecommendationCategory.IRRIGATION_MAY_BE_NEEDED,
            reasons=["Soil moisture is low and no rain is expected."],
            contributing_conditions=contributing,
            missing_inputs=missing,
            suggested_action="Consider irrigating if grid power is available.",
            confidence="Medium",
            timestamp=datetime.now(timezone.utc)
        )

    # Fallback
    return AdviceResponse(
        primary_recommendation=RecommendationCategory.WAIT_BEFORE_IRRIGATING,
        reasons=["Conditions do not strongly indicate a need for immediate irrigation."],
        contributing_conditions=contributing,
        missing_inputs=missing,
        suggested_action="Monitor soil moisture and weather.",
        confidence="Low",
        timestamp=datetime.now(timezone.utc)
    )
