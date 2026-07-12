import React from 'react';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionButton?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionButton }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-gray-800 rounded-lg bg-panel">
      <Database className="w-12 h-12 text-gray-600 mb-4" />
      <h3 className="text-lg font-bold text-gray-200">{title}</h3>
      <p className="text-sm text-gray-400 mt-1 max-w-md">{description}</p>
      {actionButton && <div className="mt-6">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
