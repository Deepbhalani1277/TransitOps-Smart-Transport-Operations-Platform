import type {
  Vehicle,
  Driver,
  Trip,
  MaintenanceLog,
  FuelLog,
  Expense,
  VehicleCreate,
  VehicleUpdate,
  DriverCreate,
  DriverUpdate,
  TripCreate,
  TripUpdate,
  TripCompleteRequest,
  MaintenanceLogCreate,
  MaintenanceLogUpdate,
  FuelLogCreate,
  ExpenseCreate,
  DashboardKPIs,
  CostBreakdown,
  FuelEfficiency,
  DriverPerformance,
} from '../types';

// Helper to load/save from localStorage
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(item);
};

const setStorageItem = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initial Mock Data
const initialVehicles: Vehicle[] = [
  {
    id: 1,
    reg_number: 'TX-1234-OP',
    name: 'Volvo FH16',
    type: 'Heavy Duty Truck',
    max_capacity_kg: 25000,
    odometer: 12500.5,
    acquisition_cost: 135000,
    status: 'Available',
    region: 'North',
  },
  {
    id: 2,
    reg_number: 'TX-5678-AB',
    name: 'Scania R500',
    type: 'Heavy Duty Truck',
    max_capacity_kg: 24000,
    odometer: 8400.2,
    acquisition_cost: 128000,
    status: 'On Trip',
    region: 'South',
  },
  {
    id: 3,
    reg_number: 'TX-9012-CD',
    name: 'Ford Transit',
    type: 'Van',
    max_capacity_kg: 3500,
    odometer: 45000.8,
    acquisition_cost: 45000,
    status: 'In Shop',
    region: 'East',
  },
];

const initialDrivers: Driver[] = [
  {
    id: 1,
    name: 'Alice Smith',
    license_number: 'DL-987654321',
    license_category: 'Class A CDL',
    license_expiry: '2028-12-31',
    contact: '+1-555-0199',
    safety_score: 98,
    status: 'Available',
  },
  {
    id: 2,
    name: 'Bob Jones',
    license_number: 'DL-123456789',
    license_category: 'Class A CDL',
    license_expiry: '2026-06-15', // Expired compared to 2026-07-12
    contact: '+1-555-0204',
    safety_score: 92,
    status: 'On Trip',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    license_number: 'DL-456789123',
    license_category: 'Class B CDL',
    license_expiry: '2027-09-20',
    contact: '+1-555-0210',
    safety_score: 72,
    status: 'Off Duty',
  },
];

const initialTrips: Trip[] = [
  {
    id: 1,
    source: 'New York, NY',
    destination: 'Boston, MA',
    vehicle_id: 2,
    driver_id: 2,
    cargo_weight_kg: 15000,
    planned_distance_km: 350.0,
    actual_distance_km: null,
    fuel_consumed_l: null,
    status: 'Dispatched',
    created_at: '2026-07-12T10:00:00',
    dispatched_at: '2026-07-12T11:45:00',
    completed_at: null,
  },
  {
    id: 2,
    source: 'Chicago, IL',
    destination: 'Detroit, MI',
    vehicle_id: 1,
    driver_id: 1,
    cargo_weight_kg: 10000,
    planned_distance_km: 450.0,
    actual_distance_km: 445.0,
    fuel_consumed_l: 42.0,
    status: 'Completed',
    created_at: '2026-07-10T08:00:00',
    dispatched_at: '2026-07-10T09:00:00',
    completed_at: '2026-07-10T16:30:00',
  },
];

const initialMaintenance: MaintenanceLog[] = [
  {
    id: 1,
    vehicle_id: 3,
    service_type: 'Brake Replacement',
    cost: 450.0,
    date: '2026-07-12',
    status: 'Active',
  },
  {
    id: 2,
    vehicle_id: 1,
    service_type: 'Engine Oil Change',
    cost: 150.0,
    date: '2026-07-10',
    status: 'Closed',
  },
];

const initialFuel: FuelLog[] = [
  {
    id: 1,
    vehicle_id: 1,
    trip_id: 2,
    liters: 45.5,
    cost: 90.0,
    date: '2026-07-10',
  },
];

const initialExpenses: Expense[] = [
  {
    id: 1,
    vehicle_id: 1,
    trip_id: 2,
    type: 'Toll',
    amount: 15.0,
    date: '2026-07-10',
  },
];

