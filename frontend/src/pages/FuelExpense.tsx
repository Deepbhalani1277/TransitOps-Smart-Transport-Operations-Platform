import React from 'react';

const FuelExpense: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-accent">Fuel & Expenses</h1>
          <p className="text-gray-400 mt-1">Track fuel logs, tolls, and auxiliary expenses.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-accent text-white px-4 py-2 rounded-md font-semibold hover:bg-amber-700">
            Log Fuel
          </button>
          <button className="bg-panel border border-gray-800 text-gray-200 px-4 py-2 rounded-md font-semibold hover:bg-gray-800">
            Log Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fuel Logs Table */}
        <div className="bg-panel border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-900/30 border-b border-gray-800">
            <h2 className="font-semibold text-gray-200">Recent Fuel Logs</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Vehicle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Liters</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              <tr>
                <td className="px-4 py-3 text-gray-200">Volvo FH16</td>
                <td className="px-4 py-3 text-gray-400">45.5 L</td>
                <td className="px-4 py-3 text-gray-400">$90.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Miscellaneous Expenses Table */}
        <div className="bg-panel border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-900/30 border-b border-gray-800">
            <h2 className="font-semibold text-gray-200">Recent Expenses</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Vehicle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              <tr>
                <td className="px-4 py-3 text-gray-200">Volvo FH16</td>
                <td className="px-4 py-3 text-gray-400">Toll</td>
                <td className="px-4 py-3 text-gray-400">$15.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FuelExpense;
