import React from 'react';

const Trips: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-accent">Trips</h1>
          <p className="text-gray-400 mt-1">Dispatch operations, plan routes, and complete trips.</p>
        </div>
        <button className="bg-accent text-white px-4 py-2 rounded-md font-semibold hover:bg-amber-700">
          Create Trip Draft
        </button>
      </div>

      <div className="bg-panel border border-gray-800 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cargo Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">New York, NY → Boston, MA</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">Volvo FH16</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">Alice Smith</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">15,000 kg</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Draft</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trips;
