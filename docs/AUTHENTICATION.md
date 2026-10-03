# Authentication Architecture

## Authentication State
- Centralized `AuthContext` managing frontend state:
  - `user`: Currently logged in user (retrieved via `/api/auth/me`)
  - `isAuthenticated`: Boolean
  - `isLoading`: Boolean
- Exposed methods: `login()`, `signup()`, `logout()`, `resetPassword()`

## Login & Signup
- **Login**: Email/Mobile + Password with validation. Hits FastAPI backend, receives JWT.
- **Signup**: Account creation. Hits FastAPI backend, auto-logs in.
- **Forgot Password**: Form to request a reset link (currently mocked).
- **Onboarding**: Five-step wizard (Farm, Crop, Water, Pump, Solar) triggered after login/signup if the user doesn't have a SQLite farm profile.

## Protected Routes & Session Persistence
- Public routes: `/login`, `/signup`, `/forgot-password`
- Protected routes: `/dashboard`, `/onboarding`, etc.
- **Persistent Routing**:
  - The `AuthContext` stores the JWT in `localStorage`.
  - On app load, `AuthContext` verifies the token via `/api/auth/me`.
  - The `OnboardingContext` attempts to fetch the user's `FarmProfile` from SQLite (`/api/farm/profile`).
  - If no profile is found, the user is locked into `/onboarding`.
  - If a profile exists, the user is directed to `/dashboard`.

## Security
- Passwords are securely hashed with bcrypt in SQLite.
- JWT tokens authorize access to farm profiles, strictly isolating User A's data from User B.
