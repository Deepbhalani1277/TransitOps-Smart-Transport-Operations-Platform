from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models import (
    UserRole, VehicleStatus, DriverStatus,
    TripStatus, MaintenanceStatus, ExpenseType,
)


# ── Auth ─────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Vehicles ─────────────────────────────────────────────────────────────

class VehicleCreate(BaseModel):
    reg_number: str
    name: str
    type: str
    max_capacity_kg: float
    odometer: float = 0.0
    acquisition_cost: float
    status: VehicleStatus = VehicleStatus.AVAILABLE
    region: Optional[str] = None

class VehicleUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    max_capacity_kg: Optional[float] = None
    odometer: Optional[float] = None
    status: Optional[VehicleStatus] = None
    region: Optional[str] = None

class VehicleOut(BaseModel):
    id: int
    reg_number: str
    name: str
    type: str
    max_capacity_kg: float
    odometer: float
    acquisition_cost: float
    status: VehicleStatus
    region: Optional[str]
    class Config:
        from_attributes = True


# ── Drivers ──────────────────────────────────────────────────────────────

class DriverCreate(BaseModel):
    name: str
    license_number: str
    license_category: str
    license_expiry: date
    contact: str
    safety_score: int = 100
    status: DriverStatus = DriverStatus.AVAILABLE

class DriverUpdate(BaseModel):
    name: Optional[str] = None
    license_category: Optional[str] = None
    license_expiry: Optional[date] = None
    contact: Optional[str] = None
    safety_score: Optional[int] = None
    status: Optional[DriverStatus] = None

class DriverOut(BaseModel):
    id: int
    name: str
    license_number: str
    license_category: str
    license_expiry: date
    contact: str
    safety_score: int
    status: DriverStatus
    class Config:
        from_attributes = True


# ── Trips ────────────────────────────────────────────────────────────────

class TripCreate(BaseModel):
    source: str
    destination: str
    vehicle_id: Optional[int] = None
    driver_id: Optional[int] = None
    cargo_weight_kg: float
    planned_distance_km: float

class TripUpdate(BaseModel):
    vehicle_id: Optional[int] = None
    driver_id: Optional[int] = None
    cargo_weight_kg: Optional[float] = None
    actual_distance_km: Optional[float] = None
    fuel_consumed_l: Optional[float] = None
    status: Optional[TripStatus] = None

class TripOut(BaseModel):
    id: int
    source: str
    destination: str
    vehicle_id: Optional[int]
    driver_id: Optional[int]
    cargo_weight_kg: float
    planned_distance_km: float
    actual_distance_km: Optional[float]
    fuel_consumed_l: Optional[float]
    status: TripStatus
    created_at: datetime
    dispatched_at: Optional[datetime]
    completed_at: Optional[datetime]
    class Config:
        from_attributes = True


# ── Maintenance ──────────────────────────────────────────────────────────

class MaintenanceLogCreate(BaseModel):
    vehicle_id: int
    service_type: str
    cost: float
    date: date
    status: MaintenanceStatus = MaintenanceStatus.ACTIVE

class MaintenanceLogUpdate(BaseModel):
    service_type: Optional[str] = None
    cost: Optional[float] = None
    status: Optional[MaintenanceStatus] = None

class MaintenanceLogOut(BaseModel):
    id: int
    vehicle_id: int
    service_type: str
    cost: float
    date: date
    status: MaintenanceStatus
    class Config:
        from_attributes = True


# ── Fuel Logs ────────────────────────────────────────────────────────────

class FuelLogCreate(BaseModel):
    vehicle_id: int
    trip_id: Optional[int] = None
    liters: float
    cost: float
    date: date

class FuelLogOut(BaseModel):
    id: int
    vehicle_id: int
    trip_id: Optional[int]
    liters: float
    cost: float
    date: date
    class Config:
        from_attributes = True


# ── Expenses ─────────────────────────────────────────────────────────────

class ExpenseCreate(BaseModel):
    vehicle_id: int
    trip_id: Optional[int] = None
    type: ExpenseType
    amount: float
    date: date

class ExpenseOut(BaseModel):
    id: int
    vehicle_id: int
    trip_id: Optional[int]
    type: ExpenseType
    amount: float
    date: date
    class Config:
        from_attributes = True


# ── Trip Completion ──────────────────────────────────────────────────
class TripCompleteRequest(BaseModel):
    actual_distance_km: float
    fuel_consumed_l: float


# ── Reports ──────────────────────────────────────────────────────────
class FleetSummary(BaseModel):
    total_vehicles: int
    active_trips: int
    vehicles_in_shop: int
    total_odometer_km: float

class CostBreakdown(BaseModel):
    total_fuel_cost: float
    total_maintenance_cost: float
    total_expenses_cost: float
    grand_total: float

class FuelEfficiencyRow(BaseModel):
    vehicle_id: int
    reg_number: str
    total_distance_km: float
    total_fuel_liters: float
    liters_per_100km: float

class DriverPerformanceRow(BaseModel):
    driver_id: int
    name: str
    safety_score: int
    trips_completed: int

class DashboardKPIs(BaseModel):
    activeVehicles: int
    availableVehicles: int
    vehiclesInMaintenance: int
    activeTrips: int
    pendingTrips: int
    driversOnDuty: int
    fleetUtilization: float

class VehicleCostRow(BaseModel):
    vehicle_id: int
    reg_number: str
    name: str
    fuel_cost: float
    maintenance_cost: float
    expense_cost: float
    total_cost: float
    revenue: float
    roi_percent: float

class MonthlyRevenuePoint(BaseModel):
    month: str       # "2026-07"
    revenue: float
    trips_completed: int

class AnalyticsReport(BaseModel):
    fleet_utilization_percent: float
    costliest_vehicles: list[VehicleCostRow]
    monthly_revenue_series: list[MonthlyRevenuePoint]
class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

