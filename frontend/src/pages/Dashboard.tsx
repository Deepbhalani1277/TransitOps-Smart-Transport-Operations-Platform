import React, { useState } from 'react';
import { useDashboardKpis } from '../hooks/useReports';
import { useTrips } from '../hooks/useTrips';
import { useVehicles } from '../hooks/useVehicles';
import PageHeader from '../components/ui/PageHeader';
import KPICard from '../components/ui/KPICard';
import FilterBar from '../components/ui/FilterBar';
import StatusBadge from '../components/ui/StatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { Truck, Compass, Wrench, Users, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Filters state
  const [vehicleType, setVehicleType] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  // Fetch KPI data (calls reports service, fallback derives client-side if 404)
  const { data: kpis, isLoading: kpisLoading, error: kpisError } = useDashboardKpis();

  // Fetch Trips for the Recent Trips table
  const { data: trips, isLoading: tripsLoading, error: tripsError } = useTrips();

  // Fetch Vehicles to display the status bar breakdown
  const { data: vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useVehicles();

  const handleClearFilters = () => {
    setVehicleType('');
    setStatusFilter('');
    setRegionFilter('');
  };

  const isLoading = kpisLoading || tripsLoading || vehiclesLoading;
  const error = kpisError || tripsError || vehiclesError;

  // Filter local lists for visualization based on dropdown selections
  const filteredVehicles = vehicles?.filter((v) => {
    if (vehicleType && v.type !== vehicleType) return false;
    if (statusFilter && v.status !== statusFilter) return false;
    if (regionFilter && v.region !== regionFilter) return false;
    return true;
  });

  const recentTrips = trips ? [...trips].sort((a, b) => b.id - a.id).slice(0, 5) : [];

  // Status breakdown calculations
  const totalVehiclesCount = filteredVehicles?.length || 0;
  const statusCounts = {
    Available: filteredVehicles?.filter((v) => v.status === 'Available').length || 0,
    'On Trip': filteredVehicles?.filter((v) => v.status === 'On Trip').length || 0,
    'In Shop': filteredVehicles?.filter((v) => v.status === 'In Shop').length || 0,
    Retired: filteredVehicles?.filter((v) => v.status === 'Retired').length || 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations Dashboard"
        description="Real-time operational summary, metrics overview, and fleet tracking."
      />

      {error && (
        <ErrorAlert
          message={
            error instanceof Error
              ? error.message
              : 'An error occurred while fetching operational data.'
          }
        />
      )}

      {/* Filter Bar */}
      <FilterBar
        fields={[
          {
            name: 'vehicleType',
            placeholder: 'All Vehicle Types',
            value: vehicleType,
            onChange: setVehicleType,
            options: [
              { value: 'Heavy Duty Truck', label: 'Heavy Duty Truck' },
              { value: 'Light Duty Truck', label: 'Light Duty Truck' },
              { value: 'Van', label: 'Cargo Van' },
            ],
          },
          {
            name: 'status',
            placeholder: 'All Statuses',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'Available', label: 'Available' },
              { value: 'On Trip', label: 'On Trip' },
              { value: 'In Shop', label: 'In Shop' },
              { value: 'Retired', label: 'Retired' },
            ],
          },
          {
            name: 'region',
            placeholder: 'All Regions',
            value: regionFilter,
            onChange: setRegionFilter,
            options: [
              { value: 'North', label: 'North' },
              { value: 'South', label: 'South' },
              { value: 'East', label: 'East' },
              { value: 'West', label: 'West' },
            ],
          },
        ]}
        onClear={handleClearFilters}
      />

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-12" />
      ) : (
        <>
          {/* 7 KPI Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              label="Active Vehicles"
              value={kpis?.activeVehicles ?? 0}
              icon={<Truck className="w-5 h-5 text-status-ontrip" />}
            />
            <KPICard
              label="Available Vehicles"
              value={kpis?.availableVehicles ?? 0}
              icon={<CheckCircle className="w-5 h-5 text-status-available" />}
            />
            <KPICard
              label="Vehicles In Maintenance"
              value={kpis?.vehiclesInMaintenance ?? 0}
              icon={<Wrench className="w-5 h-5 text-status-inshop" />}
            />
            <KPICard
              label="Active Trips"
              value={kpis?.activeTrips ?? 0}
              icon={<Compass className="w-5 h-5 text-status-ontrip animate-spin" style={{ animationDuration: '6s' }} />}
            />
            <KPICard
              label="Pending Trips"
              value={kpis?.pendingTrips ?? 0}
              icon={<Activity className="w-5 h-5 text-gray-400" />}
            />
            <KPICard
              label="Drivers On Duty"
              value={kpis?.driversOnDuty ?? 0}
              icon={<Users className="w-5 h-5 text-status-available" />}
            />
            <KPICard
              label="Fleet Utilization"
              value={`${kpis?.fleetUtilization ?? 0}%`}
              icon={<AlertTriangle className="w-5 h-5 text-accent" />}
              trend={{
                value: 'Optimal',
                isPositive: (kpis?.fleetUtilization ?? 0) > 70,
              }}
            />
          </div>

          {/* Vehicle Status Breakdown Bar */}
          <div className="bg-panel border border-gray-800 p-6 rounded-lg space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-300">Fleet Status Breakdown</span>
              <span className="text-xs text-gray-500">{totalVehiclesCount} Total Vehicles</span>
            </div>
            {totalVehiclesCount > 0 ? (
              <div>
                <div className="flex h-3 rounded-full overflow-hidden bg-gray-900 border border-gray-800">
                  <div
                    style={{ width: `${(statusCounts.Available / totalVehiclesCount) * 100}%` }}
                    className="bg-status-available"
                    title={`Available: ${statusCounts.Available}`}
                  />
                  <div
                    style={{ width: `${(statusCounts['On Trip'] / totalVehiclesCount) * 100}%` }}
                    className="bg-status-ontrip"
                    title={`On Trip: ${statusCounts['On Trip']}`}
                  />
                  <div
                    style={{ width: `${(statusCounts['In Shop'] / totalVehiclesCount) * 100}%` }}
                    className="bg-status-inshop"
                    title={`In Shop: ${statusCounts['In Shop']}`}
                  />
                  <div
                    style={{ width: `${(statusCounts.Retired / totalVehiclesCount) * 100}%` }}
                    className="bg-status-retired"
                    title={`Retired: ${statusCounts.Retired}`}
                  />
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400 justify-start">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-available" />
                    Available ({statusCounts.Available})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-ontrip" />
                    On Trip ({statusCounts['On Trip']})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-inshop" />
                    In Shop ({statusCounts['In Shop']})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-retired" />
                    Retired ({statusCounts.Retired})
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">No vehicles registered in system yet.</p>
            )}
          </div>

          {/* Recent Trips Table */}
          <div className="bg-panel border border-gray-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/30">
              <h2 className="font-semibold text-gray-200">Recent Dispatched Trips</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Trip ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Cargo Weight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Distance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
                  {recentTrips.length > 0 ? (
                    recentTrips.map((trip) => (
                      <tr key={trip.id} className="hover:bg-gray-900/20">
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-gray-500">
                          #{trip.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {trip.source} &rarr; {trip.destination}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {trip.cargo_weight_kg.toLocaleString()} kg
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {trip.planned_distance_km} km
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={trip.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                        No recent trips logged.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
