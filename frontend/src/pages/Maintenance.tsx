import React, { useState } from 'react';
import {
  useMaintenanceLogs,
  useCreateMaintenance,
  useUpdateMaintenance,
} from '../hooks/useMaintenance';
import { useVehicles } from '../hooks/useVehicles';
import PageHeader from '../components/ui/PageHeader';
import DataTable, { type ColumnDef } from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import ErrorAlert from '../components/ui/ErrorAlert';
import type { MaintenanceLog } from '../types';
import { Lock } from 'lucide-react';

const Maintenance: React.FC = () => {
  // Query
  const { data: logs, isLoading: logsLoading, error: logsError } = useMaintenanceLogs();
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();

  // Mutations
  const createMutation = useCreateMaintenance();
  const updateMutation = useUpdateMaintenance();

  // Dialog triggers
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form fields
  const [vehicleId, setVehicleId] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [cost, setCost] = useState<number>(0);
  const [date, setDate] = useState('');

  const [formError, setFormError] = useState('');

  const handleOpenCreate = () => {
    setVehicleId('');
    setServiceType('');
    setCost(0);
    setDate('');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!vehicleId || !serviceType || cost < 0 || !date) {
      setFormError('Please complete all form fields.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        vehicle_id: Number(vehicleId),
        service_type: serviceType,
        cost: Number(cost),
        date,
        status: 'Active',
      });
      setIsFormOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.detail || 'Failed to submit maintenance log entry.');
    }
  };

  const handleCloseLog = async (logId: number) => {
    try {
      await updateMutation.mutateAsync({
        id: logId,
        data: { status: 'Closed' },
      });
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to close maintenance event.');
    }
  };

  const columns: ColumnDef<MaintenanceLog>[] = [
    {
      header: 'Vehicle Asset',
      accessor: (log) => {
        const vehicle = vehicles?.find((v) => v.id === log.vehicle_id);
        return (
          <div>
            <span className="font-semibold text-gray-100">
              {vehicle ? vehicle.name : `ID: ${log.vehicle_id}`}
            </span>
            {vehicle && <p className="text-xs text-gray-500">{vehicle.reg_number}</p>}
          </div>
        );
      },
    },
    {
      header: 'Service Action',
      accessor: (log) => <span>{log.service_type}</span>,
    },
    {
      header: 'Expenditure',
      accessor: (log) => <span>${log.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>,
    },
    {
      header: 'Service Date',
      accessor: (log) => <span>{log.date}</span>,
    },
    {
      header: 'Status',
      accessor: (log) => <StatusBadge status={log.status} />,
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      accessor: (log) => {
        if (log.status === 'Active') {
          return (
            <button
              onClick={() => handleCloseLog(log.id)}
              disabled={updateMutation.isPending}
              className="bg-accent hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded transition-colors disabled:opacity-50"
            >
              Close Log
            </button>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-xs text-gray-600 font-semibold uppercase pr-3 select-none">
            <Lock className="w-3.5 h-3.5" />
            Closed
          </span>
        );
      },
    },
  ];

  const isLoading = logsLoading || vehiclesLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Log Registry"
        description="Monitor vehicle repairs, service costs, and finalize active workshop events."
        actionSlot={
          <button
            onClick={handleOpenCreate}
            className="bg-accent hover:bg-amber-700 text-white font-semibold text-sm px-4 py-2.5 rounded-md transition-colors"
          >
            + Log Workshop Service
          </button>
        }
      />

      {logsError && (
        <ErrorAlert
          message={
            logsError instanceof Error
              ? logsError.message
              : 'Failed to retrieve workshop log database.'
          }
        />
      )}

      <DataTable
        columns={columns}
        data={logs}
        isLoading={isLoading}
        emptyTitle="No maintenance logs logged"
        emptyDescription="Schedule a workshop event to track asset health diagnostics."
        keyExtractor={(log) => log.id}
      />

      {/* Add Log Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Log Workshop Service Event">
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <ErrorAlert message={formError} onDismiss={() => setFormError('')} />}

          <FormField label="Target Vehicle Asset" required>
            <select
              required
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
            >
              <option value="">Select Asset...</option>
              {vehicles?.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.reg_number})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Service Performed / Diagnostic Type" required>
            <input
              type="text"
              required
              placeholder="e.g. Engine Oil Change, Brake Replacement"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-250 text-gray-200 focus:border-accent focus:outline-none"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Service Cost ($)" required>
              <input
                type="number"
                required
                min={0}
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-250 text-gray-200 focus:border-accent focus:outline-none"
              />
            </FormField>

            <FormField label="Service Date" required>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
              />
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
              disabled={createMutation.isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-accent hover:bg-amber-700 rounded-md transition-colors"
            >
              Log Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Maintenance;
