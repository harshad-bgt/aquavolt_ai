# Mock Data

## Overview
Mock data will reside in `src/data/mock/`.

## Strategy
- Use deterministic data, not completely random numbers on every render.
- Create realistic scenarios (e.g., Normal conditions, Rain approaching, Borewell recovering, High/Low solar availability).
- Components consume structured mock data.
- The data layer is designed so it can be swapped with real API services in the future.
