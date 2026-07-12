import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import FormField from '../components/ui/FormField';
import { ShieldAlert, Check, AlertCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  
  // Local Settings persisted in localStorage
  const [defaultRegion, setDefaultRegion] = useState(() => {
    return localStorage.getItem('default_region') || 'North';
  });
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('default_region', defaultRegion);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Static RBAC Permissions Matrix
  const rbacMatrix = [
    { module: 'Dashboard & Reports', manager: 'Full Access', dispatcher: 'View Only', safety: 'View Only', analyst: 'View Only' },
    { module: 'Vehicle Registry (CRUD)', manager: 'Full Access', dispatcher: 'Full Access', safety: 'View Only', analyst: 'No Access' },
    { module: 'Driver Profiles (CRUD)', manager: 'Full Access', dispatcher: 'Full Access', safety: 'View Only', analyst: 'No Access' },
    { module: 'Trip Dispatcher & Stepper', manager: 'Full Access', dispatcher: 'Full Access', safety: 'No Access', analyst: 'No Access' },
    { module: 'Workshop Maintenance Logs', manager: 'Full Access', dispatcher: 'No Access', safety: 'Full Access', analyst: 'No Access' },
    { module: 'Fuel Receipts & Toll Ledger', manager: 'Full Access', dispatcher: 'No Access', safety: 'No Access', analyst: 'Full Access' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Settings & System Preferences"
        description="Verify account identity credentials, configure local defaults, and audit RBAC security matrices."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form Panel */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-panel border border-gray-800 rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-200 border-b border-gray-800 pb-3">
              Profile & Configuration
            </h2>

            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-md bg-green-500/10 border border-green-500/30 p-4 text-sm text-green-400">
                <Check className="w-5 h-5 text-status-available flex-shrink-0" />
                <span>Configuration changes saved successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Account Name">
                <input
                  type="text"
                  disabled
                  value={user?.name || 'Jane Doe'}
                  className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                />
              </FormField>

              <FormField label="Platform Scope Role">
                <input
                  type="text"
                  disabled
                  value={user?.role || 'Fleet Manager'}
                  className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                />
              </FormField>
            </div>

            <FormField label="Email Credentials">
              <input
                type="email"
                disabled
                value={user?.email || 'admin@transitops.com'}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
              />
            </FormField>

            <FormField label="Default Operations Hub Region">
              <select
                value={defaultRegion}
                onChange={(e) => setDefaultRegion(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-sm text-gray-300 focus:border-accent focus:outline-none"
              >
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>
            </FormField>

            <div className="flex justify-end pt-4 border-t border-gray-800">
              <button
                type="submit"
                className="bg-accent hover:bg-amber-700 text-white font-semibold text-sm px-6 py-2.5 rounded-md transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </form>

          {/* Static RBAC Matrix reference table */}
          <div className="bg-panel border border-gray-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/30 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-accent" />
              <h2 className="font-bold text-gray-200 text-sm uppercase tracking-wider">
                RBAC Security Access Matrix (Static)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-850 divide-gray-800 text-xs">
                <thead className="bg-gray-900/40">
                  <tr className="text-gray-400 font-semibold uppercase">
                    <th className="px-4 py-3 text-left">Security Scope Module</th>
                    <th className="px-4 py-3 text-left">Fleet Manager</th>
                    <th className="px-4 py-3 text-left">Dispatcher</th>
                    <th className="px-4 py-3 text-left">Safety Officer</th>
                    <th className="px-4 py-3 text-left">Financial Analyst</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {rbacMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-900/20">
                      <td className="px-4 py-3 font-semibold text-gray-200">{row.module}</td>
                      <td className="px-4 py-3 text-status-available font-bold">{row.manager}</td>
                      <td className={`px-4 py-3 font-medium ${row.dispatcher === 'No Access' ? 'text-red-500' : row.dispatcher === 'View Only' ? 'text-blue-400' : 'text-status-available'}`}>{row.dispatcher}</td>
                      <td className={`px-4 py-3 font-medium ${row.safety === 'No Access' ? 'text-red-500' : row.safety === 'View Only' ? 'text-blue-400' : 'text-status-available'}`}>{row.safety}</td>
                      <td className={`px-4 py-3 font-medium ${row.analyst === 'No Access' ? 'text-red-500' : row.analyst === 'View Only' ? 'text-blue-400' : 'text-status-available'}`}>{row.analyst}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Info Panel */}
        <div className="bg-panel border border-gray-800 p-6 rounded-lg space-y-4 h-fit">
          <div className="flex items-center gap-2 text-accent">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Access Note</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Platform roles and email identifiers are administratively assigned in the database and cannot be modified from the user profile settings dashboard.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Changing your default hub region updates form pre-selection fields for list operations on this browser cache.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
