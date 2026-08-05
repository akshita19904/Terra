import React from 'react';
import { ParkingCircle, Info } from 'lucide-react';

export const ParkingPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="card-slate p-6 border border-[#64748B]/30 bg-[#64748B]/5 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#F8FAFC]">Smart Parking Optimization</h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#64748B]/20 text-[#94A3B8] border border-[#64748B]/30 font-semibold">
              Planned
            </span>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Real-time urban parking slot reservation, IoT sensor integration, and EV charging station routing.
          </p>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 flex items-center gap-3 text-xs text-[#94A3B8]">
        <Info className="w-4 h-4 text-[#3B82F6] shrink-0" />
        <span>This module is currently under active development and will be available in a future Terra release.</span>
      </div>

      <div className="card-slate p-8 text-center max-w-xl mx-auto space-y-3">
        <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 text-[#3B82F6] flex items-center justify-center mx-auto">
          <ParkingCircle className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-bold text-[#F8FAFC]">Planned Platform Extension</h2>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Smart Parking will integrate directly with Waypoint commute routes, allowing drivers to reserve EV charging slots at destination hubs in advance.
        </p>
      </div>
    </div>
  );
};
