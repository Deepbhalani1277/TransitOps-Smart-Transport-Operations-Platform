# TransitOps API Contract

This document lists all planned endpoints for the TransitOps backend. Use this contract to develop the frontend and backend in parallel.

## Base URL
`/api`

---

## Auth Router (`routers/auth.py`)

### 1. Register User
* **Method**: `POST`
* **Path**: `/auth/register`
* **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "Fleet Manager" // Options: "Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Fleet Manager"
  }
  ```

### 2. Login User
* **Method**: `POST`
* **Path**: `/auth/login`
* **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer"
  }
  ```

### 3. Get Current User (Me)
* **Method**: `GET`
* **Path**: `/auth/me`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Fleet Manager"
  }
  ```

---

## Vehicles Router (`routers/vehicles.py`)

### 1. List Vehicles
* **Method**: `GET`
* **Path**: `/vehicles`
* **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "reg_number": "TX-1234-OP",
      "name": "Volvo FH16",
      "type": "Heavy Duty Truck",
      "max_capacity_kg": 25000.0,
      "odometer": 12500.5,
      "acquisition_cost": 135000.0,
      "status": "Available", // "Available", "On Trip", "In Shop", "Retired"
      "region": "North"
    }
  ]
  ```

### 2. Create Vehicle
* **Method**: `POST`
* **Path**: `/vehicles`
* **Request Body**:
  ```json
  {
    "reg_number": "TX-1234-OP",
    "name": "Volvo FH16",
    "type": "Heavy Duty Truck",
    "max_capacity_kg": 25000.0,
    "odometer": 0.0,
    "acquisition_cost": 135000.0,
    "status": "Available",
    "region": "North"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "id": 1,
    "reg_number": "TX-1234-OP",
    "name": "Volvo FH16",
    "type": "Heavy Duty Truck",
    "max_capacity_kg": 25000.0,
    "odometer": 0.0,
    "acquisition_cost": 135000.0,
    "status": "Available",
    "region": "North"
  }
  ```

### 3. Get Vehicle By ID
* **Method**: `GET`
* **Path**: `/vehicles/{id}`
* **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "reg_number": "TX-1234-OP",
    "name": "Volvo FH16",
    "type": "Heavy Duty Truck",
    "max_capacity_kg": 25000.0,
    "odometer": 12500.5,
    "acquisition_cost": 135000.0,
    "status": "Available",
    "region": "North"
  }
  ```

### 4. Patch Vehicle (Update)
* **Method**: `PATCH`
* **Path**: `/vehicles/{id}`
* **Request Body**:
  ```json
  {
    "name": "Volvo FH16 Upgraded",
    "status": "In Shop",
    "region": "South"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "reg_number": "TX-1234-OP",
    "name": "Volvo FH16 Upgraded",
    "type": "Heavy Duty Truck",
    "max_capacity_kg": 25000.0,
    "odometer": 12500.5,
    "acquisition_cost": 135000.0,
    "status": "In Shop",
    "region": "South"
  }
  ```

### 5. Delete Vehicle
* **Method**: `DELETE`
* **Path**: `/vehicles/{id}`
* **Response (200 OK)**:
  ```json
  {
    "ok": true
  }
  ```

---

## Drivers Router (`routers/drivers.py`)

### 1. List Drivers
* **Method**: `GET`
* **Path**: `/drivers`
* **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "name": "Alice Smith",
      "license_number": "DL-987654321",
      "license_category": "Class A CDL",
      "license_expiry": "2028-12-31",
      "contact": "+1-555-0199",
      "safety_score": 98,
      "status": "Available" // "Available", "On Trip", "Off Duty", "Suspended"
    }
  ]
  ```

### 2. Create Driver
* **Method**: `POST`
* **Path**: `/drivers`
* **Request Body**:
  ```json
  {
    "name": "Alice Smith",
    "license_number": "DL-987654321",
    "license_category": "Class A CDL",
    "license_expiry": "2028-12-31",
    "contact": "+1-555-0199",
    "safety_score": 100,
    "status": "Available"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "id": 1,
    "name": "Alice Smith",
    "license_number": "DL-987654321",
    "license_category": "Class A CDL",
    "license_expiry": "2028-12-31",
    "contact": "+1-555-0199",
    "safety_score": 100,
    "status": "Available"
  }
  ```

