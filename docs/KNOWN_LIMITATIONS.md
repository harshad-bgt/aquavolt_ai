# Known Limitations

- The database is currently SQLite for local development. A migration to PostgreSQL is necessary before production deployment.
- Dashboard data (weather, solar output, soil moisture) is still simulated using mock data until hardware and 3rd-party APIs are integrated.
- No real sensor, weather, or solar forecasting integration.
- The AI advice engine is currently a deterministic, rule-based system (`advice_engine.py`). There is no trained Machine Learning model driving recommendations yet.
- Localization is fully implemented only for English, Marathi, and Hindi. Other supported languages (Tamil, Telugu, Kannada, Bengali, Gujarati) exist as UI options but currently fall back to English until their translation dictionaries are populated.
- The Farm Analytics page provides historical insights derived strictly from manually logged `FarmReading` data; it does not yet produce precise, forward-looking predictive modeling or infer total aquifer health from isolated borewell runtime records.
- Prototype uses seeded simulated data via `backend/seed_demo_data.py`. There is no hardware, external weather API, or cloud IoT integration.
