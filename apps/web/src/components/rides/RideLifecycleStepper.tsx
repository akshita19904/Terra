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
  { state: 'DRIVER_EN_ROUTE', label: 'En Route', icon: Car },
  { state: 'RIDE_IN_PROGRESS', label: 'In Trip', icon: Car },
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
    <div className="card-slate p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#3B82F6]" aria-hidden="true" /> Ride Status Tracker
        </h3>
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#2563EB]/20 text-[#3B82F6] border border-[#2563EB]/30">
          {currentState}
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
                className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                  status === 'completed'
                    ? 'bg-[#16A34A] text-white border-[#16A34A] font-bold'
                    : status === 'active'
                    ? 'bg-[#2563EB] text-white border-[#2563EB] ring-2 ring-[#3B82F6]/50'
                    : 'bg-[#0F172A] text-[#64748B] border-[#334155]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[10px] font-medium mt-1.5 line-clamp-1 ${
                  status === 'active'
                    ? 'text-[#3B82F6] font-bold'
                    : status === 'completed'
                    ? 'text-[#F8FAFC]'
                    : 'text-[#64748B]'
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
