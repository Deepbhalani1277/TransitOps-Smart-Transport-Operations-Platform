import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import FuelExpense from './pages/FuelExpense';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

type Page = 'Dashboard' | 'Vehicles' | 'Drivers' | 'Trips' | 'Maintenance' | 'FuelExpense' | 'Reports' | 'Settings';

const AppContent: React.FC = () => {
  // const { isAuthenticated, logout, user } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [showLogin, setShowLogin] = useState(false); // Can toggle for display testing

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard': return <Dashboard />;
      case 'Vehicles': return <Vehicles />;
      case 'Drivers': return <Drivers />;
      case 'Trips': return <Trips />;
      case 'Maintenance': return <Maintenance />;
      case 'FuelExpense': return <FuelExpense />;
      case 'Reports': return <Reports />;
      case 'Settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-bg text-gray-200">
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => setShowLogin(false)}
            className="text-xs text-accent hover:underline bg-panel border border-gray-800 px-3 py-1.5 rounded-md"
          >
            Show Dashboard App
          </button>
        </div>
        <Login />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg text-gray-200 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-panel border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <span className="text-xl font-bold text-accent tracking-wider">TransitOps</span>
          <p className="text-xs text-gray-500 mt-1">Smart Transport Platform</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {(['Dashboard', 'Vehicles', 'Drivers', 'Trips', 'Maintenance', 'FuelExpense', 'Reports', 'Settings'] as Page[]).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-accent/10 text-accent border-l-2 border-accent'
                  : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
              }`}
            >
              {page.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 bg-gray-950/20">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-xs font-semibold text-gray-400">Fleet Manager</span>
              <span className="block text-[10px] text-gray-600">admin@transitops.com</span>
            </div>
            <button
              onClick={() => setShowLogin(true)}
              className="text-xs text-red-500 hover:text-red-400 hover:underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-bg">
        {renderPage()}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
