from datetime import date, datetime
from app.database import SessionLocal
from app.models import (
    Vehicle, VehicleStatus, Driver, DriverStatus, Trip, TripStatus,
    MaintenanceLog, MaintenanceStatus, FuelLog, Expense, ExpenseType
)

def seed_mock_data():
    db = SessionLocal()
    try:
        print("Clearing existing operations data...")
        # Clear existing tables (excluding users)
        db.query(Expense).delete()
        db.query(FuelLog).delete()
        db.query(MaintenanceLog).delete()
        db.query(Trip).delete()
        db.query(Driver).delete()
        db.query(Vehicle).delete()
        db.commit()

        print("Seeding vehicles...")
        vehicles = [
            Vehicle(
                id=1,
                reg_number='TX-1234-OP',
                name='Volvo FH16',
                type='Heavy Duty Truck',
                max_capacity_kg=25000,
                odometer=12500.5,
                acquisition_cost=135000,
                status=VehicleStatus.AVAILABLE,
                region='North',
            ),
            Vehicle(
                id=2,
                reg_number='TX-5678-AB',
                name='Scania R500',
                type='Heavy Duty Truck',
                max_capacity_kg=24000,
                odometer=8400.2,
                acquisition_cost=128000,
                status=VehicleStatus.ON_TRIP,
                region='South',
            ),
            Vehicle(
                id=3,
                reg_number='TX-9012-CD',
                name='Ford Transit',
                type='Van',
                max_capacity_kg=3500,
                odometer=45000.8,
                acquisition_cost=45000,
                status=VehicleStatus.IN_SHOP,
                region='East',
            )
        ]
        for v in vehicles:
            db.add(v)
        db.commit()

        print("Seeding drivers...")
        drivers = [
            Driver(
                id=1,
                name='Alice Smith',
                license_number='DL-987654321',
                license_category='Class A CDL',
                license_expiry=date(2028, 12, 31),
                contact='+1-555-0199',
                safety_score=98,
                status=DriverStatus.AVAILABLE,
            ),
            Driver(
                id=2,
                name='Bob Jones',
                license_number='DL-123456789',
                license_category='Class A CDL',
                license_expiry=date(2026, 6, 15),
                contact='+1-555-0204',
                safety_score=92,
                status=DriverStatus.ON_TRIP,
            ),
            Driver(
                id=3,
                name='Charlie Brown',
                license_number='DL-456789123',
                license_category='Class B CDL',
                license_expiry=date(2027, 9, 20),
                contact='+1-555-0210',
                safety_score=72,
                status=DriverStatus.OFF_DUTY,
            )
        ]
        for d in drivers:
            db.add(d)
        db.commit()

        print("Seeding trips...")
        trips = [
            Trip(
                id=1,
                source='New York, NY',
                destination='Boston, MA',
                vehicle_id=2,
                driver_id=2,
                cargo_weight_kg=15000,
                planned_distance_km=350.0,
                actual_distance_km=None,
                fuel_consumed_l=None,
                status=TripStatus.DISPATCHED,
                created_at=datetime(2026, 7, 12, 10, 0, 0),
                dispatched_at=datetime(2026, 7, 12, 11, 45, 0),
                completed_at=None,
            ),
            Trip(
                id=2,
                source='Chicago, IL',
                destination='Detroit, MI',
                vehicle_id=1,
                driver_id=1,
                cargo_weight_kg=10000,
                planned_distance_km=450.0,
                actual_distance_km=445.0,
                fuel_consumed_l=42.0,
                status=TripStatus.COMPLETED,
                created_at=datetime(2026, 7, 10, 8, 0, 0),
                dispatched_at=datetime(2026, 7, 10, 9, 0, 0),
                completed_at=datetime(2026, 7, 10, 16, 30, 0),
            )
        ]
        for t in trips:
            db.add(t)
        db.commit()

        print("Seeding maintenance logs...")
        maint_logs = [
            MaintenanceLog(
                id=1,
                vehicle_id=3,
                service_type='Brake Replacement',
                cost=450.0,
                date=date(2026, 7, 12),
                status=MaintenanceStatus.ACTIVE,
            ),
            MaintenanceLog(
                id=2,
                vehicle_id=1,
                service_type='Engine Oil Change',
                cost=150.0,
                date=date(2026, 7, 10),
                status=MaintenanceStatus.CLOSED,
            )
        ]
        for m in maint_logs:
            db.add(m)
        db.commit()

        print("Seeding fuel logs...")
        fuel_logs = [
            FuelLog(
                id=1,
                vehicle_id=1,
                trip_id=2,
                liters=45.5,
                cost=90.0,
                date=date(2026, 7, 10),
            )
        ]
        for f in fuel_logs:
            db.add(f)
        db.commit()

        print("Seeding expenses...")
        expenses = [
            Expense(
                id=1,
                vehicle_id=1,
                trip_id=2,
                type=ExpenseType.TOLL,
                amount=15.0,
                date=date(2026, 7, 10),
            )
        ]
        for e in expenses:
            db.add(e)
        db.commit()

        print("Dummy data seeding complete!")
    except Exception as err:
        db.rollback()
        print(f"Error seeding dummy data: {err}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_mock_data()