export const mockDb = {
  getVehicles: () => getStorageItem<Vehicle[]>('mock_vehicles', initialVehicles),
  saveVehicles: (data: Vehicle[]) => setStorageItem('mock_vehicles', data),

  getDrivers: () => getStorageItem<Driver[]>('mock_drivers', initialDrivers),
  saveDrivers: (data: Driver[]) => setStorageItem('mock_drivers', data),

  getTrips: () => getStorageItem<Trip[]>('mock_trips', initialTrips),
  saveTrips: (data: Trip[]) => setStorageItem('mock_trips', data),

  getMaintenance: () => getStorageItem<MaintenanceLog[]>('mock_maintenance', initialMaintenance),
  saveMaintenance: (data: MaintenanceLog[]) => setStorageItem('mock_maintenance', data),

  getFuel: () => getStorageItem<FuelLog[]>('mock_fuel', initialFuel),
  saveFuel: (data: FuelLog[]) => setStorageItem('mock_fuel', data),

  getExpenses: () => getStorageItem<Expense[]>('mock_expenses', initialExpenses),
  saveExpenses: (data: Expense[]) => setStorageItem('mock_expenses', data),

  // --- CRUD Implementations ---
  createVehicle: (data: VehicleCreate): Vehicle => {
    const list = mockDb.getVehicles();
    
    // Validate unique reg_number
    if (list.some((v) => v.reg_number === data.reg_number)) {
      throw { response: { data: { detail: `Vehicle with registration number ${data.reg_number} already exists.` } } };
    }

    const newVehicle: Vehicle = {
      ...data,
      id: list.length > 0 ? Math.max(...list.map((v) => v.id)) + 1 : 1,
    };
    list.push(newVehicle);
    mockDb.saveVehicles(list);
    return newVehicle;
  },

  updateVehicle: (id: number, data: VehicleUpdate): Vehicle => {
    const list = mockDb.getVehicles();
    const idx = list.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error('Vehicle not found.');

    // Validate unique reg_number if changed
    if (data.reg_number && list.some((v) => v.reg_number === data.reg_number && v.id !== id)) {
      throw { response: { data: { detail: `Vehicle with registration number ${data.reg_number} already exists.` } } };
    }

    const updated: Vehicle = { ...list[idx], ...data };
    list[idx] = updated;
    mockDb.saveVehicles(list);
    return updated;
  },

  deleteVehicle: (id: number) => {
    let list = mockDb.getVehicles();
    list = list.filter((v) => v.id !== id);
    mockDb.saveVehicles(list);
    return { ok: true };
  },

  createDriver: (data: DriverCreate): Driver => {
    const list = mockDb.getDrivers();
    const newDriver: Driver = {
      ...data,
      id: list.length > 0 ? Math.max(...list.map((d) => d.id)) + 1 : 1,
    };
    list.push(newDriver);
    mockDb.saveDrivers(list);
    return newDriver;
  },

  updateDriver: (id: number, data: DriverUpdate): Driver => {
    const list = mockDb.getDrivers();
    const idx = list.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Driver not found.');
    const updated: Driver = { ...list[idx], ...data };
    list[idx] = updated;
    mockDb.saveDrivers(list);
    return updated;
  },

  deleteDriver: (id: number) => {
    let list = mockDb.getDrivers();
    list = list.filter((d) => d.id !== id);
    mockDb.saveDrivers(list);
    return { ok: true };
  },

  createTrip: (data: TripCreate): Trip => {
    const list = mockDb.getTrips();
    const newTrip: Trip = {
      ...data,
      id: list.length > 0 ? Math.max(...list.map((t) => t.id)) + 1 : 1,
      actual_distance_km: null,
      fuel_consumed_l: null,
      status: 'Draft',
      created_at: new Date().toISOString(),
      dispatched_at: null,
      completed_at: null,
    };
    list.push(newTrip);
    mockDb.saveTrips(list);
    return newTrip;
  },

  updateTrip: (id: number, data: TripUpdate): Trip => {
    const list = mockDb.getTrips();
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Trip not found.');
    const updated: Trip = { ...list[idx], ...data };
    list[idx] = updated;
    mockDb.saveTrips(list);
    return updated;
  },

  dispatchTrip: (id: number): Trip => {
    const trip = mockDb.getTrips().find((t) => t.id === id);
    if (!trip) throw new Error('Trip not found.');

    // Backend validations replication
    const driver = mockDb.getDrivers().find((d) => d.id === trip.driver_id);
    if (driver && driver.status === 'Suspended') {
      throw { response: { data: { detail: 'Cannot dispatch trip: Assigned driver is Suspended.' } } };
    }

    const expiry = driver ? new Date(driver.license_expiry) : null;
    const today = new Date('2026-07-12');
    if (expiry && expiry < today) {
      throw { response: { data: { detail: 'Cannot dispatch trip: Assigned driver license is Expired.' } } };
    }

    const vehicle = mockDb.getVehicles().find((v) => v.id === trip.vehicle_id);
    if (vehicle && vehicle.status === 'In Shop') {
      throw { response: { data: { detail: 'Cannot dispatch trip: Assigned vehicle is currently In Shop for maintenance.' } } };
    }

    if (trip.cargo_weight_kg > (vehicle?.max_capacity_kg || 0)) {
      throw { response: { data: { detail: 'Cannot dispatch trip: Cargo weight exceeds vehicle maximum capacity.' } } };
    }

    // Set trip status
    const updated = mockDb.updateTrip(id, {
      status: 'Dispatched',
      dispatched_at: new Date().toISOString(),
    });

    // Set driver and vehicle status
    if (trip.vehicle_id) mockDb.updateVehicle(trip.vehicle_id, { status: 'On Trip' });
    if (trip.driver_id) mockDb.updateDriver(trip.driver_id, { status: 'On Trip' });

    return updated;
  },

  completeTrip: (id: number, data: TripCompleteRequest): Trip => {
    const trip = mockDb.getTrips().find((t) => t.id === id);
    if (!trip) throw new Error('Trip not found.');

    const updated = mockDb.updateTrip(id, {
      status: 'Completed',
      completed_at: new Date().toISOString(),
      actual_distance_km: data.actual_distance_km,
      fuel_consumed_l: data.fuel_consumed_l,
    });

    // Reset vehicle and driver
    if (trip.vehicle_id) {
      const vehicle = mockDb.getVehicles().find((v) => v.id === trip.vehicle_id);
      const newOdometer = (vehicle?.odometer || 0) + data.actual_distance_km;
      mockDb.updateVehicle(trip.vehicle_id, {
        status: 'Available',
        odometer: newOdometer,
      });
    }

    if (trip.driver_id) {
      const driver = mockDb.getDrivers().find((d) => d.id === trip.driver_id);
      if (driver) {
        // Adjust safety score: completing adds +1. If efficiency is poor (>10L/100km), subtract 2
        const efficiencyRate = data.actual_distance_km > 0 ? (data.fuel_consumed_l / data.actual_distance_km) * 105 : 0;
        let scoreDiff = 1;
        if (efficiencyRate > 10) scoreDiff = -2;

        const newScore = Math.max(0, Math.min(100, driver.safety_score + scoreDiff));
        mockDb.updateDriver(trip.driver_id, {
          status: 'Available',
          safety_score: newScore,
        });
      }
    }

    // Automatically log fuel log
    if (trip.vehicle_id) {
      const fuelLogs = mockDb.getFuel();
      fuelLogs.push({
        id: fuelLogs.length > 0 ? Math.max(...fuelLogs.map((f) => f.id)) + 1 : 1,
        vehicle_id: trip.vehicle_id,
        trip_id: trip.id,
        liters: data.fuel_consumed_l,
        cost: data.fuel_consumed_l * 2.1, // mock price $2.1 per liter
        date: new Date().toISOString().split('T')[0],
      });
      mockDb.saveFuel(fuelLogs);
    }

    return updated;
  },

  createMaintenance: (data: MaintenanceLogCreate): MaintenanceLog => {
    const list = mockDb.getMaintenance();
    const newLog: MaintenanceLog = {
      ...data,
      id: list.length > 0 ? Math.max(...list.map((m) => m.id)) + 1 : 1,
    };
    list.push(newLog);
    mockDb.saveMaintenance(list);

    // If active, set vehicle status to In Shop
    if (data.status === 'Active') {
      mockDb.updateVehicle(data.vehicle_id, { status: 'In Shop' });
    }

    return newLog;
  },

  updateMaintenance: (id: number, data: MaintenanceLogUpdate): MaintenanceLog => {
    const list = mockDb.getMaintenance();
    const idx = list.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Maintenance log not found.');
    const updated: MaintenanceLog = { ...list[idx], ...data };
    list[idx] = updated;
    mockDb.saveMaintenance(list);

    // If closed, set vehicle status back to Available
    if (data.status === 'Closed') {
      mockDb.updateVehicle(updated.vehicle_id, { status: 'Available' });
    }

    return updated;
  },

  createFuel: (data: FuelLogCreate): FuelLog => {
    const list = mockDb.getFuel();
    const newLog: FuelLog = {
      ...data,
      id: list.length > 0 ? Math.max(...list.map((f) => f.id)) + 1 : 1,
    };
    list.push(newLog);
    mockDb.saveFuel(list);
    return newLog;
  },

  createExpense: (data: ExpenseCreate): Expense => {
    const list = mockDb.getExpenses();
    const newLog: Expense = {
      ...data,
      id: list.length > 0 ? Math.max(...list.map((e) => e.id)) + 1 : 1,
    };
    list.push(newLog);
    mockDb.saveExpenses(list);
    return newLog;
  },

  // --- Reports calculations ---
  getCostBreakdown: (): CostBreakdown => {
    const fuel = mockDb.getFuel();
    const maint = mockDb.getMaintenance();
    const exp = mockDb.getExpenses();

    const total_fuel_cost = fuel.reduce((sum, item) => sum + item.cost, 0);
    const total_maintenance_cost = maint.reduce((sum, item) => sum + item.cost, 0);
    const total_expenses_cost = exp.reduce((sum, item) => sum + item.amount, 0);
    const grand_total = total_fuel_cost + total_maintenance_cost + total_expenses_cost;

    return {
      total_fuel_cost,
      total_maintenance_cost,
      total_expenses_cost,
      grand_total,
    };
  },

  getFuelEfficiency: (): FuelEfficiency[] => {
    const trips = mockDb.getTrips().filter((t) => t.status === 'Completed');
    const result: Record<number, { reg: string; dist: number; fuel: number }> = {};

    trips.forEach((t) => {
      if (t.vehicle_id && t.actual_distance_km && t.fuel_consumed_l) {
        const vehicle = mockDb.getVehicles().find((v) => v.id === t.vehicle_id);
        const reg = vehicle?.reg_number || 'UNKNOWN';
        if (!result[t.vehicle_id]) {
          result[t.vehicle_id] = { reg, dist: 0, fuel: 0 };
        }
        result[t.vehicle_id].dist += t.actual_distance_km;
        result[t.vehicle_id].fuel += t.fuel_consumed_l;
      }
    });

    return Object.entries(result).map(([vId, item]) => {
      const liters_per_100km = item.dist > 0 ? Number(((item.fuel / item.dist) * 100).toFixed(2)) : 0;
      return {
        vehicle_id: Number(vId),
        reg_number: item.reg,
        total_distance_km: item.dist,
        total_fuel_liters: item.fuel,
        liters_per_100km,
      };
    });
  },

  getDriverPerformance: (): DriverPerformance[] => {
    const drivers = mockDb.getDrivers();
    const trips = mockDb.getTrips();

    return drivers.map((d) => {
      const trips_completed = trips.filter((t) => t.driver_id === d.id && t.status === 'Completed').length;
      return {
        driver_id: d.id,
        name: d.name,
        safety_score: d.safety_score,
        trips_completed,
      };
    });
  },

  getDashboardKpis: (): DashboardKPIs => {
    const vehicles = mockDb.getVehicles();
    const drivers = mockDb.getDrivers();
    const trips = mockDb.getTrips();

    const activeVehicles = vehicles.filter((v) => v.status === 'On Trip').length;
    const availableVehicles = vehicles.filter((v) => v.status === 'Available').length;
    const vehiclesInMaintenance = vehicles.filter((v) => v.status === 'In Shop').length;
    const activeTrips = trips.filter((t) => t.status === 'Dispatched').length;
    const pendingTrips = trips.filter((t) => t.status === 'Draft').length;
    const driversOnDuty = drivers.filter((d) => d.status === 'Available' || d.status === 'On Trip').length;
    const totalVehicles = vehicles.length;
    const fleetUtilization = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;

    return {
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization,
    };
  },
};
