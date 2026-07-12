import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-accent">Settings</h1>
        <p className="text-gray-400 mt-1">Configure profile and platform preferences.</p>
      </div>

      <div className="bg-panel border border-gray-800 rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-200">Account Profile</h2>
          <p className="text-sm text-gray-400">Personal identity and login credentials.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">Name</label>
              <input
                type="text"
                disabled
                value="Jane Doe"
                className="mt-1 block w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-gray-500 sm:text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">Role</label>
              <input
                type="text"
                disabled
                value="Fleet Manager"
                className="mt-1 block w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-gray-500 sm:text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-800" />

        <div>
          <h2 className="text-lg font-medium text-gray-200">System Preferences</h2>
          <p className="text-sm text-gray-400">Localization and regional operations defaults.</p>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-400 uppercase">Default Region</label>
            <select
              disabled
              className="mt-1 block w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-gray-400 sm:text-sm focus:outline-none"
            >
              <option>North</option>
              <option>South</option>
              <option>East</option>
              <option>West</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
