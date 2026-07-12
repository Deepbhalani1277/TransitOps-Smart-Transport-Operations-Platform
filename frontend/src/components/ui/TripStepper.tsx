import React from 'react';
import { Check } from 'lucide-react';
import type { TripStatus } from '../../types';

interface TripStepperProps {
  status: TripStatus;
}

const TripStepper: React.FC<TripStepperProps> = ({ status }) => {
  const steps: { label: string; value: TripStatus }[] = [
    { label: 'Draft Created', value: 'Draft' },
    { label: 'Trip Dispatched', value: 'Dispatched' },
    { label: 'Trip Completed', value: 'Completed' },
  ];

  const getStepIndex = (val: TripStatus) => {
    if (val === 'Cancelled') return -1;
    if (val === 'Draft') return 0;
    if (val === 'Dispatched') return 1;
    if (val === 'Completed') return 2;
    return 0;
  };

  const currentIndex = getStepIndex(status);

  if (status === 'Cancelled') {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-center font-medium">
        This trip has been cancelled.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto py-4">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentIndex;
        const isActive = idx === currentIndex;

        return (
          <React.Fragment key={step.value}>
            {/* Step circle */}
            <div className="flex flex-col items-center relative flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : isActive
                    ? 'bg-accent/20 border-accent text-accent ring-4 ring-accent/10'
                    : 'bg-gray-900 border-gray-800 text-gray-500'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <span>{idx + 1}</span>}
              </div>
              <span
                className={`mt-2 text-xs font-semibold tracking-wider uppercase transition-colors ${
                  isActive ? 'text-accent' : isCompleted ? 'text-green-400' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Line separator between steps */}
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 -mt-6 transition-all ${
                  idx < currentIndex ? 'bg-green-500' : 'bg-gray-800'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TripStepper;
