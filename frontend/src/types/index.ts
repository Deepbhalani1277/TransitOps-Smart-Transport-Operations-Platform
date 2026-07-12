export type UserRole = 'Fleet Manager' | 'Dispatcher' | 'Safety Officer' | 'Financial Analyst';
export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Retired';
export type DriverStatus = 'Available' | 'On Trip' | 'Off Duty' | 'Suspended';
export type TripStatus = 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled';
export type MaintenanceStatus = 'Active' | 'Closed';
export type ExpenseType = 'Toll' | 'Misc';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Vehicle {
  id: number;
  reg_number: string;
  name: string;
  type: string;
  max_capacity_kg: number;
  odometer: number;
  acquisition_cost: number;
  status: VehicleStatus;
  region: string | null;
}

export interface Driver {
  id: number;
  name: string;
  license_number: string;
  license_category: string;
  license_expiry: string; // Date string: YYYY-MM-DD
  contact: string;
  safety_score: number;
  status: DriverStatus;
}

export interface Trip {
  id: number;
  source: string;
  destination: string;
  vehicle_id: number | null;
  driver_id: number | null;
  cargo_weight_kg: number;
  planned_distance_km: number;
  actual_distance_km: number | null;
  fuel_consumed_l: number | null;
  status: TripStatus;
  created_at: string;
  dispatched_at: string | null;
  completed_at: string | null;
}

export interface MaintenanceLog {
  id: number;
  vehicle_id: number;
  service_type: string;
  cost: number;
  date: string; // Date string: YYYY-MM-DD
  status: MaintenanceStatus;
}

export interface FuelLog {
  id: number;
  vehicle_id: number;
  trip_id: number | null;
  liters: number;
  cost: number;
  date: string; // Date string: YYYY-MM-DD
}

export interface Expense {
  id: number;
  vehicle_id: number;
  trip_id: number | null;
  type: ExpenseType;
  amount: number;
  date: string; // Date string: YYYY-MM-DD
}

// === Request body types (for create/update forms) ===
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface VehicleCreate {
  reg_number: string;
  name: string;
  type: string;
  max_capacity_kg: number;
  odometer: number;
  acquisition_cost: number;
  status: VehicleStatus;
  region: string;
}

export type VehicleUpdate = Partial<VehicleCreate>;

export interface DriverCreate {
  name: string;
  license_number: string;
  license_category: string;
  license_expiry: string;
  contact: string;
  safety_score: number;
  status: DriverStatus;
}

export type DriverUpdate = Partial<DriverCreate>;

export interface TripCreate {
  source: string;
  destination: string;
  vehicle_id: number;
  driver_id: number;
  cargo_weight_kg: number;
  planned_distance_km: number;
}

export interface TripUpdate {
  source?: string;
  destination?: string;
  vehicle_id?: number | null;
  driver_id?: number | null;
  cargo_weight_kg?: number;
  planned_distance_km?: number;
  status?: TripStatus;
}

export interface TripCompleteRequest {
  actual_distance_km: number;
  fuel_consumed_l: number;
}

export interface MaintenanceLogCreate {
  vehicle_id: number;
  service_type: string;
  cost: number;
  date: string;
  status: MaintenanceStatus;
}

export type MaintenanceLogUpdate = Partial<MaintenanceLogCreate>;

export interface FuelLogCreate {
  vehicle_id: number;
  trip_id: number | null;
  liters: number;
  cost: number;
  date: string;
}

export interface ExpenseCreate {
  vehicle_id: number;
  trip_id: number | null;
  type: ExpenseType;
  amount: number;
  date: string;
}

// === Report response types ===
export interface FleetSummary {
  total_vehicles: number;
  active_trips: number;
  vehicles_in_shop: number;
  total_odometer_km: number;
}

export interface CostBreakdown {
  total_fuel_cost: number;
  total_maintenance_cost: number;
  total_expenses_cost: number;
  grand_total: number;
}

export interface FuelEfficiency {
  vehicle_id: number;
  reg_number: string;
  total_distance_km: number;
  total_fuel_liters: number;
  liters_per_100km: number;
}

export interface DriverPerformance {
  driver_id: number;
  name: string;
  safety_score: number;
  trips_completed: number;
}

// === Dashboard KPIs (derived or from dedicated endpoint) ===
export interface DashboardKPIs {
  activeVehicles: number;
  availableVehicles: number;
  vehiclesInMaintenance: number;
  activeTrips: number;
  pendingTrips: number;
  driversOnDuty: number;
  fleetUtilization: number; // percentage
}

// === Generic delete response ===
export interface DeleteResponse {
  ok: boolean;
}
