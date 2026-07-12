import React from 'react';

const Reports: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-accent">Operations Reports</h1>
        <p className="text-gray-400 mt-1">Generate fleet summaries, fuel efficiency reports, and cost analyses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Report Card 1 */}
        <div className="bg-panel border border-gray-800 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-gray-200">Cost Breakdown</h2>
          <p className="text-sm text-gray-400">Total operational expenditures including fuel, maintenance, and tolls.</p>
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 rounded-md font-semibold text-sm">
            Generate Report
          </button>
        </div>

        {/* Report Card 2 */}
        <div className="bg-panel border border-gray-800 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-gray-200">Fuel Efficiency</h2>
          <p className="text-sm text-gray-400">Liters consumed per 100km tracked across fleet vehicles.</p>
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 rounded-md font-semibold text-sm">
            Generate Report
          </button>
        </div>

        {/* Report Card 3 */}
        <div className="bg-panel border border-gray-800 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-gray-200">Driver Performance</h2>
          <p className="text-sm text-gray-400">Analysis of driver safety scores, incidents, and trip completions.</p>
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 rounded-md font-semibold text-sm">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
