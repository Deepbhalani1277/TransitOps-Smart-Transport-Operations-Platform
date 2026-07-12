from datetime import date, datetime, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import get_db
from app.models import Base, User, Vehicle, Driver, Trip, MaintenanceLog, FuelLog, Expense
from app.models import UserRole, VehicleStatus, DriverStatus, TripStatus, MaintenanceStatus, ExpenseType

# Setup a clean file-based SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override database dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create test client
client = TestClient(app)

def setup_db():
    Base.metadata.create_all(bind=engine)
    # Seed a Fleet Manager user if auth is active, but we bypass for stubs
    db = TestingSessionLocal()
    # Any necessary seeding can go here
    db.close()

def teardown_db():
    Base.metadata.drop_all(bind=engine)
    import os
    if os.path.exists("test_temp.db"):
        try:
            os.remove("test_temp.db")
        except Exception:
            pass

def test_workflow():
    setup_db()
    try:
        print("\n--- STARTING WORKFLOW TESTS ---")

        # 1. Create a vehicle
        # We call the FastAPI endpoint directly if we have vehicles router implemented.
        # Since vehicles router might be a stub on main, let's seed vehicle and driver directly in DB,
        # and test our trips/maintenance/fuel/expenses routers via HTTP client.
        db = TestingSessionLocal()
        
        vehicle = Vehicle(
            reg_number="TX-1234-OP",
            name="Volvo FH16",
            type="Heavy Duty Truck",
            max_capacity_kg=25000.0,
            odometer=1000.0,
            acquisition_cost=150000.0,
            status=VehicleStatus.AVAILABLE,
            region="North"
        )
        db.add(vehicle)
        
        driver = Driver(
            name="Alice Smith",
            license_number="DL-987654321",
            license_category="Class A CDL",
            license_expiry=date.today() + timedelta(days=365),
            contact="+1-555-0199",
            safety_score=98,
            status=DriverStatus.AVAILABLE
        )
        db.add(driver)
        db.commit()
        
        vehicle_id = vehicle.id
        driver_id = driver.id
        print(f"Seeded Vehicle ID: {vehicle_id}, Driver ID: {driver_id}")

        # 2. Create a trip draft
        response = client.post("/api/trips", json={
            "source": "New York, NY",
            "destination": "Boston, MA",
            "vehicle_id": vehicle_id,
            "driver_id": driver_id,
            "cargo_weight_kg": 15000.0,
            "planned_distance_km": 350.0
        })
        assert response.status_code == 201
        trip = response.json()
        trip_id = trip["id"]
        assert trip["status"] == "Draft"
        print(f"Created Draft Trip: {trip_id}")

        # 3. Dispatch the trip
        response = client.post(f"/api/trips/{trip_id}/dispatch")
        assert response.status_code == 200
        trip = response.json()
        assert trip["status"] == "Dispatched"
        assert trip["dispatched_at"] is not None
        print("Dispatched Trip successfully")

        # Verify statuses updated
        db.expire_all()
        vehicle_db = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
        driver_db = db.query(Driver).filter(Driver.id == driver_id).first()
        assert vehicle_db.status == VehicleStatus.ON_TRIP
        assert driver_db.status == DriverStatus.ON_TRIP
        print("Vehicle and Driver status set to 'On Trip'")

        # 4. Complete the trip
        response = client.post(f"/api/trips/{trip_id}/complete", json={
            "actual_distance_km": 360.0,
            "fuel_consumed_l": 30.0
        })
        assert response.status_code == 200
        trip = response.json()
        assert trip["status"] == "Completed"
        assert trip["completed_at"] is not None
        assert trip["actual_distance_km"] == 360.0
        assert trip["fuel_consumed_l"] == 30.0
        print("Completed Trip successfully")

        # Verify side effects
        db.expire_all()
        assert vehicle_db.status == VehicleStatus.AVAILABLE
        assert vehicle_db.odometer == 1360.0  # 1000 + 360
        assert driver_db.status == DriverStatus.AVAILABLE
        # Safety score: 98 + 1 = 99 (fuel efficiency: 30L/360km = 8.3L/100km, which is <= 10, so no penalty)
        assert driver_db.safety_score == 99
        print(f"Odometer updated: {vehicle_db.odometer}, Safety score updated: {driver_db.safety_score}")

        # Verify auto-created FuelLog
        fuel_logs = db.query(FuelLog).filter(FuelLog.trip_id == trip_id).all()
        assert len(fuel_logs) == 1
        assert fuel_logs[0].liters == 30.0
        assert fuel_logs[0].cost == 30.0 * 1.50
        print("Verified auto-created FuelLog")

        # 5. Create a maintenance log (sets vehicle to In Shop)
        response = client.post("/api/maintenance", json={
            "vehicle_id": vehicle_id,
            "service_type": "Tire Replacement",
            "cost": 600.0,
            "date": str(date.today()),
            "status": "Active"
        })
        assert response.status_code == 201
        log = response.json()
        log_id = log["id"]
        assert log["status"] == "Active"
        
        db.expire_all()
        assert vehicle_db.status == VehicleStatus.IN_SHOP
        print("Logged Maintenance, vehicle set to 'In Shop'")

        # Close maintenance
        response = client.post(f"/api/maintenance/{log_id}/close")
        assert response.status_code == 200
        assert response.json()["status"] == "Closed"
        
        db.expire_all()
        assert vehicle_db.status == VehicleStatus.AVAILABLE
        print("Closed Maintenance, vehicle restored to 'Available'")

        # ─── FAILURE PATH TESTS ───
        print("\n--- RUNNING FAILURE PATH TESTS ---")

        # Failure 1: Cargo capacity violation during creation
        response = client.post("/api/trips", json={
            "source": "A", "destination": "B",
            "vehicle_id": vehicle_id, "driver_id": driver_id,
            "cargo_weight_kg": 30000.0, # capacity is 25000
            "planned_distance_km": 100.0
        })
        assert response.status_code == 400
        print("Failure 1: Overweight cargo blocked during creation (Success)")

        # Failure 2: Suspended driver dispatch check
        driver_db.status = DriverStatus.SUSPENDED
        db.commit()
        
        response = client.post("/api/trips", json={
            "source": "A", "destination": "B",
            "vehicle_id": vehicle_id, "driver_id": driver_id,
            "cargo_weight_kg": 1000.0,
            "planned_distance_km": 100.0
        })
        assert response.status_code == 201
        fail_trip_id = response.json()["id"]
        
        response = client.post(f"/api/trips/{fail_trip_id}/dispatch")
        assert response.status_code == 403
        print("Failure 2: Suspended driver dispatch blocked (Success)")

        # Restore driver status, test expired license
        driver_db.status = DriverStatus.AVAILABLE
        driver_db.license_expiry = date.today() - timedelta(days=1)
        db.commit()
        
        response = client.post(f"/api/trips/{fail_trip_id}/dispatch")
        assert response.status_code == 400
        print("Failure 3: Expired driver license dispatch blocked (Success)")

        # Restore driver license, test double dispatch
        driver_db.license_expiry = date.today() + timedelta(days=10)
        db.commit()
        
        # Create a second trip
        response = client.post("/api/trips", json={
            "source": "X", "destination": "Y",
            "vehicle_id": vehicle_id, "driver_id": driver_id,
            "cargo_weight_kg": 1000.0,
            "planned_distance_km": 100.0
        })
        trip2_id = response.json()["id"]
        
        # Dispatch trip 1 (fail_trip_id) - should succeed
        response = client.post(f"/api/trips/{fail_trip_id}/dispatch")
        assert response.status_code == 200
        
        # Dispatch trip 2 - should fail (vehicle/driver On Trip)
        response = client.post(f"/api/trips/{trip2_id}/dispatch")
        assert response.status_code == 409
        print("Failure 4: Double dispatch blocked (Success)")

        print("\n--- ALL TESTS COMPLETED SUCCESSFULLY ---")

    finally:
        teardown_db()

if __name__ == "__main__":
    test_workflow()
