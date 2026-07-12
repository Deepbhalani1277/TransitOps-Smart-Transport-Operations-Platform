import React from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
}

const KPICard: React.FC<KPICardProps> = ({ label, value, description, icon, trend }) => {
  return (
    <div className="bg-panel border border-gray-800 p-6 rounded-lg flex items-start justify-between shadow-md hover:border-gray-700 transition-colors">
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-100 tracking-tight">{value}</span>
          {trend && (
            <span
              className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                trend.isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      {icon && <div className="text-gray-500 p-2 bg-bg/50 border border-gray-800 rounded-md">{icon}</div>}
    </div>
  );
};

export default KPICard;
