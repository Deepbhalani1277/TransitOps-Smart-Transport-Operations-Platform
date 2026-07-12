from datetime import date, datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Trip, Vehicle, Driver, MaintenanceLog, FuelLog, Expense, TripStatus, VehicleStatus, DriverStatus, MaintenanceStatus
from app.schemas import (
    FleetSummary, CostBreakdown, FuelEfficiencyRow, DriverPerformanceRow,
    DashboardKPIs, VehicleCostRow, MonthlyRevenuePoint, AnalyticsReport
)
from app.auth import require_role

router = APIRouter(prefix="/reports", tags=["Reports"])

REVENUE_RATE_PER_KM = 2.50

@router.get("/fleet-summary", response_model=FleetSummary)
def get_fleet_summary(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Safety Officer", "Financial Analyst"]))
):
    total_vehicles = db.query(Vehicle).count()
    active_trips = db.query(Trip).filter(Trip.status == TripStatus.DISPATCHED).count()
    vehicles_in_shop = db.query(Vehicle).filter(Vehicle.status == VehicleStatus.IN_SHOP).count()
    
    total_odometer = db.query(func.sum(Vehicle.odometer)).scalar()
    total_odometer_km = float(total_odometer) if total_odometer is not None else 0.0

    return FleetSummary(
        total_vehicles=total_vehicles,
        active_trips=active_trips,
        vehicles_in_shop=vehicles_in_shop,
        total_odometer_km=total_odometer_km
    )


@router.get("/cost-breakdown", response_model=CostBreakdown)
def get_cost_breakdown(
    start_date: Optional[date] = Query(None, alias="from"),
    end_date: Optional[date] = Query(None, alias="to"),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Financial Analyst"]))
):
    # Fuel cost
    fuel_query = db.query(func.sum(FuelLog.cost))
    if start_date:
        fuel_query = fuel_query.filter(FuelLog.date >= start_date)
    if end_date:
        fuel_query = fuel_query.filter(FuelLog.date <= end_date)
    fuel_sum = fuel_query.scalar()
    total_fuel_cost = float(fuel_sum) if fuel_sum is not None else 0.0

    # Maintenance cost
    maint_query = db.query(func.sum(MaintenanceLog.cost))
    if start_date:
        maint_query = maint_query.filter(MaintenanceLog.date >= start_date)
    if end_date:
        maint_query = maint_query.filter(MaintenanceLog.date <= end_date)
    maint_sum = maint_query.scalar()
    total_maintenance_cost = float(maint_sum) if maint_sum is not None else 0.0

    # Expenses cost
    exp_query = db.query(func.sum(Expense.amount))
    if start_date:
        exp_query = exp_query.filter(Expense.date >= start_date)
    if end_date:
        exp_query = exp_query.filter(Expense.date <= end_date)
    exp_sum = exp_query.scalar()
    total_expenses_cost = float(exp_sum) if exp_sum is not None else 0.0

    return CostBreakdown(
        total_fuel_cost=total_fuel_cost,
        total_maintenance_cost=total_maintenance_cost,
        total_expenses_cost=total_expenses_cost,
        grand_total=total_fuel_cost + total_maintenance_cost + total_expenses_cost
    )


@router.get("/fuel-efficiency", response_model=List[FuelEfficiencyRow])
def get_fuel_efficiency(
    start_date: Optional[date] = Query(None, alias="from"),
    end_date: Optional[date] = Query(None, alias="to"),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Safety Officer", "Financial Analyst"]))
):
    # Fetch vehicles
    vehicles = db.query(Vehicle).filter(Vehicle.status != VehicleStatus.RETIRED).all()
    results = []

    for v in vehicles:
        trips_query = db.query(Trip).filter(
            Trip.vehicle_id == v.id,
            Trip.status == TripStatus.COMPLETED
        )
        if start_date:
            trips_query = trips_query.filter(Trip.completed_at >= datetime.combine(start_date, datetime.min.time()))
        if end_date:
            trips_query = trips_query.filter(Trip.completed_at <= datetime.combine(end_date, datetime.max.time()))
        
        trips = trips_query.all()
        total_dist = sum(t.actual_distance_km or 0.0 for t in trips)
        total_fuel = sum(t.fuel_consumed_l or 0.0 for t in trips)
        
        # Liters per 100 km
        liters_per_100km = (total_fuel / total_dist) * 100 if total_dist > 0 else 0.0

        results.append(FuelEfficiencyRow(
            vehicle_id=v.id,
            reg_number=v.reg_number,
            total_distance_km=total_dist,
            total_fuel_liters=total_fuel,
            liters_per_100km=liters_per_100km
        ))

    return results


@router.get("/driver-performance", response_model=List[DriverPerformanceRow])
def get_driver_performance(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Safety Officer"]))
):
    drivers = db.query(Driver).all()
    results = []
    for d in drivers:
        comp_trips = db.query(Trip).filter(
            Trip.driver_id == d.id,
            Trip.status == TripStatus.COMPLETED
        ).count()
        results.append(DriverPerformanceRow(
            driver_id=d.id,
            name=d.name,
            safety_score=d.safety_score,
            trips_completed=comp_trips
        ))
    return results


