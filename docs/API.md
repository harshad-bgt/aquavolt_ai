# AquaVolt API Documentation

## Overview
The AquaVolt API is built with FastAPI (Python) and serves as the backend for the React frontend, handling authentication, session persistence (via JWT), and database operations (SQLite).

## Authentication Flow
1. **Signup**: User sends `POST /api/auth/signup` with name, mobile, optional email, and password. The password is hashed using bcrypt and stored.
2. **Login**: User sends `POST /api/auth/login` (OAuth2 compatible form data/JSON) with identifier (mobile/email) and password. Returns an access token (JWT).
3. **Session Persistence**: The frontend stores the JWT in `localStorage` and attaches it to the `Authorization: Bearer <token>` header for subsequent requests.
4. **Logout**: The frontend deletes the token and calls `POST /api/auth/logout`.

## Endpoints

### Auth
- **POST `/api/auth/signup`**: Creates a new user.
- **POST `/api/auth/login`**: Authenticates user and returns JWT.
- **GET `/api/auth/me`**: Retrieves the currently authenticated user based on the JWT token.
- **POST `/api/auth/logout`**: Server-side logout acknowledgement.

### Farm Profile
- **GET `/api/farm/profile`**: Retrieves the authenticated user's farm profile. Returns 404 if not found.
- **POST `/api/farm/profile`**: Creates a new farm profile for the authenticated user.
- **PUT `/api/farm/profile`**: Updates the existing farm profile for the authenticated user.

### Advice
- **POST `/api/advice/evaluate`**: Evaluates the authenticated user's farm profile against provided current conditions. If explicit conditions are omitted, it automatically falls back to the latest `FarmReading` for the user. Returns 404 if the user has no farm profile.

### Monitoring
- **POST `/api/monitoring/`**: Creates a new manual farm reading/measurement for the authenticated user.
- **GET `/api/monitoring/latest`**: Retrieves the most recent farm reading for the user. (May include `is_demo=True` readings).
- **GET `/api/monitoring/history`**: Retrieves a list of recent readings for the user (default limit 100). Accepts an optional `days` query parameter (e.g. `?days=7`) to filter by the last N days.

### Prototype Utilities
- The database can be seeded with 30 days of simulated demo data by executing `python backend/seed_demo_data.py`. All generated records are marked with the `is_demo=True` flag to distinguish them from user-submitted manual entries.

## Security Guarantees
- The API *never* trusts a `user_id` provided in the request body for profile endpoints. It exclusively uses the `user_id` decoded from the verified JWT.
- Password hashes are never returned in the API responses.
