import React from 'react';

const Vehicles: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-accent">Vehicles</h1>
          <p className="text-gray-400 mt-1">Manage and track fleet vehicles.</p>
        </div>
        <button className="bg-accent text-white px-4 py-2 rounded-md font-semibold hover:bg-amber-700">
          Add Vehicle
        </button>
      </div>

      <div className="bg-panel border border-gray-800 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Reg Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Capacity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">Volvo FH16</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">TX-1234-OP</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">Heavy Truck</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-status-available">Available</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">25,000 kg</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vehicles;