### 3. Get Driver By ID
* **Method**: `GET`
* **Path**: `/drivers/{id}`
* **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "name": "Alice Smith",
    "license_number": "DL-987654321",
    "license_category": "Class A CDL",
    "license_expiry": "2028-12-31",
    "contact": "+1-555-0199",
    "safety_score": 98,
    "status": "Available"
  }
  ```

### 4. Patch Driver (Update)
* **Method**: `PATCH`
* **Path**: `/drivers/{id}`
* **Request Body**:
  ```json
  {
    "contact": "+1-555-0200",
    "status": "Off Duty"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "name": "Alice Smith",
    "license_number": "DL-987654321",
    "license_category": "Class A CDL",
    "license_expiry": "2028-12-31",
    "contact": "+1-555-0200",
    "safety_score": 98,
    "status": "Off Duty"
  }
  ```

### 5. Delete Driver
* **Method**: `DELETE`
* **Path**: `/drivers/{id}`
* **Response (200 OK)**:
  ```json
  {
    "ok": true
  }
  ```

---

## Trips Router (`routers/trips.py`)

### 1. List Trips
* **Method**: `GET`
* **Path**: `/trips`
* **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "source": "New York, NY",
      "destination": "Boston, MA",
      "vehicle_id": 1,
      "driver_id": 1,
      "cargo_weight_kg": 15000.0,
      "planned_distance_km": 350.0,
      "actual_distance_km": null,
      "fuel_consumed_l": null,
      "status": "Draft", // "Draft", "Dispatched", "Completed", "Cancelled"
      "created_at": "2026-07-12T10:00:00",
      "dispatched_at": null,
      "completed_at": null
    }
  ]
  ```

### 2. Create Trip
* **Method**: `POST`
* **Path**: `/trips`
* **Request Body**:
  ```json
  {
    "source": "New York, NY",
    "destination": "Boston, MA",
    "vehicle_id": 1,
    "driver_id": 1,
    "cargo_weight_kg": 15000.0,
    "planned_distance_km": 350.0
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "id": 1,
    "source": "New York, NY",
    "destination": "Boston, MA",
    "vehicle_id": 1,
    "driver_id": 1,
    "cargo_weight_kg": 15000.0,
    "planned_distance_km": 350.0,
    "actual_distance_km": null,
    "fuel_consumed_l": null,
    "status": "Draft",
    "created_at": "2026-07-12T10:00:00",
    "dispatched_at": null,
    "completed_at": null
  }
  ```

### 3. Get Trip By ID
* **Method**: `GET`
* **Path**: `/trips/{id}`
* **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "source": "New York, NY",
    "destination": "Boston, MA",
    "vehicle_id": 1,
    "driver_id": 1,
    "cargo_weight_kg": 15000.0,
    "planned_distance_km": 350.0,
    "actual_distance_km": null,
    "fuel_consumed_l": null,
    "status": "Draft",
    "created_at": "2026-07-12T10:00:00",
    "dispatched_at": null,
    "completed_at": null
  }
  ```

### 4. Patch Trip
* **Method**: `PATCH`
* **Path**: `/trips/{id}`
* **Request Body**:
  ```json
  {
    "cargo_weight_kg": 16000.0
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "source": "New York, NY",
    "destination": "Boston, MA",
    "vehicle_id": 1,
    "driver_id": 1,
    "cargo_weight_kg": 16000.0,
    "planned_distance_km": 350.0,
    "actual_distance_km": null,
    "fuel_consumed_l": null,
    "status": "Draft",
    "created_at": "2026-07-12T10:00:00",
    "dispatched_at": null,
    "completed_at": null
  }
  ```

### 5. Dispatch Trip
* **Method**: `POST`
* **Path**: `/trips/{id}/dispatch`
* **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "source": "New York, NY",
    "destination": "Boston, MA",
    "vehicle_id": 1,
    "driver_id": 1,
    "cargo_weight_kg": 16000.0,
    "planned_distance_km": 350.0,
    "actual_distance_km": null,
    "fuel_consumed_l": null,
    "status": "Dispatched",
    "created_at": "2026-07-12T10:00:00",
    "dispatched_at": "2026-07-12T11:45:00",
    "completed_at": null
  }
  ```

### 6. Complete Trip
* **Method**: `POST`
* **Path**: `/trips/{id}/complete`
* **Request Body**:
  ```json
  {
    "actual_distance_km": 355.2,
    "fuel_consumed_l": 32.5
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "source": "New York, NY",
    "destination": "Boston, MA",
    "vehicle_id": 1,
    "driver_id": 1,
    "cargo_weight_kg": 16000.0,
    "planned_distance_km": 350.0,
    "actual_distance_km": 355.2,
    "fuel_consumed_l": 32.5,
    "status": "Completed",
    "created_at": "2026-07-12T10:00:00",
    "dispatched_at": "2026-07-12T11:45:00",
    "completed_at": "2026-07-12T15:30:00"
  }
  ```

