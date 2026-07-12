from datetime import date
from app.database import SessionLocal
from app.models import User, UserRole, Vehicle, VehicleStatus, Driver, DriverStatus
from app.auth import get_password_hash

def seed_data():
    db = SessionLocal()
    try:
        # 1. Seed Users
        users_data = [
            {
                "name": "Fleet Manager User",
                "email": "fleet@transitops.io",
                "password": "Transit2026!",
                "role": UserRole.FLEET_MANAGER
            },
            {
                "name": "Dispatcher User",
                "email": "dispatch@transitops.io",
                "password": "Transit2026!",
                "role": UserRole.DISPATCHER
            },
            {
                "name": "Safety Officer User",
                "email": "safety@transitops.io",
                "password": "Transit2026!",
                "role": UserRole.SAFETY_OFFICER
            },
            {
                "name": "Financial Analyst User",
                "email": "finance@transitops.io",
                "password": "Transit2026!",
                "role": UserRole.FINANCIAL_ANALYST
            }
        ]

        for u in users_data:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                hashed_pw = get_password_hash(u["password"])
                user = User(
                    name=u["name"],
                    email=u["email"],
                    hashed_password=hashed_pw,
                    role=u["role"]
                )
                db.add(user)
                print(f"Seeded user: {u['email']}")
            else:
                print(f"User already exists: {u['email']}")

        # 2. Seed Vehicles
        vehicles_data = [
            {
                "reg_number": "TX-1234-OP",
                "name": "Volvo FH16",
                "type": "Heavy Duty Truck",
                "max_capacity_kg": 25000.0,
                "odometer": 12500.5,
                "acquisition_cost": 135000.0,
                "status": VehicleStatus.AVAILABLE,
                "region": "North"
            },
            {
                "reg_number": "TX-5678-OP",
                "name": "Scania R500",
                "type": "Heavy Duty Truck",
                "max_capacity_kg": 26000.0,
                "odometer": 8500.0,
                "acquisition_cost": 140000.0,
                "status": VehicleStatus.ON_TRIP,
                "region": "South"
            },
            {
                "reg_number": "TX-9012-OP",
                "name": "Isuzu NPR",
                "type": "Medium Duty Truck",
                "max_capacity_kg": 7500.0,
                "odometer": 42000.0,
                "acquisition_cost": 55000.0,
                "status": VehicleStatus.IN_SHOP,
                "region": "East"
            },
            {
                "reg_number": "TX-3456-OP",
                "name": "Ford Transit",
                "type": "Light Cargo Van",
                "max_capacity_kg": 1500.0,
                "odometer": 95000.0,
                "acquisition_cost": 32000.0,
                "status": VehicleStatus.RETIRED,
                "region": "West"
            },
            {
                "reg_number": "TX-7890-OP",
                "name": "Mercedes Sprinter",
                "type": "Light Cargo Van",
                "max_capacity_kg": 2000.0,
                "odometer": 15000.0,
                "acquisition_cost": 45000.0,
                "status": VehicleStatus.AVAILABLE,
                "region": "North"
            },
            {
                "reg_number": "TX-4321-OP",
                "name": "Kenworth T680",
                "type": "Heavy Duty Truck",
                "max_capacity_kg": 28000.0,
                "odometer": 5000.0,
                "acquisition_cost": 160000.0,
                "status": VehicleStatus.AVAILABLE,
                "region": "East"
            }
        ]

        for v in vehicles_data:
            existing = db.query(Vehicle).filter(Vehicle.reg_number == v["reg_number"]).first()
            if not existing:
                vehicle = Vehicle(**v)
                db.add(vehicle)
                print(f"Seeded vehicle: {v['reg_number']}")
            else:
                print(f"Vehicle already exists: {v['reg_number']}")

        # 3. Seed Drivers
        drivers_data = [
            {
                "name": "Alice Smith",
                "license_number": "DL-987654321",
                "license_category": "Class A CDL",
                "license_expiry": date(2028, 12, 31),
                "contact": "+1-555-0199",
                "safety_score": 98,
                "status": DriverStatus.AVAILABLE
            },
            {
                "name": "Bob Jones",
                "license_number": "DL-123456789",
                "license_category": "Class A CDL",
                "license_expiry": date(2029, 6, 30),
                "contact": "+1-555-0200",
                "safety_score": 92,
                "status": DriverStatus.ON_TRIP
            },
            {
                "name": "Charlie Brown",
                "license_number": "DL-456789012",
                "license_category": "Class B CDL",
                "license_expiry": date(2025, 3, 15),
                "contact": "+1-555-0201",
                "safety_score": 85,
                "status": DriverStatus.OFF_DUTY
            },
            {
                "name": "David Miller",
                "license_number": "DL-789012345",
                "license_category": "Class A CDL",
                "license_expiry": date(2027, 9, 20),
                "contact": "+1-555-0202",
                "safety_score": 78,
                "status": DriverStatus.SUSPENDED
            }
        ]

        for d in drivers_data:
            existing = db.query(Driver).filter(Driver.license_number == d["license_number"]).first()
            if not existing:
                driver = Driver(**d)
                db.add(driver)
                print(f"Seeded driver: {d['license_number']}")
            else:
                print(f"Driver already exists: {d['license_number']}")

        db.commit()
        print("Seeding completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
