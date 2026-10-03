from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.database import Base, get_db
import pytest
import os

TEST_DB_URL = "sqlite:///./data/test_monitoring.db"
test_engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


def test_monitoring_endpoints():
    # 1. Signup and login User A
    client.post("/api/auth/signup", json={
        "name": "User A", "mobile": "1111111111", "password": "password"
    })
    token_a = client.post("/api/auth/login", json={
        "identifier": "1111111111", "password": "password"
    }).json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # 2. Signup and login User B
    client.post("/api/auth/signup", json={
        "name": "User B", "mobile": "2222222222", "password": "password"
    })
    token_b = client.post("/api/auth/login", json={
        "identifier": "2222222222", "password": "password"
    }).json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 3. User A posts a reading
    res = client.post("/api/monitoring/", json={
        "soil_moisture_level": "LOW",
        "soil_temperature": 28.5,
        "is_demo": True
    }, headers=headers_a)
    assert res.status_code == 200
    reading_a = res.json()
    assert reading_a["soil_moisture_level"] == "LOW"

    # 4. User B posts a reading
    res = client.post("/api/monitoring/", json={
        "soil_moisture_level": "HIGH",
        "borewell_water_level": "ADEQUATE"
    }, headers=headers_b)
    assert res.status_code == 200
    reading_b = res.json()
    assert reading_b["soil_moisture_level"] == "HIGH"

    # 5. User A gets latest
    res = client.get("/api/monitoring/latest", headers=headers_a)
    assert res.status_code == 200
    assert res.json()["soil_moisture_level"] == "LOW"
    assert res.json()["borewell_water_level"] is None

    # 6. User B gets latest
    res = client.get("/api/monitoring/latest", headers=headers_b)
    assert res.status_code == 200
    assert res.json()["soil_moisture_level"] == "HIGH"

    # 7. User A gets history
    res = client.get("/api/monitoring/history", headers=headers_a)
    assert res.status_code == 200
    assert len(res.json()) == 1
    assert res.json()[0]["id"] == reading_a["id"]

def test_advice_integration_with_stale_data():
    client.post("/api/auth/signup", json={
        "name": "User B", "mobile": "2222222222", "password": "password"
    })
    token_b = client.post('/api/auth/login', json={'identifier': '2222222222', 'password': 'password'}).json()['access_token']
    
    # Create FarmProfile for User B
    client.post("/api/farm/profile", json={
        "farm_name": "Test Farm",
        "location": "Test Location",
        "crop": "Cotton",
        "growth_stage": "Vegetative",
        "water_source": "borewell",
        "pump_type": "Submersible",
        "pump_capacity": 5.0,
        "solar_pump": "no"
    }, headers={"Authorization": f"Bearer {token_b}"})

    # Add a reading for User B
    client.post("/api/monitoring/", json={
        "soil_moisture_level": "HIGH",
        "borewell_water_level": "ADEQUATE"
    }, headers={"Authorization": f"Bearer {token_b}"})

    res = client.post("/api/advice/evaluate", json={}, headers={"Authorization": f"Bearer {token_b}"})
    assert res.status_code == 200
    advice = res.json()
    assert advice["primary_recommendation"] == "WAIT_BEFORE_IRRIGATING" # High moisture from previous test


def test_history_days_filter():
    client.post("/api/auth/signup", json={
        "name": "User C", "mobile": "3333333333", "password": "password"
    })
    token_c = client.post('/api/auth/login', json={'identifier': '3333333333', 'password': 'password'}).json()['access_token']
    
    # We can't easily mock the created_at timestamp in SQLite via the API, 
    # but we can test that passing ?days=7 doesn't crash and returns the recently created reading.
    client.post("/api/monitoring/", json={
        "soil_moisture_level": "LOW",
    }, headers={"Authorization": f"Bearer {token_c}"})

    res = client.get("/api/monitoring/history?days=7", headers={"Authorization": f"Bearer {token_c}"})
    assert res.status_code == 200
    assert len(res.json()) == 1

def test_advice_api_solar_window_with_lowercase_profile():
    # End-to-end API test: web onboarding creates profile with lowercase 'yes'
    client.post("/api/auth/signup", json={
        "name": "Solar Farmer", "mobile": "4444444444", "password": "password"
    })
    token = client.post('/api/auth/login', json={'identifier': '4444444444', 'password': 'password'}).json()['access_token']
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Create farm profile with lowercase 'yes'
    prof_res = client.post("/api/farm/profile", json={
        "farm_name": "Solar Test Farm",
        "location": "Nashik",
        "crop": "Grapes",
        "growth_stage": "Fruiting",
        "water_source": "borewell",
        "pump_type": "Submersible",
        "pump_capacity": 7.5,
        "solar_pump": "yes"
    }, headers=headers)
    assert prof_res.status_code == 200
    assert prof_res.json()["solar_pump"] == "yes"

    # 2. Evaluate advice with LOW moisture and HIGH solar
    adv_res = client.post("/api/advice/evaluate", json={
        "soil_moisture_level": "LOW",
        "weather_forecast": "CLEAR",
        "borewell_water_level": "ADEQUATE",
        "solar_availability": "HIGH"
    }, headers=headers)
    assert adv_res.status_code == 200
    advice = adv_res.json()
    assert advice["primary_recommendation"] == "SOLAR_WINDOW"
    assert any("Pump: Solar" in c for c in advice["contributing_conditions"])
    assert advice["confidence"] == "High"




