import React, { useState } from 'react';
import {
  useDrivers,
  useCreateDriver,
  useUpdateDriver,
  useDeleteDriver,
} from '../hooks/useDrivers';
import PageHeader from '../components/ui/PageHeader';
import DataTable, { type ColumnDef } from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import ErrorAlert from '../components/ui/ErrorAlert';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import type { Driver, DriverCreate, DriverStatus } from '../types';
import { Edit2, Trash2, AlertOctagon } from 'lucide-react';

const Drivers: React.FC = () => {
  // Query
  const { data: drivers, isLoading, error: fetchError } = useDrivers();

  // Mutations
  const createMutation = useCreateDriver();
  const updateMutation = useUpdateDriver();
  const deleteMutation = useDeleteDriver();

  // Dialog triggers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseCategory, setLicenseCategory] = useState('Class A CDL');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [contact, setContact] = useState('');
  const [safetyScore, setSafetyScore] = useState<number>(100);
  const [status, setStatus] = useState<DriverStatus>('Available');

  const [formError, setFormError] = useState('');

  // Expired license validation checker (compare with 2026-07-12)
  const isLicenseExpired = (expiryDateStr: string) => {
    if (!expiryDateStr) return false;
    const expiry = new Date(expiryDateStr);
    const today = new Date('2026-07-12');
    return expiry < today;
  };

  // Open Form for Edit
  const handleOpenEdit = (d: Driver) => {
    setSelectedDriver(d);
    setName(d.name);
    setLicenseNumber(d.license_number);
    setLicenseCategory(d.license_category);
    setLicenseExpiry(d.license_expiry);
    setContact(d.contact);
    setSafetyScore(d.safety_score);
    setStatus(d.status);
    setFormError('');
    setIsFormOpen(true);
  };

  // Open Form for Create
  const handleOpenCreate = () => {
    setSelectedDriver(null);
    setName('');
    setLicenseNumber('');
    setLicenseCategory('Class A CDL');
    setLicenseExpiry('');
    setContact('');
    setSafetyScore(100);
    setStatus('Available');
    setFormError('');
    setIsFormOpen(true);
  };

  // Submit Driver Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name || !licenseNumber || !licenseExpiry || !contact) {
      setFormError('Please fill out all required fields.');
      return;
    }

    const payload: DriverCreate = {
      name,
      license_number: licenseNumber,
      license_category: licenseCategory,
      license_expiry: licenseExpiry,
      contact,
      safety_score: Number(safetyScore),
      status,
    };

    try {
      if (selectedDriver) {
        await updateMutation.mutateAsync({ id: selectedDriver.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      let msg = 'Failed to save driver details.';
      if (err.response && err.response.data && err.response.data.detail) {
        msg = err.response.data.detail;
      }
      setFormError(msg);
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!selectedDriver) return;
    try {
      await deleteMutation.mutateAsync(selectedDriver.id);
    } catch (err: any) {
      alert(
        err.response?.data?.detail || 'An error occurred while deleting the driver record.'
      );
    }
  };

  // Toggle status quick actions
  const handleQuickStatusChange = async (d: Driver, newStatus: DriverStatus) => {
    try {
      await updateMutation.mutateAsync({
        id: d.id,
        data: { status: newStatus },
      });
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update driver status.');
    }
  };

  const columns: ColumnDef<Driver>[] = [
    {
      header: 'Driver Name',
      accessor: (d) => {
        const expired = isLicenseExpired(d.license_expiry);
        return (
          <div className="flex items-center gap-2">
            <div>
              <span className="font-semibold text-gray-100">{d.name}</span>
              <p className="text-xs text-gray-500">{d.contact}</p>
            </div>
            {expired && (
              <span
                className="flex items-center gap-1 rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/20"
                title="License Expired"
              >
                <AlertOctagon className="w-3 h-3 text-red-500" />
                EXPIRED
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'License Details',
      accessor: (d) => {
        const expired = isLicenseExpired(d.license_expiry);
        return (
          <div>
            <span className="font-mono text-sm">{d.license_number}</span>
            <p className={`text-xs ${expired ? 'text-red-400 font-medium' : 'text-gray-550 text-gray-400'}`}>
              Expires: {d.license_expiry} ({d.license_category})
            </p>
          </div>
        );
      },
    },
    {
      header: 'Safety Score',
      accessor: (d) => {
        const score = d.safety_score;
        let color = 'text-green-400';
        if (score < 75) color = 'text-red-400';
        else if (score < 90) color = 'text-amber-400';

        return (
          <div>
            <span className={`font-bold ${color}`}>{score}</span>
            <span className="text-xs text-gray-500"> / 100</span>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: (d) => <StatusBadge status={d.status} />,
    },
    {
      header: 'Quick Toggle Status',
      accessor: (d) => (
        <div className="flex gap-1.5">
          {d.status !== 'Available' && (
            <button
              onClick={() => handleQuickStatusChange(d, 'Available')}
              className="text-[10px] bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-status-available font-bold px-2 py-1 rounded"
            >
              Available
            </button>
          )}
          {d.status !== 'Off Duty' && (
            <button
              onClick={() => handleQuickStatusChange(d, 'Off Duty')}
              className="text-[10px] bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-status-offduty font-bold px-2 py-1 rounded"
            >
              Off Duty
            </button>
          )}
          {d.status !== 'Suspended' && (
            <button
              onClick={() => handleQuickStatusChange(d, 'Suspended')}
              className="text-[10px] bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-status-suspended font-bold px-2 py-1 rounded"
            >
              Suspend
            </button>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      accessor: (d) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleOpenEdit(d)}
            className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-accent transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedDriver(d);
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
        title="Driver Management"
        description="Verify driver license statuses, safety credentials, and toggle shifts."
        actionSlot={
          <button
            onClick={handleOpenCreate}
            className="bg-accent hover:bg-amber-700 text-white font-semibold text-sm px-4 py-2.5 rounded-md transition-colors"
          >
            + Add Driver
          </button>
        }
      />

      {fetchError && (
        <ErrorAlert
          message={
            fetchError instanceof Error
              ? fetchError.message
              : 'Failed to retrieve operator profiles.'
          }
        />
      )}

      <DataTable
        columns={columns}
        data={drivers}
        isLoading={isLoading}
        emptyTitle="No drivers found"
        emptyDescription="Create operator entries to dispatch routes."
        keyExtractor={(d) => d.id}
      />

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedDriver ? 'Edit Operator Profile' : 'Register New Operator'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <ErrorAlert message={formError} onDismiss={() => setFormError('')} />}

          <FormField label="Full Name" required>
            <input
              type="text"
              required
              placeholder="Alice Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-200 focus:border-accent focus:outline-none"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="License Number" required>
              <input
                type="text"
                required
                placeholder="DL-987654321"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-200 focus:border-accent focus:outline-none"
              />
            </FormField>

            <FormField label="License Category" required>
              <select
                value={licenseCategory}
                onChange={(e) => setLicenseCategory(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
              >
                <option value="Class A CDL">Class A CDL (Heavy Combinations)</option>
                <option value="Class B CDL">Class B CDL (Single Heavy Trucks)</option>
                <option value="Class C CDL">Class C CDL (Light Delivery / Passenger)</option>
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="License Expiry" required>
              <input
                type="date"
                required
                value={licenseExpiry}
                onChange={(e) => setLicenseExpiry(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
              />
            </FormField>

            <FormField label="Contact Info" required>
              <input
                type="text"
                required
                placeholder="+1-555-0199"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-200 focus:border-accent focus:outline-none"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Safety Performance Score (0-100)" required>
              <input
                type="number"
                required
                min={0}
                max={100}
                value={safetyScore}
                onChange={(e) => setSafetyScore(Number(e.target.value))}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-200 focus:border-accent focus:outline-none"
              />
            </FormField>

            <FormField label="Availability Status" required>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DriverStatus)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
              >
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Off Duty">Off Duty</option>
                <option value="Suspended">Suspended</option>
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
              {selectedDriver ? 'Save Changes' : 'Register Operator'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Operator Record"
        message={`Are you sure you want to delete driver "${selectedDriver?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Drivers;
