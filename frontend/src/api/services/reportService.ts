import client from '../client';
import type {
  FleetSummary,
  CostBreakdown,
  FuelEfficiency,
  DriverPerformance,
  DashboardKPIs,
} from '../../types';

export const reportService = {
  fleetSummary: async (): Promise<FleetSummary> => {
    const response = await client.get<FleetSummary>('/reports/fleet-summary');
    return response.data;
  },

  costBreakdown: async (from?: string, to?: string): Promise<CostBreakdown> => {
    const response = await client.get<CostBreakdown>('/reports/cost-breakdown', {
      params: { from, to },
    });
    return response.data;
  },

  fuelEfficiency: async (from?: string, to?: string): Promise<FuelEfficiency[]> => {
    const response = await client.get<FuelEfficiency[]>('/reports/fuel-efficiency', {
      params: { from, to },
    });
    return response.data;
  },

  driverPerformance: async (): Promise<DriverPerformance[]> => {
    const response = await client.get<DriverPerformance[]>('/reports/driver-performance');
    return response.data;
  },

  dashboardKpis: async (): Promise<DashboardKPIs> => {
    // If backend doesn't implement this yet, the hook will handle the fallback.
    const response = await client.get<DashboardKPIs>('/reports/dashboard-kpis');
    return response.data;
  },
};