---

## Maintenance Router (`routers/maintenance.py`)

### 1. List Maintenance Logs
* **Method**: `GET`
* **Path**: `/maintenance`
* **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "vehicle_id": 1,
      "service_type": "Engine Oil Change",
      "cost": 150.0,
      "date": "2026-07-10",
      "status": "Closed" // "Active", "Closed"
    }
  ]
  ```

### 2. Create Maintenance Log
* **Method**: `POST`
* **Path**: `/maintenance`
* **Request Body**:
  ```json
  {
    "vehicle_id": 1,
    "service_type": "Brake Replacement",
    "cost": 450.0,
    "date": "2026-07-12",
    "status": "Active"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "id": 2,
    "vehicle_id": 1,
    "service_type": "Brake Replacement",
    "cost": 450.0,
    "date": "2026-07-12",
    "status": "Active"
  }
  ```

### 3. Patch Maintenance Log (e.g. Close It)
* **Method**: `PATCH`
* **Path**: `/maintenance/{id}`
* **Request Body**:
  ```json
  {
    "status": "Closed"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "id": 2,
    "vehicle_id": 1,
    "service_type": "Brake Replacement",
    "cost": 450.0,
    "date": "2026-07-12",
    "status": "Closed"
  }
  ```

---

## Fuel & Expenses Router (`routers/fuel_expenses.py`)

### 1. List Fuel Logs
* **Method**: `GET`
* **Path**: `/fuel`
* **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "vehicle_id": 1,
      "trip_id": 1,
      "liters": 45.5,
      "cost": 90.0,
      "date": "2026-07-12"
    }
  ]
  ```

### 2. Create Fuel Log
* **Method**: `POST`
* **Path**: `/fuel`
* **Request Body**:
  ```json
  {
    "vehicle_id": 1,
    "trip_id": 1,
    "liters": 45.5,
    "cost": 90.0,
    "date": "2026-07-12"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "id": 1,
    "vehicle_id": 1,
    "trip_id": 1,
    "liters": 45.5,
    "cost": 90.0,
    "date": "2026-07-12"
  }
  ```

### 3. List Expenses
* **Method**: `GET`
* **Path**: `/expenses`
* **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "vehicle_id": 1,
      "trip_id": 1,
      "type": "Toll", // "Toll", "Misc"
      "amount": 15.0,
      "date": "2026-07-12"
    }
  ]
  ```

### 4. Create Expense
* **Method**: `POST`
* **Path**: `/expenses`
* **Request Body**:
  ```json
  {
    "vehicle_id": 1,
    "trip_id": 1,
    "type": "Toll",
    "amount": 15.0,
    "date": "2026-07-12"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "id": 1,
    "vehicle_id": 1,
    "trip_id": 1,
    "type": "Toll",
    "amount": 15.0,
    "date": "2026-07-12"
  }
  ```

---

## Reports Router (`routers/reports.py`)

### 1. Fleet Summary Report
* **Method**: `GET`
* **Path**: `/reports/fleet-summary`
* **Response (200 OK)**:
  ```json
  {
    "total_vehicles": 12,
    "active_trips": 3,
    "vehicles_in_shop": 1,
    "total_odometer_km": 154200.5
  }
  ```

### 2. Cost Breakdown Report
* **Method**: `GET`
* **Path**: `/reports/cost-breakdown`
* **Parameters**: `from` (date), `to` (date)
* **Response (200 OK)**:
  ```json
  {
    "total_fuel_cost": 1500.0,
    "total_maintenance_cost": 950.0,
    "total_expenses_cost": 340.0,
    "grand_total": 2790.0
  }
  ```

### 3. Fuel Efficiency Report
* **Method**: `GET`
* **Path**: `/reports/fuel-efficiency`
* **Parameters**: `from` (date), `to` (date)
* **Response (200 OK)**:
  ```json
  [
    {
      "vehicle_id": 1,
      "reg_number": "TX-1234-OP",
      "total_distance_km": 1200.0,
      "total_fuel_liters": 115.0,
      "liters_per_100km": 9.58
    }
  ]
  ```

### 4. Driver Safety & Performance Report
* **Method**: `GET`
* **Path**: `/reports/driver-performance`
* **Response (200 OK)**:
  ```json
  [
    {
      "driver_id": 1,
      "name": "Alice Smith",
      "safety_score": 98,
      "trips_completed": 15
    }
  ]
  ```
