import React, { useState } from 'react';
import {
  useFuelLogs,
  useCreateFuelLog,
  useExpenses,
  useCreateExpense,
} from '../hooks/useFuelExpenses';
import { useVehicles } from '../hooks/useVehicles';
import { useTrips } from '../hooks/useTrips';
import { useCostBreakdown } from '../hooks/useReports';
import PageHeader from '../components/ui/PageHeader';
import DataTable, { type ColumnDef } from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import ErrorAlert from '../components/ui/ErrorAlert';
import KPICard from '../components/ui/KPICard';
import type { FuelLog, Expense, ExpenseType } from '../types';
import { DollarSign, Landmark } from 'lucide-react';

const FuelExpense: React.FC = () => {
  // Queries
  const { data: fuelLogs, isLoading: fuelLoading, error: fuelError } = useFuelLogs();
  const { data: expenses, isLoading: expLoading, error: expError } = useExpenses();
  const { data: vehicles } = useVehicles();
  const { data: trips } = useTrips();
  
  // Total costs KPI from Reports Cost Breakdown
  const { data: costBreakdown, isLoading: costLoading } = useCostBreakdown();

  // Mutations
  const createFuelLogMutation = useCreateFuelLog();
  const createExpenseMutation = useCreateExpense();

  // Dialog triggers
  const [isFuelOpen, setIsFuelOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  // Fuel Log fields
  const [fuelVehicleId, setFuelVehicleId] = useState('');
  const [fuelTripId, setFuelTripId] = useState('');
  const [fuelLiters, setFuelLiters] = useState<number>(0);
  const [fuelCost, setFuelCost] = useState<number>(0);
  const [fuelDate, setFuelDate] = useState('');

  // Expense fields
  const [expVehicleId, setExpVehicleId] = useState('');
  const [expTripId, setExpTripId] = useState('');
  const [expType, setExpType] = useState<ExpenseType>('Toll');
  const [expAmount, setExpAmount] = useState<number>(0);
  const [expDate, setExpDate] = useState('');

  const [fuelFormError, setFuelFormError] = useState('');
  const [expFormError, setExpFormError] = useState('');

  // Open Handlers
  const handleOpenFuel = () => {
    setFuelVehicleId('');
    setFuelTripId('');
    setFuelLiters(0);
    setFuelCost(0);
    setFuelDate('');
    setFuelFormError('');
    setIsFuelOpen(true);
  };

  const handleOpenExpense = () => {
    setExpVehicleId('');
    setExpTripId('');
    setExpType('Toll');
    setExpAmount(0);
    setExpDate('');
    setExpFormError('');
    setIsExpenseOpen(true);
  };

  // Submit Handlers
  const handleFuelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFuelFormError('');

    if (!fuelVehicleId || fuelLiters <= 0 || fuelCost <= 0 || !fuelDate) {
      setFuelFormError('Please complete all form fields.');
      return;
    }

    try {
      await createFuelLogMutation.mutateAsync({
        vehicle_id: Number(fuelVehicleId),
        trip_id: fuelTripId ? Number(fuelTripId) : null,
        liters: Number(fuelLiters),
        cost: Number(fuelCost),
        date: fuelDate,
      });
      setIsFuelOpen(false);
    } catch (err: any) {
      setFuelFormError(err.response?.data?.detail || 'Failed to submit fuel log entry.');
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setExpFormError('');

    if (!expVehicleId || expAmount <= 0 || !expDate) {
      setExpFormError('Please complete all form fields.');
      return;
    }

    try {
      await createExpenseMutation.mutateAsync({
        vehicle_id: Number(expVehicleId),
        trip_id: expTripId ? Number(expTripId) : null,
        type: expType,
        amount: Number(expAmount),
        date: expDate,
      });
      setIsExpenseOpen(false);
    } catch (err: any) {
      setExpFormError(err.response?.data?.detail || 'Failed to log expense entry.');
    }
  };

  const error = fuelError || expError;
  const isTableLoading = fuelLoading || expLoading;

  // Table Columns Setup
  const fuelColumns: ColumnDef<FuelLog>[] = [
    {
      header: 'Vehicle Asset',
      accessor: (log) => {
        const vehicle = vehicles?.find((v) => v.id === log.vehicle_id);
        return <span className="font-semibold text-gray-200">{vehicle ? vehicle.name : `ID: ${log.vehicle_id}`}</span>;
      },
    },
    {
      header: 'Liters Refueled',
      accessor: (log) => <span>{log.liters.toLocaleString()} L</span>,
    },
    {
      header: 'Receipt Amount',
      accessor: (log) => <span>${log.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>,
    },
    {
      header: 'Refuel Date',
      accessor: (log) => <span>{log.date}</span>,
    },
  ];

  const expenseColumns: ColumnDef<Expense>[] = [
    {
      header: 'Vehicle Asset',
      accessor: (exp) => {
        const vehicle = vehicles?.find((v) => v.id === exp.vehicle_id);
        return <span className="font-semibold text-gray-200">{vehicle ? vehicle.name : `ID: ${exp.vehicle_id}`}</span>;
      },
    },
    {
      header: 'Charge Type',
      accessor: (exp) => (
        <span className="font-medium text-xs rounded bg-gray-900 border border-gray-800 px-2 py-0.5 text-gray-300">
          {exp.type}
        </span>
      ),
    },
    {
      header: 'Expense Amount',
      accessor: (exp) => <span className="text-gray-150 text-gray-200 font-bold">${exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>,
    },
    {
      header: 'Logged Date',
      accessor: (exp) => <span>{exp.date}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fuel & Expense Ledger"
        description="Audit total fleet refueling receipts, tolls, and auxiliary operational cost expenditures."
        actionSlot={
          <div className="flex gap-2">
            <button
              onClick={handleOpenFuel}
              className="bg-accent hover:bg-amber-700 text-white font-semibold text-sm px-4 py-2.5 rounded-md transition-colors"
            >
              + Log Fuel Receipt
            </button>
            <button
              onClick={handleOpenExpense}
              className="bg-panel border border-gray-800 hover:bg-gray-800 text-gray-300 font-semibold text-sm px-4 py-2.5 rounded-md transition-colors"
            >
              + Log Toll/Misc Expense
            </button>
          </div>
        }
      />

      {error && (
        <ErrorAlert
          message={
            error instanceof Error ? error.message : 'Error retrieving fuel/expense audits.'
          }
        />
      )}

      {/* KPI Display Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard
          label="Total Operational Expenditures"
          value={costLoading ? '...' : `$${(costBreakdown?.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          description="Consolidated fleet run-costs sum"
          icon={<DollarSign className="w-5 h-5 text-status-available" />}
        />
        <KPICard
          label="Total Refuel Costs"
          value={costLoading ? '...' : `$${(costBreakdown?.total_fuel_cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          description="Aggregated fuel charges"
          icon={<DollarSign className="w-5 h-5 text-status-ontrip" />}
        />
        <KPICard
          label="Tolls & Auxiliary Charges"
          value={costLoading ? '...' : `$${((costBreakdown?.total_expenses_cost || 0) + (costBreakdown?.total_maintenance_cost || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          description="Misc, Tolls and Maintenance"
          icon={<Landmark className="w-5 h-5 text-status-inshop" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Fuel Logs Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-200">Fuel Receipts</h2>
          <DataTable
            columns={fuelColumns}
            data={fuelLogs}
            isLoading={isTableLoading}
            emptyTitle="No fuel logs logged"
            emptyDescription="Log refueling events to monitor asset consumption."
            keyExtractor={(log) => log.id}
          />
        </div>

        {/* Expenses Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-200">Auxiliary Expenses</h2>
          <DataTable
            columns={expenseColumns}
            data={expenses}
            isLoading={isTableLoading}
            emptyTitle="No expense logs logged"
            emptyDescription="Log toll charges and other auxiliary expenditures."
            keyExtractor={(exp) => exp.id}
          />
        </div>
      </div>

      {/* Add Fuel Modal */}
      <Modal isOpen={isFuelOpen} onClose={() => setIsFuelOpen(false)} title="Log Fuel Receipt">
        <form onSubmit={handleFuelSubmit} className="space-y-4">
          {fuelFormError && <ErrorAlert message={fuelFormError} onDismiss={() => setFuelFormError('')} />}

          <FormField label="Target Vehicle Asset" required>
            <select
              required
              value={fuelVehicleId}
              onChange={(e) => setFuelVehicleId(e.target.value)}
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

          <FormField label="Associated Trip (Optional)">
            <select
              value={fuelTripId}
              onChange={(e) => setFuelTripId(e.target.value)}
              className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
            >
              <option value="">Choose active transit route...</option>
              {trips?.filter(t => t.vehicle_id === Number(fuelVehicleId)).map((t) => (
                <option key={t.id} value={t.id}>
                  Route #{t.id}: {t.source} &rarr; {t.destination} ({t.status})
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Liters Refueled" required>
              <input
                type="number"
                step="0.01"
                required
                min={0.01}
                value={fuelLiters}
                onChange={(e) => setFuelLiters(Number(e.target.value))}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-250 text-gray-200 focus:border-accent focus:outline-none"
              />
            </FormField>

            <FormField label="Fuel Cost ($)" required>
              <input
                type="number"
                step="0.01"
                required
                min={0.01}
                value={fuelCost}
                onChange={(e) => setFuelCost(Number(e.target.value))}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-250 text-gray-200 focus:border-accent focus:outline-none"
              />
            </FormField>
          </div>

          <FormField label="Refuel Receipt Date" required>
            <input
              type="date"
              required
              value={fuelDate}
              onChange={(e) => setFuelDate(e.target.value)}
              className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={() => setIsFuelOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createFuelLogMutation.isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-accent hover:bg-amber-700 rounded-md transition-colors"
            >
              Log Receipt
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Expense Modal */}
      <Modal isOpen={isExpenseOpen} onClose={() => setIsExpenseOpen(false)} title="Log Toll/Misc Expense">
        <form onSubmit={handleExpenseSubmit} className="space-y-4">
          {expFormError && <ErrorAlert message={expFormError} onDismiss={() => setExpFormError('')} />}

          <FormField label="Target Vehicle Asset" required>
            <select
              required
              value={expVehicleId}
              onChange={(e) => setExpVehicleId(e.target.value)}
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

          <FormField label="Associated Trip (Optional)">
            <select
              value={expTripId}
              onChange={(e) => setExpTripId(e.target.value)}
              className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
            >
              <option value="">Choose active transit route...</option>
              {trips?.filter(t => t.vehicle_id === Number(expVehicleId)).map((t) => (
                <option key={t.id} value={t.id}>
                  Route #{t.id}: {t.source} &rarr; {t.destination} ({t.status})
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Expense Type" required>
              <select
                value={expType}
                onChange={(e) => setExpType(e.target.value as ExpenseType)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
              >
                <option value="Toll">Toll Fee</option>
                <option value="Misc">Miscellaneous Fee</option>
              </select>
            </FormField>

            <FormField label="Charge Amount ($)" required>
              <input
                type="number"
                step="0.01"
                required
                min={0.01}
                value={expAmount}
                onChange={(e) => setExpAmount(Number(e.target.value))}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-250 text-gray-200 focus:border-accent focus:outline-none"
              />
            </FormField>
          </div>

          <FormField label="Expense Charge Date" required>
            <input
              type="date"
              required
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)}
              className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={() => setIsExpenseOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createExpenseMutation.isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-accent hover:bg-amber-700 rounded-md transition-colors"
            >
              Log Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FuelExpense;
