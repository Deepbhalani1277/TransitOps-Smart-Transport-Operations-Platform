import client from '../client';
import type {
  FleetSummary,
  CostBreakdown,
  FuelEfficiency,
  DriverPerformance,
  DashboardKPIs,
} from '../../types';
import { isSandbox } from './authService';
import { mockDb } from '../mockDb';

export const reportService = {
  fleetSummary: async (): Promise<FleetSummary> => {
    // Derived inside sandbox if needed, but not actively used in reports
    if (isSandbox()) {
      const vehicles = mockDb.getVehicles();
      const active = vehicles.filter((v) => v.status === 'On Trip').length;
      const totalOdo = vehicles.reduce((sum, item) => sum + item.odometer, 0);
      return {
        total_vehicles: vehicles.length,
        active_trips: active,
        vehicles_in_shop: vehicles.filter((v) => v.status === 'In Shop').length,
        total_odometer_km: totalOdo,
      };
    }
    const response = await client.get<FleetSummary>('/reports/fleet-summary');
    return response.data;
  },

  costBreakdown: async (from?: string, to?: string): Promise<CostBreakdown> => {
    if (isSandbox()) return mockDb.getCostBreakdown();
    const response = await client.get<CostBreakdown>('/reports/cost-breakdown', {
      params: { from, to },
    });
    return response.data;
  },

  fuelEfficiency: async (from?: string, to?: string): Promise<FuelEfficiency[]> => {
    if (isSandbox()) return mockDb.getFuelEfficiency();
    const response = await client.get<FuelEfficiency[]>('/reports/fuel-efficiency', {
      params: { from, to },
    });
    return response.data;
  },

  driverPerformance: async (): Promise<DriverPerformance[]> => {
    if (isSandbox()) return mockDb.getDriverPerformance();
    const response = await client.get<DriverPerformance[]>('/reports/driver-performance');
    return response.data;
  },

  dashboardKpis: async (): Promise<DashboardKPIs> => {
    if (isSandbox()) return mockDb.getDashboardKpis();
    const response = await client.get<DashboardKPIs>('/reports/dashboard-kpis');
    return response.data;
  },
};
