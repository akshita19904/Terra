import React from 'react';
import { CheckCircle2, Clock, MapPin, Car, ShieldCheck, Flag } from 'lucide-react';

export type RideState =
  | 'CREATED'
  | 'SEARCHING'
  | 'MATCHED'
  | 'ACCEPTED'
  | 'DRIVER_EN_ROUTE'
  | 'PASSENGER_PICKED_UP'
  | 'RIDE_IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

interface RideLifecycleStepperProps {
  currentState: RideState;
}

const STEPS: { state: RideState; label: string; icon: React.FC<{ className?: string }> }[] = [
  { state: 'CREATED', label: 'Created', icon: Clock },
  { state: 'SEARCHING', label: 'Searching', icon: MapPin },
  { state: 'MATCHED', label: 'Matched', icon: CheckCircle2 },
  { state: 'ACCEPTED', label: 'Accepted', icon: ShieldCheck },
  { state: 'DRIVER_EN_ROUTE', label: 'Driver En Route', icon: Car },
  { state: 'RIDE_IN_PROGRESS', label: 'In Progress', icon: Car },
  { state: 'COMPLETED', label: 'Completed', icon: Flag },
];

export const RideLifecycleStepper: React.FC<RideLifecycleStepperProps> = ({ currentState }) => {
  const getStepStatus = (stepState: RideState, index: number) => {
    const currentIndex = STEPS.findIndex((s) => s.state === currentState);

    if (currentState === 'CANCELLED') return 'cancelled';
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="glass-panel p-4 rounded-2xl border border-darkBorder mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-mint" aria-hidden="true" /> Ride Lifecycle State Machine
        </h3>
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-mint/20 text-mint border border-mint/40">
          State: {currentState}
        </span>
      </div>

      {/* Stepper Timeline */}
      <div className="grid grid-cols-7 gap-1 relative">
        {STEPS.map((step, idx) => {
          const status = getStepStatus(step.state, idx);
          const Icon = step.icon;

          return (
            <div key={step.state} className="flex flex-col items-center text-center group">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  status === 'completed'
                    ? 'bg-mint text-bg-primary border-mint font-bold'
                    : status === 'active'
                    ? 'bg-mint/20 text-mint border-mint ring-2 ring-mint/50 animate-pulse'
                    : 'bg-bg-secondary text-gray-500 border-darkBorder'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-semibold mt-1.5 line-clamp-1 ${
                  status === 'active'
                    ? 'text-mint font-bold'
                    : status === 'completed'
                    ? 'text-gray-200'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
