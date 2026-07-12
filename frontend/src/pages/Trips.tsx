import React, { useState } from 'react';
import {
  useTrips,
  useCreateTrip,
  useDispatchTrip,
  useCompleteTrip,
  useUpdateTrip,
} from '../hooks/useTrips';
import { useVehicles } from '../hooks/useVehicles';
import { useDrivers } from '../hooks/useDrivers';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import TripStepper from '../components/ui/TripStepper';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import ErrorAlert from '../components/ui/ErrorAlert';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import type { Trip } from '../types';
import { MapPin, Compass, CheckCircle, XCircle } from 'lucide-react';

const Trips: React.FC = () => {
  // Query
  const { data: trips, isLoading: tripsLoading, error: tripsError } = useTrips();
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { data: drivers, isLoading: driversLoading } = useDrivers();

  // Mutations
  const createMutation = useCreateTrip();
  const dispatchMutation = useDispatchTrip();
  const completeMutation = useCompleteTrip();
  const cancelMutation = useUpdateTrip(); // Cancel is simply PATCH status: 'Cancelled'

  // Selection for stepper & details
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Form triggers
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  // Create Form fields
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleId, setVehicleId] = useState<string>('');
  const [driverId, setDriverId] = useState<string>('');
  const [cargoWeight, setCargoWeight] = useState<number>(0);
  const [plannedDistance, setPlannedDistance] = useState<number>(0);

  // Complete Form fields
  const [actualDistance, setActualDistance] = useState<number>(0);
  const [fuelConsumed, setFuelConsumed] = useState<number>(0);

  const [formError, setFormError] = useState('');
  const [dispatchError, setDispatchError] = useState('');

  // Client-side filtering: Get available vehicles/drivers
  // If we are editing, we can include the currently assigned vehicle/driver in the dropdown
  const availableVehicles = vehicles?.filter((v) => v.status === 'Available') || [];
  const availableDrivers = drivers?.filter((d) => d.status === 'Available') || [];

  // Selected vehicle details for live weight verification
  const selectedVehicleObj = vehicles?.find((v) => v.id === Number(vehicleId));
  const capacityLimit = selectedVehicleObj?.max_capacity_kg || 0;
  const isCapacityExceeded = cargoWeight > capacityLimit && capacityLimit > 0;

  const handleOpenCreate = () => {
    setSource('');
    setDestination('');
    setVehicleId('');
    setDriverId('');
    setCargoWeight(0);
    setPlannedDistance(0);
    setFormError('');
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!source || !destination || !vehicleId || !driverId) {
      setFormError('Please complete all form fields.');
      return;
    }

    if (isCapacityExceeded) {
      setFormError('Cargo weight exceeds the maximum capacity of the selected vehicle.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        source,
        destination,
        vehicle_id: Number(vehicleId),
        driver_id: Number(driverId),
        cargo_weight_kg: Number(cargoWeight),
        planned_distance_km: Number(plannedDistance),
      });
      setIsCreateOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.detail || 'Failed to construct trip draft.');
    }
  };

  const handleDispatch = async (trip: Trip) => {
    setDispatchError('');
    try {
      const updated = await dispatchMutation.mutateAsync(trip.id);
      setSelectedTrip(updated);
    } catch (err: any) {
      setDispatchError(err.response?.data?.detail || 'Failed to dispatch transit route.');
    }
  };

  const handleOpenComplete = (trip: Trip) => {
    setSelectedTrip(trip);
    setActualDistance(trip.planned_distance_km);
    setFuelConsumed(0);
    setFormError('');
    setIsCompleteOpen(true);
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip) return;
    setFormError('');

    try {
      const updated = await completeMutation.mutateAsync({
        id: selectedTrip.id,
        data: {
          actual_distance_km: Number(actualDistance),
          fuel_consumed_l: Number(fuelConsumed),
        },
      });
      setSelectedTrip(updated);
      setIsCompleteOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.detail || 'Failed to log completion stats.');
    }
  };

  const handleCancel = async (trip: Trip) => {
    setDispatchError('');
    try {
      const updated = await cancelMutation.mutateAsync({
        id: trip.id,
        data: { status: 'Cancelled' },
      });
      setSelectedTrip(updated);
    } catch (err: any) {
      setDispatchError(err.response?.data?.detail || 'Failed to cancel the trip.');
    }
  };

  const isLoading = tripsLoading || vehiclesLoading || driversLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trip Dispatcher"
        description="Monitor cargo transits, validate capacity specifications, and execute route status shifts."
        actionSlot={
          <button
            onClick={handleOpenCreate}
            className="bg-accent hover:bg-amber-700 text-white font-semibold text-sm px-4 py-2.5 rounded-md transition-colors"
          >
            + Create Trip Draft
          </button>
        }
      />

      {dispatchError && (
        <ErrorAlert message={dispatchError} onDismiss={() => setDispatchError('')} />
      )}

      {/* Selected Trip Stepper Area */}
      {selectedTrip && (
        <div className="bg-panel border border-gray-800 p-6 rounded-lg space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <div>
              <span className="text-xs font-semibold text-gray-500">Selected Route</span>
              <h3 className="text-lg font-bold text-gray-200">
                {selectedTrip.source} &rarr; {selectedTrip.destination}
              </h3>
            </div>
            <div className="flex gap-2">
              {selectedTrip.status === 'Draft' && (
                <button
                  onClick={() => handleDispatch(selectedTrip)}
                  className="flex items-center gap-1.5 bg-accent hover:bg-amber-700 text-white font-semibold text-xs px-3 py-1.5 rounded"
                >
                  <Compass className="w-3.5 h-3.5" />
                  Dispatch
                </button>
              )}
              {selectedTrip.status === 'Dispatched' && (
                <button
                  onClick={() => handleOpenComplete(selectedTrip)}
                  className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-3 py-1.5 rounded"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Complete
                </button>
              )}
              {(selectedTrip.status === 'Draft' || selectedTrip.status === 'Dispatched') && (
                <button
                  onClick={() => handleCancel(selectedTrip)}
                  className="flex items-center gap-1.5 bg-red-650 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-3 py-1.5 rounded"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Cancel
                </button>
              )}
            </div>
          </div>
          <TripStepper status={selectedTrip.status} />
        </div>
      )}

      {/* Live Board Grid */}
      {isLoading ? (
        <LoadingSpinner size="lg" className="py-12" />
      ) : tripsError ? (
        <ErrorAlert message={tripsError instanceof Error ? tripsError.message : 'Error loading trips.'} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips && trips.length > 0 ? (
            trips.map((trip) => {
              const vehicle = vehicles?.find((v) => v.id === trip.vehicle_id);
              const driver = drivers?.find((d) => d.id === trip.driver_id);
              const isSelected = selectedTrip?.id === trip.id;

              return (
                <div
                  key={trip.id}
                  onClick={() => setSelectedTrip(trip)}
                  className={`bg-panel border rounded-lg p-5 space-y-4 cursor-pointer hover:border-gray-600 transition-all ${
                    isSelected ? 'border-accent shadow-md ring-2 ring-accent/10' : 'border-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-gray-500">TRIP #{trip.id}</span>
                    <StatusBadge status={trip.status} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="font-semibold text-gray-200 truncate">
                        {trip.source} &rarr; {trip.destination}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div>
                        <span className="block text-gray-550 text-gray-500">VEHICLE</span>
                        <span className="text-gray-300 font-medium truncate block">
                          {vehicle ? vehicle.name : `ID: ${trip.vehicle_id}`}
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-550 text-gray-500">OPERATOR</span>
                        <span className="text-gray-300 font-medium truncate block">
                          {driver ? driver.name : `ID: ${trip.driver_id}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-3 flex justify-between text-xs text-gray-500">
                    <span>Cargo: {trip.cargo_weight_kg.toLocaleString()} kg</span>
                    <span>Distance: {trip.planned_distance_km} km</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-sm text-gray-500 border border-dashed border-gray-800 rounded-lg">
              No trips recorded. Draft a new route schedule above.
            </div>
          )}
        </div>
      )}

      {/* Create Trip Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Trip Draft">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {formError && <ErrorAlert message={formError} onDismiss={() => setFormError('')} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Source Hub" required>
              <input
                type="text"
                required
                placeholder="New York, NY"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-250 text-gray-200 focus:border-accent focus:outline-none"
              />
            </FormField>

            <FormField label="Destination Hub" required>
              <input
                type="text"
                required
                placeholder="Boston, MA"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-250 text-gray-200 focus:border-accent focus:outline-none"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Assign Vehicle" required>
              <select
                required
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
              >
                <option value="">Choose Available Asset...</option>
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.reg_number}) - Cap: {v.max_capacity_kg.toLocaleString()}kg
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Assign Operator" required>
              <select
                required
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
              >
                <option value="">Choose Available Operator...</option>
                {availableDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} (Safety: {d.safety_score})
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Cargo Weight (kg)" required>
              <input
                type="number"
                required
                min={0}
                value={cargoWeight}
                onChange={(e) => setCargoWeight(Number(e.target.value))}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-250 text-gray-200 focus:border-accent focus:outline-none"
              />
              {capacityLimit > 0 && (
                <div className="flex justify-between items-center text-[10px] mt-1 font-medium">
                  <span className="text-gray-500">Vehicle Limit: {capacityLimit.toLocaleString()}kg</span>
                  {isCapacityExceeded && (
                    <span className="text-red-400 font-bold">Limit Exceeded</span>
                  )}
                </div>
              )}
            </FormField>

            <FormField label="Planned Distance (km)" required>
              <input
                type="number"
                required
                min={0}
                value={plannedDistance}
                onChange={(e) => setPlannedDistance(Number(e.target.value))}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-250 text-gray-200 focus:border-accent focus:outline-none"
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || isCapacityExceeded}
              className="px-4 py-2 text-sm font-semibold text-white bg-accent hover:bg-amber-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>
          </div>
        </form>
      </Modal>

      {/* Complete Trip Modal */}
      <Modal isOpen={isCompleteOpen} onClose={() => setIsCompleteOpen(false)} title="Log Trip Completion Stats">
        <form onSubmit={handleCompleteSubmit} className="space-y-4">
          {formError && <ErrorAlert message={formError} onDismiss={() => setFormError('')} />}

          <FormField label="Actual Odometer Distance (km)" required>
            <input
              type="number"
              required
              min={0}
              value={actualDistance}
              onChange={(e) => setActualDistance(Number(e.target.value))}
              className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-255 text-gray-200 focus:border-accent focus:outline-none"
            />
          </FormField>

          <FormField label="Fuel Consumed (Liters)" required>
            <input
              type="number"
              required
              min={0}
              value={fuelConsumed}
              onChange={(e) => setFuelConsumed(Number(e.target.value))}
              className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-255 text-gray-200 focus:border-accent focus:outline-none"
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={() => setIsCompleteOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={completeMutation.isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              Log Completion
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Trips;
