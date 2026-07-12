import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-accent">Operations Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time status and operational metrics overview.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <span className="inline-flex items-center rounded-md bg-green-500/10 px-2.5 py-1.5 text-sm font-medium text-status-available border border-green-500/20">
            System Online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="bg-panel border border-gray-800 p-6 rounded-lg">
          <div className="text-sm font-medium text-gray-400 truncate">Total Fleet Vehicles</div>
          <div className="mt-2 text-3xl font-semibold text-gray-100">12</div>
        </div>
        {/* Metric 2 */}
        <div className="bg-panel border border-gray-800 p-6 rounded-lg">
          <div className="text-sm font-medium text-gray-400 truncate">Active Trips</div>
          <div className="mt-2 text-3xl font-semibold text-status-ontrip">3</div>
        </div>
        {/* Metric 3 */}
        <div className="bg-panel border border-gray-800 p-6 rounded-lg">
          <div className="text-sm font-medium text-gray-400 truncate">Vehicles in Shop</div>
          <div className="mt-2 text-3xl font-semibold text-status-inshop">1</div>
        </div>
        {/* Metric 4 */}
        <div className="bg-panel border border-gray-800 p-6 rounded-lg">
          <div className="text-sm font-medium text-gray-400 truncate">Odometer Summary</div>
          <div className="mt-2 text-3xl font-semibold text-gray-100">154,200.5 km</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
