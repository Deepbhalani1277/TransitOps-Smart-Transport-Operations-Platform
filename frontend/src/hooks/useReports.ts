import { useQuery } from '@tanstack/react-query';
import { reportService } from '../api/services/reportService';
import { vehicleService } from '../api/services/vehicleService';
import { driverService } from '../api/services/driverService';
import { tripService } from '../api/services/tripService';
import type { DashboardKPIs } from '../types';

export const useFleetSummary = () => {
  return useQuery({
    queryKey: ['reports', 'fleet-summary'],
    queryFn: reportService.fleetSummary,
  });
};

export const useCostBreakdown = (from?: string, to?: string) => {
  return useQuery({
    queryKey: ['reports', 'cost-breakdown', from, to],
    queryFn: () => reportService.costBreakdown(from, to),
  });
};

export const useFuelEfficiency = (from?: string, to?: string) => {
  return useQuery({
    queryKey: ['reports', 'fuel-efficiency', from, to],
    queryFn: () => reportService.fuelEfficiency(from, to),
  });
};

export const useDriverPerformance = () => {
  return useQuery({
    queryKey: ['reports', 'driver-performance'],
    queryFn: reportService.driverPerformance,
  });
};

export const useDashboardKpis = () => {
  return useQuery<DashboardKPIs>({
    queryKey: ['reports', 'dashboard-kpis'],
    queryFn: async () => {
      try {
        return await reportService.dashboardKpis();
      } catch (err) {
        console.warn('Dashboard KPIs endpoint failed or is not implemented. Deriving metrics client-side.', err);
        // Fallback: Fetch vehicles, drivers, trips, and compute the 7 metrics manually
        const [vehicles, drivers, trips] = await Promise.all([
          vehicleService.list(),
          driverService.list(),
          tripService.list(),
        ]);

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
      }
    },
  });
};
