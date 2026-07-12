import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss, className = '' }) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-start gap-3 rounded-md bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400 ${className}`}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium text-red-200">Error</p>
        <p className="mt-1 text-red-400">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-300 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
