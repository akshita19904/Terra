import React from 'react';
import { ShieldAlert, Clock, Info } from 'lucide-react';

export const SentinelPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="card-slate p-6 border border-[#F59E0B]/30 bg-[#F59E0B]/5 flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#F8FAFC]">Sentinel Emergency Response</h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 font-semibold">
              Under Construction
            </span>
          </div>
          <p className="text-xs text-[#94A3B8]">
            High-priority emergency SOS broadcasting, dispatch telemetry console, and incident geo-fencing.
          </p>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 flex items-center gap-3 text-xs text-[#94A3B8]">
        <Info className="w-4 h-4 text-[#3B82F6] shrink-0" />
        <span>This module is currently under active development and will be available in a future Terra release.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-slate p-6 space-y-3">
          <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#F59E0B]" /> Planned Capabilities
          </h2>
          <ul className="space-y-2 text-xs text-[#94A3B8]">
            <li>✓ Real-time Socket.IO SOS Telemetry Pipeline (Port 4000)</li>
            <li>✓ 112 National Emergency Line Protocol Integration</li>
            <li>✓ High-priority location broadcasting to nearby responders</li>
          </ul>
        </div>

        <div className="card-slate p-6 space-y-3">
          <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F59E0B]" /> Development Milestones
          </h2>
          <div className="space-y-2 text-xs text-[#94A3B8]">
            <div className="flex justify-between border-b border-[#334155] pb-2">
              <span>SOS Event PostGIS Schema</span>
              <span className="text-[#16A34A] font-semibold">Complete</span>
            </div>
            <div className="flex justify-between">
              <span>Dispatcher Console Portal</span>
              <span className="text-[#F59E0B] font-semibold">In Progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
