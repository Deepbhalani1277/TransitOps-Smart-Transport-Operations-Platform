import React from 'react';
import {
  useCostBreakdown,
  useFuelEfficiency,
  useDriverPerformance,
} from '../hooks/useReports';
import { useTrips } from '../hooks/useTrips';
import PageHeader from '../components/ui/PageHeader';
import KPICard from '../components/ui/KPICard';
import BarChart from '../components/ui/BarChart';
import DataTable, { type ColumnDef } from '../components/ui/DataTable';
import CSVExportButton from '../components/ui/CSVExportButton';
import ErrorAlert from '../components/ui/ErrorAlert';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import type { FuelEfficiency } from '../types';
import { DollarSign, Landmark, Shield, Milestone } from 'lucide-react';

const Reports: React.FC = () => {
  // Query reports data
  const { data: costs, isLoading: costsLoading, error: costsError } = useCostBreakdown();
  const { data: efficiency, isLoading: efficiencyLoading } = useFuelEfficiency();
  const { data: driversPerformance, isLoading: driversLoading } = useDriverPerformance();
  const isLoading = costsLoading || efficiencyLoading || driversLoading;
  const { data: trips } = useTrips();
  const error = costsError;

  // Monthly Revenue calculations based on completed trips
  // Mock fallback if no trips are present, otherwise aggregate actual completed ones
  const getMonthlyRevenueData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueMap: Record<string, number> = {};

    months.forEach((m) => {
      revenueMap[m] = 0;
    });

    if (trips && trips.length > 0) {
      trips
        .filter((t) => t.status === 'Completed' && t.completed_at)
        .forEach((t) => {
          const date = new Date(t.completed_at!);
          const monthName = months[date.getMonth()];
          // Calculate trip revenue: planned distance * cargo weight * factor
          const tripRevenue = t.planned_distance_km * (t.cargo_weight_kg / 1000) * 0.45;
          revenueMap[monthName] = (revenueMap[monthName] || 0) + tripRevenue;
        });
    }

    // Ensure we have some visible bars for visual representation on startup
    const hasValues = Object.values(revenueMap).some((val) => val > 0);
    if (!hasValues) {
      return [
        { name: 'Jan', revenue: 4500 },
        { name: 'Feb', revenue: 5200 },
        { name: 'Mar', revenue: 6100 },
        { name: 'Apr', revenue: 5800 },
        { name: 'May', revenue: 7100 },
        { name: 'Jun', revenue: 8300 },
        { name: 'Jul', revenue: 9400 },
      ];
    }

    return months.map((m) => ({ name: m, revenue: Math.round(revenueMap[m]) }));
  };

  const revenueData = getMonthlyRevenueData();

  // CSV Export configuration
  const csvHeaders = [
    { key: 'vehicle_id', label: 'Vehicle ID' },
    { key: 'reg_number', label: 'Registration Number' },
    { key: 'total_distance_km', label: 'Total Transit Distance (km)' },
    { key: 'total_fuel_liters', label: 'Total Fuel Liters (L)' },
    { key: 'liters_per_100km', label: 'Efficiency (L/100km)' },
  ];

  const efficiencyColumns: ColumnDef<FuelEfficiency>[] = [
    {
      header: 'Vehicle ID',
      accessor: (eff) => <span className="font-semibold text-gray-400">#{eff.vehicle_id}</span>,
    },
    {
      header: 'Reg Number',
      accessor: (eff) => <span className="font-mono text-sm">{eff.reg_number}</span>,
    },
    {
      header: 'Odometer Covered',
      accessor: (eff) => <span>{eff.total_distance_km.toLocaleString()} km</span>,
    },
    {
      header: 'Fuel Consumed',
      accessor: (eff) => <span>{eff.total_fuel_liters.toLocaleString()} L</span>,
    },
    {
      header: 'Consumption Metric',
      accessor: (eff) => (
        <span className="font-bold text-accent">
          {eff.liters_per_100km} L / 100km
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Financial Analytics"
        description="Audit total fleet running costs, fuel consumption rates, and export CSV logs."
        actionSlot={
          <CSVExportButton
            data={efficiency}
            filename="fleet_fuel_efficiency_report"
            headers={csvHeaders}
            disabled={!efficiency || efficiency.length === 0}
          />
        }
      />

      {error && (
        <ErrorAlert
          message={
            error instanceof Error ? error.message : 'Failed to generate financial cost charts.'
          }
        />
      )}

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-12" />
      ) : (
        <>
          {/* 4 Financial KPI Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              label="Fuel Run-Cost"
              value={`$${(costs?.total_fuel_cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={<DollarSign className="w-5 h-5 text-status-ontrip" />}
            />
            <KPICard
              label="Maintenance Operations"
              value={`$${(costs?.total_maintenance_cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={<Landmark className="w-5 h-5 text-status-inshop" />}
            />
            <KPICard
              label="Tolls & Fees"
              value={`$${(costs?.total_expenses_cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={<Milestone className="w-5 h-5 text-gray-400" />}
            />
            <KPICard
              label="Grand Operational Total"
              value={`$${(costs?.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={<DollarSign className="w-5 h-5 text-status-available" />}
              trend={{
                value: 'Actual',
                isPositive: true,
              }}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Chart Area */}
            <div className="xl:col-span-2 space-y-4">
              <BarChart data={revenueData} />
            </div>

            {/* Drivers Performance Summary */}
            <div className="bg-panel border border-gray-800 rounded-lg p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                  <Shield className="w-5 h-5 text-status-available" />
                  <h3 className="font-bold text-gray-200 uppercase text-xs tracking-wider">
                    Operator Safety & Performance
                  </h3>
                </div>
                <div className="divide-y divide-gray-850 divide-gray-800">
                  {driversPerformance && driversPerformance.length > 0 ? (
                    driversPerformance.slice(0, 5).map((perf) => (
                      <div key={perf.driver_id} className="py-2.5 flex justify-between items-center text-sm">
                        <div>
                          <span className="font-semibold text-gray-200">{perf.name}</span>
                          <span className="block text-[10px] text-gray-500">
                            Completed: {perf.trips_completed} transits
                          </span>
                        </div>
                        <span className="font-bold text-status-available bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded text-xs">
                          {perf.safety_score} / 100
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 py-4">No driver metrics recorded.</p>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-gray-650 text-gray-500 border-t border-gray-800 pt-3 mt-4">
                Audit averages updated daily based on driving speeds and completion logs.
              </div>
            </div>
          </div>

          {/* Fuel Efficiency Table */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-200">Asset Running Fuel Efficiency</h2>
            <DataTable
              columns={efficiencyColumns}
              data={efficiency}
              isLoading={isLoading}
              emptyTitle="No efficiency stats recorded"
              emptyDescription="Complete transit trips to track average liters consumption rate per kilometer."
              keyExtractor={(eff) => eff.vehicle_id}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
