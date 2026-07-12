import React from 'react';
import { useLocation } from 'react-router-dom';

const Topbar: React.FC = () => {
  const location = useLocation();

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/vehicles':
        return 'Vehicle Registry';
      case '/drivers':
        return 'Driver Management';
      case '/trips':
        return 'Trip Dispatcher';
      case '/maintenance':
        return 'Maintenance Logs';
      case '/fuel-expenses':
        return 'Fuel & Expenses';
      case '/reports':
        return 'Reports & Analytics';
      case '/settings':
        return 'Settings';
      default:
        return 'TransitOps';
    }
  };

  return (
    <header className="h-16 border-b border-gray-800 bg-panel px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-400">Operations</span>
        <span className="text-gray-600">/</span>
        <span className="text-sm font-bold text-gray-250 text-gray-200">
          {getPageTitle(location.pathname)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center rounded-md bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-status-available border border-green-500/20">
          <span className="w-1.5 h-1.5 bg-status-available rounded-full mr-1.5 animate-pulse" />
          System Online
        </span>
      </div>
    </header>
  );
};

export default Topbar;
