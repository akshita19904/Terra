import React from 'react';
import { AlertCircle, Clock, Construction, Info } from 'lucide-react';

export const CivicPulsePage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="card-slate p-6 border border-[#F59E0B]/30 bg-[#F59E0B]/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#F8FAFC]">CivicPulse Operations</h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 font-semibold">
              Under Construction
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-normal">
            Crowdsourced infrastructure reporting, road damage telemetry, and municipal work-order dispatch.
          </p>
        </div>
      </div>

      {/* Active Transparency Notice Banner */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 flex items-center gap-3 text-xs text-[#94A3B8]">
        <Info className="w-4 h-4 text-[#3B82F6] shrink-0" />
        <span>This module is currently under active development and will be available in a future Terra release.</span>
      </div>

      {/* Concept Architecture Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-slate p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
            <Construction className="w-4 h-4 text-[#F59E0B]" /> Planned Features & Capabilities
          </h2>
          <ul className="space-y-2 text-xs text-[#94A3B8]">
            <li className="flex items-center gap-2">✓ Pothole & Road Damage Image Reporting</li>
            <li className="flex items-center gap-2">✓ Automated BBMP Municipal Dispatch Workflows</li>
            <li className="flex items-center gap-2">✓ Community Issue Verification & Upvoting</li>
          </ul>
        </div>

        <div className="card-slate p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F59E0B]" /> Module Development Roadmap
          </h2>
          <div className="space-y-2 text-xs text-[#94A3B8]">
            <div className="flex justify-between border-b border-[#334155] pb-2">
              <span>Phase 1: Issue Intake API</span>
              <span className="text-[#16A34A] font-semibold">Complete</span>
            </div>
            <div className="flex justify-between border-b border-[#334155] pb-2">
              <span>Phase 2: Municipal Sync Engine</span>
              <span className="text-[#F59E0B] font-semibold">In Progress</span>
            </div>
            <div className="flex justify-between">
              <span>Phase 3: Public Dispatch Portal</span>
              <span className="text-[#64748B]">Planned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
