from datetime import date, datetime
from app.database import SessionLocal
from app.models import (
    Vehicle, VehicleStatus, Driver, DriverStatus, Trip, TripStatus,
    MaintenanceLog, MaintenanceStatus, FuelLog, Expense, ExpenseType
)

def seed_rich_mock_data():
    db = SessionLocal()
    try:
        print("Clearing existing operations data...")
        db.query(Expense).delete()
        db.query(FuelLog).delete()
        db.query(MaintenanceLog).delete()
        db.query(Trip).delete()
        db.query(Driver).delete()
        db.query(Vehicle).delete()
        db.commit()

        print("Seeding 12 vehicles...")
        vehicles = [
            Vehicle(
                id=1,
                reg_number='TX-1001-OP',
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
                reg_number='TX-1002-OP',
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
                reg_number='TX-1003-OP',
                name='Ford Transit',
                type='Van',
                max_capacity_kg=3500,
                odometer=45000.8,
                acquisition_cost=45000,
                status=VehicleStatus.IN_SHOP,
                region='East',
            ),
            Vehicle(
                id=4,
                reg_number='TX-1004-OP',
                name='Mercedes Benz Actros',
                type='Heavy Duty Truck',
                max_capacity_kg=26000,
                odometer=15000.0,
                acquisition_cost=145000,
                status=VehicleStatus.AVAILABLE,
                region='West',
            ),
            Vehicle(
                id=5,
                reg_number='TX-1005-OP',
                name='Chevrolet Express',
                type='Van',
                max_capacity_kg=3000,
                odometer=55000.4,
                acquisition_cost=38000,
                status=VehicleStatus.AVAILABLE,
                region='North',
            ),
            Vehicle(
                id=6,
                reg_number='TX-1006-OP',
                name='Peterbilt 579',
                type='Heavy Duty Truck',
                max_capacity_kg=28000,
                odometer=22000.7,
                acquisition_cost=155000,
                status=VehicleStatus.AVAILABLE,
                region='South',
            ),
            Vehicle(
                id=7,
                reg_number='TX-1007-OP',
                name='Isuzu NPR',
                type='Medium Duty Truck',
                max_capacity_kg=7500,
                odometer=32000.1,
                acquisition_cost=60000,
                status=VehicleStatus.IN_SHOP,
                region='East',
            ),
            Vehicle(
                id=8,
                reg_number='TX-1008-OP',
                name='Ram ProMaster',
                type='Van',
                max_capacity_kg=3200,
                odometer=12000.5,
                acquisition_cost=40000,
                status=VehicleStatus.AVAILABLE,
                region='West',
            ),
            Vehicle(
                id=9,
                reg_number='TX-1009-OP',
                name='Kenworth T680',
                type='Heavy Duty Truck',
                max_capacity_kg=27000,
                odometer=9800.0,
                acquisition_cost=150000,
                status=VehicleStatus.ON_TRIP,
                region='North',
            ),
            Vehicle(
                id=10,
                reg_number='TX-1010-OP',
                name='Freightliner Cascadia',
                type='Heavy Duty Truck',
                max_capacity_kg=26500,
                odometer=31000.2,
                acquisition_cost=138000,
                status=VehicleStatus.RETIRED,
                region='South',
            ),
            Vehicle(
                id=11,
                reg_number='TX-1011-OP',
                name='Toyota HiAce',
                type='Van',
                max_capacity_kg=2500,
                odometer=62000.0,
                acquisition_cost=30000,
                status=VehicleStatus.AVAILABLE,
                region='East',
            ),
            Vehicle(
                id=12,
                reg_number='TX-1012-OP',
                name='Hino 268',
                type='Medium Duty Truck',
                max_capacity_kg=9000,
                odometer=18000.0,
                acquisition_cost=75000,
                status=VehicleStatus.AVAILABLE,
                region='West',
            )
        ]
        for v in vehicles:
            db.add(v)
        db.commit()

        print("Seeding 11 drivers...")
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
            ),
            Driver(
                id=4,
                name='David Miller',
                license_number='DL-789012345',
                license_category='Class A CDL',
                license_expiry=date(2027, 4, 10),
                contact='+1-555-0202',
                safety_score=78,
                status=DriverStatus.SUSPENDED,
            ),
            Driver(
                id=5,
                name='Emma Wilson',
                license_number='DL-223344556',
                license_category='Class A CDL',
                license_expiry=date(2028, 5, 18),
                contact='+1-555-0205',
                safety_score=95,
                status=DriverStatus.AVAILABLE,
            ),
            Driver(
                id=6,
                name='Frank Thomas',
                license_number='DL-667788990',
                license_category='Class B CDL',
                license_expiry=date(2029, 1, 22),
                contact='+1-555-0206',
                safety_score=88,
                status=DriverStatus.AVAILABLE,
            ),
            Driver(
                id=7,
                name='Grace Taylor',
                license_number='DL-112233445',
                license_category='Class A CDL',
                license_expiry=date(2028, 10, 5),
                contact='+1-555-0207',
                safety_score=100,
                status=DriverStatus.ON_TRIP,
            ),
            Driver(
                id=8,
                name='Henry White',
                license_number='DL-556677889',
                license_category='Class A CDL',
                license_expiry=date(2027, 11, 12),
                contact='+1-555-0208',
                safety_score=90,
                status=DriverStatus.AVAILABLE,
            ),
            Driver(
                id=9,
                name='Ivy Martin',
                license_number='DL-990011223',
                license_category='Class B CDL',
                license_expiry=date(2028, 7, 30),
                contact='+1-555-0209',
                safety_score=85,
                status=DriverStatus.OFF_DUTY,
            ),
            Driver(
                id=10,
                name='Jack Thompson',
                license_number='DL-445566778',
                license_category='Class A CDL',
                license_expiry=date(2029, 8, 14),
                contact='+1-555-0211',
                safety_score=94,
                status=DriverStatus.AVAILABLE,
            ),
            Driver(
                id=11,
                name='Karen Garcia',
                license_number='DL-889900112',
                license_category='Class A CDL',
                license_expiry=date(2027, 2, 28),
                contact='+1-555-0212',
                safety_score=91,
                status=DriverStatus.AVAILABLE,
            )
        ]
        for d in drivers:
            db.add(d)
        db.commit()

        print("Seeding 10 trips...")
        trips = [
            Trip(
                id=1,
                source='Seattle, WA',
                destination='Portland, OR',
                vehicle_id=4,
                driver_id=5,
                cargo_weight_kg=12000,
                planned_distance_km=280.0,
                status=TripStatus.DRAFT,
                created_at=datetime(2026, 7, 12, 10, 0, 0),
            ),
            Trip(
                id=2,
                source='New York, NY',
                destination='Boston, MA',
                vehicle_id=2,
                driver_id=2,
                cargo_weight_kg=15000,
                planned_distance_km=350.0,
                status=TripStatus.DISPATCHED,
                created_at=datetime(2026, 7, 12, 8, 0, 0),
                dispatched_at=datetime(2026, 7, 12, 11, 45, 0),
            ),
            Trip(
                id=3,
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
            ),
            Trip(
                id=4,
                source='Los Angeles, CA',
                destination='San Francisco, CA',
                vehicle_id=5,
                driver_id=6,
                cargo_weight_kg=2000,
                planned_distance_km=610.0,
                actual_distance_km=615.5,
                fuel_consumed_l=55.0,
                status=TripStatus.COMPLETED,
                created_at=datetime(2026, 7, 8, 7, 0, 0),
                dispatched_at=datetime(2026, 7, 8, 8, 0, 0),
                completed_at=datetime(2026, 7, 8, 18, 0, 0),
            ),
            Trip(
                id=5,
                source='Dallas, TX',
                destination='Houston, TX',
                vehicle_id=8,
                driver_id=8,
                cargo_weight_kg=2500,
                planned_distance_km=380.0,
                actual_distance_km=382.0,
                fuel_consumed_l=32.0,
                status=TripStatus.COMPLETED,
                created_at=datetime(2026, 7, 9, 9, 0, 0),
                dispatched_at=datetime(2026, 7, 9, 10, 0, 0),
                completed_at=datetime(2026, 7, 9, 14, 15, 0),
            ),
            Trip(
                id=6,
                source='Miami, FL',
                destination='Orlando, FL',
                vehicle_id=6,
                driver_id=10,
                cargo_weight_kg=18000,
                planned_distance_km=370.0,
                status=TripStatus.DRAFT,
                created_at=datetime(2026, 7, 11, 15, 0, 0),
            ),
            Trip(
                id=7,
                source='Atlanta, GA',
                destination='Charlotte, NC',
                vehicle_id=9,
                driver_id=7,
                cargo_weight_kg=22000,
                planned_distance_km=390.0,
                status=TripStatus.DISPATCHED,
                created_at=datetime(2026, 7, 12, 6, 0, 0),
                dispatched_at=datetime(2026, 7, 12, 9, 30, 0),
            ),
            Trip(
                id=8,
                source='Denver, CO',
                destination='Salt Lake City, UT',
                vehicle_id=11,
                driver_id=11,
                cargo_weight_kg=2000,
                planned_distance_km=850.0,
                status=TripStatus.CANCELLED,
                created_at=datetime(2026, 7, 5, 10, 0, 0),
            ),
            Trip(
                id=9,
                source='Boston, MA',
                destination='Philadelphia, PA',
                vehicle_id=12,
                driver_id=5,
                cargo_weight_kg=7000,
                planned_distance_km=490.0,
                actual_distance_km=495.0,
                fuel_consumed_l=45.0,
                status=TripStatus.COMPLETED,
                created_at=datetime(2026, 7, 4, 8, 0, 0),
                dispatched_at=datetime(2026, 7, 4, 9, 0, 0),
                completed_at=datetime(2026, 7, 4, 17, 45, 0),
            ),
            Trip(
                id=10,
                source='Phoenix, AZ',
                destination='Las Vegas, NV',
                vehicle_id=4,
                driver_id=10,
                cargo_weight_kg=14000,
                planned_distance_km=480.0,
                actual_distance_km=478.2,
                fuel_consumed_l=44.0,
                status=TripStatus.COMPLETED,
                created_at=datetime(2026, 7, 2, 6, 0, 0),
                dispatched_at=datetime(2026, 7, 2, 7, 0, 0),
                completed_at=datetime(2026, 7, 2, 12, 0, 0),
            )
        ]
        for t in trips:
            db.add(t)
        db.commit()

        print("Seeding 10 maintenance logs...")
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
            ),
            MaintenanceLog(
                id=3,
                vehicle_id=7,
                service_type='Transmission Repair',
                cost=1200.0,
                date=date(2026, 7, 11),
                status=MaintenanceStatus.ACTIVE,
            ),
            MaintenanceLog(
                id=4,
                vehicle_id=2,
                service_type='Tire Rotation',
                cost=120.0,
                date=date(2026, 7, 5),
                status=MaintenanceStatus.CLOSED,
            ),
            MaintenanceLog(
                id=5,
                vehicle_id=5,
                service_type='AC Servicing',
                cost=220.0,
                date=date(2026, 7, 6),
                status=MaintenanceStatus.CLOSED,
            ),
            MaintenanceLog(
                id=6,
                vehicle_id=6,
                service_type='Windshield Replacement',
                cost=350.0,
                date=date(2026, 7, 1),
                status=MaintenanceStatus.CLOSED,
            ),
            MaintenanceLog(
                id=7,
                vehicle_id=9,
                service_type='Battery Replacement',
                cost=180.0,
                date=date(2026, 6, 28),
                status=MaintenanceStatus.CLOSED,
            ),
            MaintenanceLog(
                id=8,
                vehicle_id=8,
                service_type='Belt Replacement',
                cost=95.0,
                date=date(2026, 6, 25),
                status=MaintenanceStatus.CLOSED,
            ),
            MaintenanceLog(
                id=9,
                vehicle_id=4,
                service_type='Engine Diagnostics',
                cost=250.0,
                date=date(2026, 6, 20),
                status=MaintenanceStatus.CLOSED,
            ),
            MaintenanceLog(
                id=10,
                vehicle_id=11,
                service_type='Oil Filter Swap',
                cost=80.0,
                date=date(2026, 6, 15),
                status=MaintenanceStatus.CLOSED,
            )
        ]
        for m in maint_logs:
            db.add(m)
        db.commit()

        print("Seeding 10 fuel logs...")
        fuel_logs = [
            FuelLog(
                id=1,
                vehicle_id=1,
                trip_id=3,
                liters=45.5,
                cost=90.0,
                date=date(2026, 7, 10),
            ),
            FuelLog(
                id=2,
                vehicle_id=5,
                trip_id=4,
                liters=55.0,
                cost=110.0,
                date=date(2026, 7, 8),
            ),
            FuelLog(
                id=3,
                vehicle_id=8,
                trip_id=5,
                liters=32.0,
                cost=64.0,
                date=date(2026, 7, 9),
            ),
            FuelLog(
                id=4,
                vehicle_id=12,
                trip_id=9,
                liters=45.0,
                cost=90.0,
                date=date(2026, 7, 5),
            ),
            FuelLog(
                id=5,
                vehicle_id=4,
                trip_id=10,
                liters=44.0,
                cost=88.0,
                date=date(2026, 7, 2),
            ),
            FuelLog(
                id=6,
                vehicle_id=2,
                liters=65.0,
                cost=130.0,
                date=date(2026, 7, 11),
            ),
            FuelLog(
                id=7,
                vehicle_id=6,
                liters=50.0,
                cost=100.0,
                date=date(2026, 7, 4),
            ),
            FuelLog(
                id=8,
                vehicle_id=9,
                liters=58.0,
                cost=116.0,
                date=date(2026, 7, 3),
            ),
            FuelLog(
                id=9,
                vehicle_id=11,
                liters=35.0,
                cost=70.0,
                date=date(2026, 6, 27),
            ),
            FuelLog(
                id=10,
                vehicle_id=1,
                liters=42.0,
                cost=84.0,
                date=date(2026, 6, 22),
            )
        ]
        for f in fuel_logs:
            db.add(f)
        db.commit()

        print("Seeding 10 expenses...")
        expenses = [
            Expense(
                id=1,
                vehicle_id=1,
                trip_id=3,
                type=ExpenseType.TOLL,
                amount=15.0,
                date=date(2026, 7, 10),
            ),
            Expense(
                id=2,
                vehicle_id=5,
                trip_id=4,
                type=ExpenseType.TOLL,
                amount=25.0,
                date=date(2026, 7, 8),
            ),
            Expense(
                id=3,
                vehicle_id=8,
                trip_id=5,
                type=ExpenseType.MISC,
                amount=50.0,
                date=date(2026, 7, 9),
            ),
            Expense(
                id=4,
                vehicle_id=12,
                trip_id=9,
                type=ExpenseType.TOLL,
                amount=18.0,
                date=date(2026, 7, 5),
            ),
            Expense(
                id=5,
                vehicle_id=4,
                trip_id=10,
                type=ExpenseType.TOLL,
                amount=20.0,
                date=date(2026, 7, 2),
            ),
            Expense(
                id=6,
                vehicle_id=2,
                type=ExpenseType.TOLL,
                amount=12.0,
                date=date(2026, 7, 11),
            ),
            Expense(
                id=7,
                vehicle_id=6,
                type=ExpenseType.MISC,
                amount=45.0,
                date=date(2026, 7, 6),
            ),
            Expense(
                id=8,
                vehicle_id=9,
                type=ExpenseType.TOLL,
                amount=16.0,
                date=date(2026, 7, 1),
            ),
            Expense(
                id=9,
                vehicle_id=11,
                type=ExpenseType.MISC,
                amount=30.0,
                date=date(2026, 6, 29),
            ),
            Expense(
                id=10,
                vehicle_id=3,
                type=ExpenseType.TOLL,
                amount=10.0,
                date=date(2026, 6, 24),
            )
        ]
        for e in expenses:
            db.add(e)
        db.commit()

        print("Rich dummy data seeding complete!")
    except Exception as err:
        db.rollback()
        print(f"Error seeding rich dummy data: {err}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_rich_mock_data()
