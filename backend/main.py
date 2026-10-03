from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.routes import auth, farm, advice, monitoring

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AquaVolt API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(farm.router)
app.include_router(advice.router)
app.include_router(monitoring.router)

@app.get("/")
def root():
    return {"message": "AquaVolt AI API is running"}
