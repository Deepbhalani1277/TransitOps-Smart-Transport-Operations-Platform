import React, { useState } from 'react';
import {
  useVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
} from '../hooks/useVehicles';
import PageHeader from '../components/ui/PageHeader';
import DataTable, { type ColumnDef } from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import ErrorAlert from '../components/ui/ErrorAlert';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import type { Vehicle, VehicleCreate, VehicleStatus } from '../types';
import { Edit2, Trash2 } from 'lucide-react';

const Vehicles: React.FC = () => {
  // Query
  const { data: vehicles, isLoading, error: fetchError } = useVehicles();

  // Mutations
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();
  const deleteMutation = useDeleteVehicle();

  // Dialog / Modal triggers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Form states
  const [regNumber, setRegNumber] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('Heavy Duty Truck');
  const [maxCapacity, setMaxCapacity] = useState<number>(20000);
  const [odometer, setOdometer] = useState<number>(0);
  const [acquisitionCost, setAcquisitionCost] = useState<number>(100000);
  const [status, setStatus] = useState<VehicleStatus>('Available');
  const [region, setRegion] = useState('North');

  const [formError, setFormError] = useState('');

  // Handle Edit Action
  const handleOpenEdit = (v: Vehicle) => {
    setSelectedVehicle(v);
    setRegNumber(v.reg_number);
    setName(v.name);
    setType(v.type);
    setMaxCapacity(v.max_capacity_kg);
    setOdometer(v.odometer);
    setAcquisitionCost(v.acquisition_cost);
    setStatus(v.status);
    setRegion(v.region || 'North');
    setFormError('');
    setIsFormOpen(true);
  };

  // Handle Create Action
  const handleOpenCreate = () => {
    setSelectedVehicle(null);
    setRegNumber('');
    setName('');
    setType('Heavy Duty Truck');
    setMaxCapacity(20000);
    setOdometer(0);
    setAcquisitionCost(100000);
    setStatus('Available');
    setRegion('North');
    setFormError('');
    setIsFormOpen(true);
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!regNumber || !name || !type) {
      setFormError('Please fill out all required fields.');
      return;
    }

    const payload: VehicleCreate = {
      reg_number: regNumber,
      name,
      type,
      max_capacity_kg: Number(maxCapacity),
      odometer: Number(odometer),
      acquisition_cost: Number(acquisitionCost),
      status,
      region,
    };

    try {
      if (selectedVehicle) {
        await updateMutation.mutateAsync({ id: selectedVehicle.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      let msg = 'Failed to save vehicle details.';
      if (err.response && err.response.data && err.response.data.detail) {
        msg = err.response.data.detail;
      }
      setFormError(msg);
    }
  };

  // Handle Delete Action
  const handleConfirmDelete = async () => {
    if (!selectedVehicle) return;
    try {
      await deleteMutation.mutateAsync(selectedVehicle.id);
    } catch (err: any) {
      alert(
        err.response?.data?.detail || 'An error occurred while deleting the vehicle.'
      );
    }
  };

  const columns: ColumnDef<Vehicle>[] = [
    {
      header: 'Vehicle Name',
      accessor: (v) => (
        <div>
          <span className="font-semibold text-gray-150 text-gray-100">{v.name}</span>
          <p className="text-xs text-gray-500">{v.type}</p>
        </div>
      ),
    },
    {
      header: 'Reg Number',
      accessor: (v) => <span className="font-mono text-sm">{v.reg_number}</span>,
    },
    {
      header: 'Capacity',
      accessor: (v) => <span>{v.max_capacity_kg.toLocaleString()} kg</span>,
    },
    {
      header: 'Odometer',
      accessor: (v) => <span>{v.odometer.toLocaleString()} km</span>,
    },
    {
      header: 'Region',
      accessor: (v) => <span>{v.region || '—'}</span>,
    },
    {
      header: 'Status',
      accessor: (v) => <StatusBadge status={v.status} />,
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      accessor: (v) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleOpenEdit(v)}
            className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-accent transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedVehicle(v);
              setIsDeleteOpen(true);
            }}
            className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Registry"
        description="View and manage the active vehicles across regional hubs."
        actionSlot={
          <button
            onClick={handleOpenCreate}
            className="bg-accent hover:bg-amber-700 text-white font-semibold text-sm px-4 py-2.5 rounded-md transition-colors"
          >
            + Add Vehicle
          </button>
        }
      />

      {fetchError && (
        <ErrorAlert
          message={
            fetchError instanceof Error
              ? fetchError.message
              : 'Failed to retrieve vehicle list.'
          }
        />
      )}

      <DataTable
        columns={columns}
        data={vehicles}
        isLoading={isLoading}
        emptyTitle="No vehicles found"
        emptyDescription="Get started by registering the first transit asset."
        keyExtractor={(v) => v.id}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedVehicle ? 'Edit Vehicle details' : 'Register New Vehicle'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <ErrorAlert message={formError} onDismiss={() => setFormError('')} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Registration Number" required>
              <input
                type="text"
                required
                placeholder="TX-1234-OP"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-250 text-gray-200 focus:border-accent focus:outline-none"
              />
            </FormField>

            <FormField label="Vehicle Name" required>
              <input
                type="text"
                required
                placeholder="Volvo FH16"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-250 text-gray-200 focus:border-accent focus:outline-none"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Vehicle Type" required>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
              >
                <option value="Heavy Duty Truck">Heavy Duty Truck</option>
                <option value="Light Duty Truck">Light Duty Truck</option>
                <option value="Van">Cargo Van</option>
              </select>
            </FormField>

            <FormField label="Max Capacity (kg)" required>
              <input
                type="number"
                required
                min={0}
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-250 text-gray-200 focus:border-accent focus:outline-none"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Odometer (km)" required>
              <input
                type="number"
                required
                min={0}
                value={odometer}
                onChange={(e) => setOdometer(Number(e.target.value))}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-250 text-gray-200 focus:border-accent focus:outline-none"
              />
            </FormField>

            <FormField label="Acquisition Cost ($)" required>
              <input
                type="number"
                required
                min={0}
                value={acquisitionCost}
                onChange={(e) => setAcquisitionCost(Number(e.target.value))}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-250 text-gray-200 focus:border-accent focus:outline-none"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Operational Status" required>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
              >
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="In Shop">In Shop</option>
                <option value="Retired">Retired</option>
              </select>
            </FormField>

            <FormField label="Region" required>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
              >
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-accent hover:bg-amber-700 rounded-md transition-colors"
            >
              {selectedVehicle ? 'Save Changes' : 'Register Vehicle'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to delete vehicle "${selectedVehicle?.name}" (${selectedVehicle?.reg_number})? This action cannot be undone.`}
      />
    </div>
  );
};

export default Vehicles;
