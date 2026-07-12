import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';
import AppShell from './components/layout/AppShell';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import FuelExpense from './pages/FuelExpense';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Guest routes (Only accessible if NOT authenticated) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected routes (Require authentication & optional role check) */}
          <Route element={<AppShell />}>
            {/* Dashboard available to all roles */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Vehicles available to Fleet Manager, Dispatcher, Safety Officer */}
            <Route
              element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Dispatcher', 'Safety Officer']} />}
            >
              <Route path="/vehicles" element={<Vehicles />} />
            </Route>

            {/* Drivers available to Fleet Manager, Dispatcher, Safety Officer */}
            <Route
              element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Dispatcher', 'Safety Officer']} />}
            >
              <Route path="/drivers" element={<Drivers />} />
            </Route>

            {/* Trips available to Fleet Manager, Dispatcher */}
            <Route
              element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Dispatcher']} />}
            >
              <Route path="/trips" element={<Trips />} />
            </Route>

            {/* Maintenance available to Fleet Manager, Safety Officer */}
            <Route
              element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Safety Officer']} />}
            >
              <Route path="/maintenance" element={<Maintenance />} />
            </Route>

            {/* Fuel & Expense available to Fleet Manager, Financial Analyst */}
            <Route
              element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Financial Analyst']} />}
            >
              <Route path="/fuel-expenses" element={<FuelExpense />} />
            </Route>

            {/* Reports available to all roles */}
            <Route path="/reports" element={<Reports />} />

            {/* Settings available to all roles */}
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch-all redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
