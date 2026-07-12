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
