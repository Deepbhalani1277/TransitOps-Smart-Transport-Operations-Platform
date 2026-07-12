import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Truck,
  Users,
  Compass,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role || 'Fleet Manager';

  // Navigation Items with RBAC visibility setup
  // Options: "Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"
  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'],
    },
    {
      path: '/vehicles',
      label: 'Vehicles',
      icon: Truck,
      roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer'],
    },
    {
      path: '/drivers',
      label: 'Drivers',
      icon: Users,
      roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer'],
    },
    {
      path: '/trips',
      label: 'Trips',
      icon: Compass,
      roles: ['Fleet Manager', 'Dispatcher'],
    },
    {
      path: '/maintenance',
      label: 'Maintenance',
      icon: Wrench,
      roles: ['Fleet Manager', 'Safety Officer'],
    },
    {
      path: '/fuel-expenses',
      label: 'Fuel & Expense',
      icon: Fuel,
      roles: ['Fleet Manager', 'Financial Analyst'],
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: BarChart3,
      roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'],
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: Settings,
      roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'],
    },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="w-64 bg-panel border-r border-gray-800 flex flex-col h-screen flex-shrink-0">
      {/* Brand */}
      <div className="p-6 border-b border-gray-800">
        <span className="text-xl font-bold text-accent tracking-wider">TransitOps</span>
        <p className="text-xs text-gray-500 mt-1">Smart Transport Platform</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? 'bg-accent/10 text-accent border-l-2 border-accent'
                  : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Session profile */}
      <div className="p-4 border-t border-gray-800 bg-gray-950/20">
        <div className="flex items-center justify-between">
          <div className="overflow-hidden pr-2">
            <span className="block text-xs font-semibold text-gray-200 truncate">
              {user?.name || 'User'}
            </span>
            <span className="block text-[10px] text-gray-500 font-medium truncate">
              {role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-400 p-1.5 rounded-md hover:bg-gray-900 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
