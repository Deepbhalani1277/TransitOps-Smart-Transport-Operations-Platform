from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, vehicles, drivers, trips, maintenance, fuel_expenses, reports

app = FastAPI(
    title="TransitOps API",
    description="Backend API for the Smart Transport Operations Platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers under /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(vehicles.router, prefix="/api")
app.include_router(drivers.router, prefix="/api")
app.include_router(trips.router, prefix="/api")
app.include_router(maintenance.router, prefix="/api")
app.include_router(fuel_expenses.router, prefix="/api")
app.include_router(reports.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "message": "Welcome to TransitOps API scaffold",
        "docs_url": "/docs"
    }