@router.get("/dashboard-kpis", response_model=DashboardKPIs)
def get_dashboard_kpis(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"]))
):
    # Standard fleet aggregates
    total_vehicles = db.query(Vehicle).count()
    active_trips = db.query(Trip).filter(Trip.status == TripStatus.DISPATCHED).count()
    vehicles_in_shop = db.query(Vehicle).filter(Vehicle.status == VehicleStatus.IN_SHOP).count()
    available_drivers = db.query(Driver).filter(Driver.status == DriverStatus.AVAILABLE).count()
    
    total_odometer = db.query(func.sum(Vehicle.odometer)).scalar()
    total_odometer_km = float(total_odometer) if total_odometer is not None else 0.0

    # Trips and revenue in current calendar month
    today = date.today()
    start_of_month = datetime(today.year, today.month, 1)
    if today.month == 12:
        end_of_month = datetime(today.year + 1, 1, 1) - timedelta(seconds=1)
    else:
        end_of_month = datetime(today.year, today.month + 1, 1) - timedelta(seconds=1)

    completed_trips_query = db.query(Trip).filter(
        Trip.status == TripStatus.COMPLETED,
        Trip.completed_at >= start_of_month,
        Trip.completed_at <= end_of_month
    )
    completed_trips = completed_trips_query.all()
    completed_count = len(completed_trips)
    
    total_month_dist = sum(t.actual_distance_km or 0.0 for t in completed_trips)
    monthly_revenue = total_month_dist * REVENUE_RATE_PER_KM

    return DashboardKPIs(
        total_vehicles=total_vehicles,
        active_trips=active_trips,
        vehicles_in_shop=vehicles_in_shop,
        available_drivers=available_drivers,
        total_odometer_km=total_odometer_km,
        completed_trips_this_month=completed_count,
        monthly_revenue=monthly_revenue
    )


@router.get("/analytics", response_model=AnalyticsReport)
def get_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["Fleet Manager", "Financial Analyst"]))
):
    # Fleet Utilization: active trips / total non-retired vehicles
    non_retired_count = db.query(Vehicle).filter(Vehicle.status != VehicleStatus.RETIRED).count()
    active_trips = db.query(Trip).filter(Trip.status == TripStatus.DISPATCHED).count()
    fleet_utilization_percent = (active_trips / non_retired_count) * 100 if non_retired_count > 0 else 0.0

    # Top costliest vehicles (non-retired), calculate ROI
    vehicles = db.query(Vehicle).filter(Vehicle.status != VehicleStatus.RETIRED).all()
    vehicle_costs = []
    
    for v in vehicles:
        # Sum fuel logs
        fuel_sum = db.query(func.sum(FuelLog.cost)).filter(FuelLog.vehicle_id == v.id).scalar()
        fuel_cost = float(fuel_sum) if fuel_sum is not None else 0.0

        # Sum maintenance logs
        maint_sum = db.query(func.sum(MaintenanceLog.cost)).filter(MaintenanceLog.vehicle_id == v.id).scalar()
        maint_cost = float(maint_sum) if maint_sum is not None else 0.0

        # Sum expenses
        exp_sum = db.query(func.sum(Expense.amount)).filter(Expense.vehicle_id == v.id).scalar()
        expense_cost = float(exp_sum) if exp_sum is not None else 0.0

        total_cost = fuel_cost + maint_cost + expense_cost

        # Sum revenue (completed trips actual distance * 2.50)
        trips = db.query(Trip).filter(Trip.vehicle_id == v.id, Trip.status == TripStatus.COMPLETED).all()
        total_dist = sum(t.actual_distance_km or 0.0 for t in trips)
        revenue = total_dist * REVENUE_RATE_PER_KM

        # ROI: (Revenue - (Maintenance + Fuel)) / Acquisition Cost * 100
        if v.acquisition_cost > 0:
            roi_percent = ((revenue - (maint_cost + fuel_cost)) / v.acquisition_cost) * 100
        else:
            roi_percent = 0.0

        vehicle_costs.append(VehicleCostRow(
            vehicle_id=v.id,
            reg_number=v.reg_number,
            name=v.name,
            fuel_cost=fuel_cost,
            maintenance_cost=maint_cost,
            expense_cost=expense_cost,
            total_cost=total_cost,
            revenue=revenue,
            roi_percent=roi_percent
        ))

    # Sort by total cost descending
    vehicle_costs.sort(key=lambda x: x.total_cost, reverse=True)
    # Return top 10 costliest vehicles for analytics view
    costliest_vehicles = vehicle_costs[:10]

    # Monthly revenue series for the last 12 months
    monthly_series = []
    today = date.today()
    
    # Calculate months range
    for i in range(11, -1, -1):
        # Subtract months
        year = today.year
        month = today.month - i
        while month <= 0:
            month += 12
            year -= 1
            
        start_date_dt = datetime(year, month, 1)
        if month == 12:
            end_date_dt = datetime(year + 1, 1, 1) - timedelta(seconds=1)
        else:
            end_date_dt = datetime(year, month + 1, 1) - timedelta(seconds=1)
            
        month_trips = db.query(Trip).filter(
            Trip.status == TripStatus.COMPLETED,
            Trip.completed_at >= start_date_dt,
            Trip.completed_at <= end_date_dt
        ).all()
        
        m_dist = sum(t.actual_distance_km or 0.0 for t in month_trips)
        m_rev = m_dist * REVENUE_RATE_PER_KM
        
        monthly_series.append(MonthlyRevenuePoint(
            month=f"{year}-{month:02d}",
            revenue=m_rev,
            trips_completed=len(month_trips)
        ))

    return AnalyticsReport(
        fleet_utilization_percent=fleet_utilization_percent,
        costliest_vehicles=costliest_vehicles,
        monthly_revenue_series=monthly_series
    )
