import requests

BASE_URL = "http://127.0.0.1:8000/api"

def test_persistence():
    print("1. Signing up user...")
    signup_data = {
        "name": "Test Farmer",
        "mobile": "1234567890",
        "email": "test@example.com",
        "password": "password123"
    }
    r = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
    print("Signup Status:", r.status_code)
    
    print("\n2. Logging in...")
    login_data = {
        "identifier": "1234567890",
        "password": "password123"
    }
    r = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print("Login Status:", r.status_code)
    token = r.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    print("\n3. Creating farm profile...")
    farm_data = {
        "farm_name": "My SQLite Farm",
        "location": "Pune",
        "crop": "Cotton",
        "growth_stage": "Vegetative",
        "water_source": "borewell",
        "pump_type": "Submersible",
        "pump_capacity": 5.0,
        "solar_pump": "no"
    }
    r = requests.post(f"{BASE_URL}/farm/profile", json=farm_data, headers=headers)
    print("Create Profile Status:", r.status_code)
    
    print("\n4. Retrieving farm profile (Simulate dashboard reload)...")
    r = requests.get(f"{BASE_URL}/farm/profile", headers=headers)
    print("Get Profile Status:", r.status_code)
    print("Crop:", r.json().get("crop"))
    
    print("\n5. Updating farm profile (Edit Crop)...")
    farm_data["crop"] = "Wheat"
    r = requests.put(f"{BASE_URL}/farm/profile", json=farm_data, headers=headers)
    print("Update Profile Status:", r.status_code)
    
    print("\n6. Retrieving updated farm profile...")
    r = requests.get(f"{BASE_URL}/farm/profile", headers=headers)
    print("Get Updated Profile Status:", r.status_code)
    print("Updated Crop:", r.json().get("crop"))

if __name__ == "__main__":
    try:
        test_persistence()
    except Exception as e:
        print("Test failed:", e)
