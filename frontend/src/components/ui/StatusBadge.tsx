import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyles = (val: string) => {
    const formatted = val.toLowerCase().replace(/\s+/g, '');
    switch (formatted) {
      case 'available':
        return 'bg-green-500/10 text-status-available border-green-500/20';
      case 'ontrip':
      case 'dispatched':
        return 'bg-blue-500/10 text-status-ontrip border-blue-500/20';
      case 'inshop':
      case 'active':
        return 'bg-amber-500/10 text-status-inshop border-amber-500/20';
      case 'retired':
      case 'suspended':
      case 'cancelled':
        return 'bg-red-500/10 text-status-retired border-red-500/20';
      case 'offduty':
        return 'bg-yellow-500/10 text-status-offduty border-yellow-500/20';
      case 'completed':
      case 'closed':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'draft':
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold border ${getBadgeStyles(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
