# Onboarding

The Onboarding module manages the initial setup of the user's farm profile after successful authentication. It is distinctly separate from account creation (Signup).

## Flow Description

When an authenticated user lacks an onboarding profile (`user.isOnboarded === false`), they are forcibly routed to `/onboarding`. If they attempt to access the dashboard, the protected route intercepts and redirects them.

The flow consists of five steps, managed sequentially using the `ProgressIndicator`:

1. **Farm Profile**: Captures `farmName`, `location`, `farmArea`, and `numberOfFields`.
2. **Crop Information**: Captures current `crop`, `growthStage`, and `sowingDate`.
3. **Water Source**: Captures `waterSource` (Borewell/Open well/Canal), `borewellDepth` (conditional), and `irrigationMethod`.
4. **Pump Specifications**: Captures `pumpType`, `pumpCapacity`, `pumpRating`, and `pumpAge`.
5. **Solar & Energy**: Captures whether a `solarPump` is installed, and if so, the `solarCapacity`, `panelCapacity`, and `battery`.

## Data Model (FarmProfile)

```typescript
export interface FarmProfile {
  farmName: string;
  location: string;
  farmArea: string;       // Numeric string representing acres
  numberOfFields: string; // Numeric string
  crop: string;
  growthStage: string;    // Enum-like string (seedling, vegetative, flowering, fruiting, harvest)
  sowingDate: string;     // ISO Date string YYYY-MM-DD
  waterSource: string;    // Enum-like string (borewell, open_well, canal)
  borewellDepth: string;  // Numeric string representing feet
  irrigationMethod: string;
  pumpType: string;
  pumpCapacity: string;   // Numeric string representing HP
  pumpRating: string;
  pumpAge: string;        // Numeric string representing years
  solarPump: string;      // 'yes' or 'no'
  solarCapacity: string;  // Numeric string representing kW
  panelCapacity: string;
  battery: string;
}
```

## Abstraction & Persistence

The `OnboardingContext` serves as the intermediary abstraction:
- **`saveProfile(data)`**: Currently mocks an API call with a delay, saves the resulting `FarmProfile` object into `localStorage` (`aquavolt_farm_profile`), and updates the `AuthContext` to mark `user.isOnboarded = true`.
- When real backend integration is implemented, this method will translate the data model into a POST request to the API, and rely on the backend token to track the onboarding state.
