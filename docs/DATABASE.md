# SQLite Database Architecture

## Overview
AquaVolt AI uses a lightweight SQLite database for local development to persist user accounts and their associated farm profiles.

## Database Location
The database is located at: `data/aquavolt.db`

## Schema

### Users Table (`users`)
- `id`: Integer (Primary Key)
- `name`: String
- `mobile`: String (Unique)
- `email`: String (Unique, Optional)
- `password_hash`: String (bcrypt hashed)
- `created_at`: DateTime
- `updated_at`: DateTime

### Farm Profiles Table (`farm_profiles`)
- `id`: Integer (Primary Key)
- `user_id`: Integer (Foreign Key to `users.id`, Unique)
- `farm_name`: String
- `location`: String
- `farm_area`: Float (optional)
- `number_of_fields`: Integer (optional)
- `crop`: String
- `growth_stage`: String
- `sowing_date`: String (optional)
- `water_source`: String
- `borewell_depth`: Float (optional)
- `irrigation_method`: String (optional)
- `pump_type`: String
- `pump_capacity`: Float
- `pump_rating`: String (optional)
- `pump_age`: Float (optional)
- `solar_pump`: String ('yes' or 'no')
- `solar_capacity`: Float (optional)
- `panel_capacity`: String (optional)
- `battery`: String (optional)
- `created_at`: DateTime
- `updated_at`: DateTime

### Farm Readings Table (`farm_readings`)
- `id`: Integer (Primary Key)
- `user_id`: Integer (Foreign Key to `users.id`)
- `soil_moisture_level`: String (optional)
- `soil_temperature`: Float (optional)
- `borewell_water_level`: String (optional)
- `pump_status`: String (optional)
- `pump_runtime_hours`: Float (optional)
- `solar_availability`: String (optional)
- `weather_forecast`: String (optional)
- `rainfall_mm`: Float (optional)
- `is_demo`: Boolean
- `created_at`: DateTime

## Security
- Passwords are never stored in plaintext. They are hashed using bcrypt via the `passlib` library.
- The `user_id` foreign key ensures that a user can only have one farm profile (One-to-One relationship) and prevents cross-user access at the API level (the API derives `user_id` strictly from the authenticated JWT token).

## Future Migration
The database logic is abstracted using SQLAlchemy ORM. Migrating to PostgreSQL in the future will only require changing the `SQLALCHEMY_DATABASE_URL` string in `backend/database.py` and running the appropriate database migrations (e.g., using Alembic).

## Demo Data Seeding
To populate the database with realistic, correlated simulation data for a demonstration, run the seed script:
```bash
source venv/bin/activate
python backend/seed_demo_data.py
```
This script safely wipes the existing `demo@aquavolt.com` data (if any) and recreates it with a populated `FarmProfile` and 30 days of simulated history covering normal, dry, and rain scenarios. All generated readings are flagged with `is_demo=True`. You can log into the prototype using `demo@aquavolt.com` or `9999999999` and password `password`.
