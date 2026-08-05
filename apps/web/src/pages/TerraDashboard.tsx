import React from 'react';
import { Compass, Car, ShieldAlert, AlertCircle, ParkingCircle, BarChart3, ArrowRight, Sparkles } from 'lucide-react';

interface TerraDashboardProps {
  onNavigateModule: (module: string) => void;
}

export const TerraDashboard: React.FC<TerraDashboardProps> = ({ onNavigateModule }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Platform Welcome Banner */}
      <div className="card-slate p-8 relative overflow-hidden bg-gradient-to-r from-[#1E293B] to-[#0F172A]">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#2563EB]/20 text-[#3B82F6] border border-[#2563EB]/30 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Terra Urban Operations Platform
          </div>
          <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Intelligent Mobility & Connected Civic Operations
          </h1>
          <p className="text-xs text-[#94A3B8] leading-relaxed font-normal">
            Terra unifies urban transport optimization with real-time civic infrastructure response.
            Our flagship mobility module, <strong className="text-[#F8FAFC] font-semibold">Waypoint</strong>, is fully operational across Bengaluru metro corridors.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onNavigateModule('waypoint')}
              className="btn-primary cursor-pointer"
            >
              <span>Launch Waypoint Commute Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateModule('civicpulse')}
              className="btn-secondary cursor-pointer"
            >
              Explore Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Platform Key Stats Overview (Only Real Flagship Data) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-slate p-5 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">Total Commutes Matched</span>
          <div className="text-2xl font-bold text-[#F8FAFC] font-mono">14,280+</div>
          <span className="text-xs text-[#16A34A] font-medium">↑ 18% this month</span>
        </div>

        <div className="card-slate p-5 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">CO₂ Emissions Prevented</span>
          <div className="text-2xl font-bold text-[#3B82F6] font-mono">3,850 kg</div>
          <span className="text-xs text-[#94A3B8] font-normal">Shared EV/Hybrid rides</span>
        </div>

        <div className="card-slate p-5 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">Average Pickup Detour</span>
          <div className="text-2xl font-bold text-[#F8FAFC] font-mono">4.2 Mins</div>
          <span className="text-xs text-[#16A34A] font-medium">Optimized trajectory</span>
        </div>

        <div className="card-slate p-5 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">Driver Trust Index</span>
          <div className="text-2xl font-bold text-[#F59E0B] font-mono">4.92 / 5.00</div>
          <span className="text-xs text-[#94A3B8] font-normal">Verified active drivers</span>
        </div>
      </div>

      {/* Platform Module Architecture Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#3B82F6]" /> Terra Modules Architecture
          </h2>
          <span className="text-xs text-[#94A3B8]">Platform Roadmap</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Flagship Module 1: Waypoint (Production Ready) */}
          <div
            onClick={() => onNavigateModule('waypoint')}
            className="card-slate p-6 hover:border-[#2563EB] transition-all cursor-pointer group relative"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#2563EB]/10 text-[#3B82F6] flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30 font-bold">
                Production Ready
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#3B82F6] transition-colors">
              Waypoint Mobility
            </h3>
            <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
              Flagship intelligent commute ride-matching engine, PostGIS spatial route alignment, live driver telemetry, and Rupee fare calculation.
            </p>
            <div className="mt-4 pt-3 border-t border-[#334155] flex items-center justify-between text-xs font-semibold text-[#3B82F6]">
              <span>Open Commute Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 2: CivicPulse (Under Construction) */}
          <div
            onClick={() => onNavigateModule('civicpulse')}
            className="card-slate p-6 hover:border-[#475569] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 font-semibold">
                Under Construction
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#F59E0B] transition-colors">
              CivicPulse Operations
            </h3>
            <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
              Crowdsourced infrastructure reporting, road damage telemetry, pothole verification, and municipal task dispatch workflow.
            </p>
            <div className="mt-4 pt-3 border-t border-[#334155] flex items-center justify-between text-xs font-semibold text-[#F59E0B]">
              <span>View Roadmap</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 3: Sentinel (Under Construction) */}
          <div
            onClick={() => onNavigateModule('sentinel')}
            className="card-slate p-6 hover:border-[#475569] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 font-semibold">
                Under Construction
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#F59E0B] transition-colors">
              Sentinel Response
            </h3>
            <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
              High-priority emergency SOS broadcasting, dispatcher telemetry console, and incident geo-fencing.
            </p>
            <div className="mt-4 pt-3 border-t border-[#334155] flex items-center justify-between text-xs font-semibold text-[#F59E0B]">
              <span>Explore Concept</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 4: Smart Parking (Planned) */}
          <div
            onClick={() => onNavigateModule('parking')}
            className="card-slate p-6 hover:border-[#475569] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#64748B]/10 text-[#94A3B8] flex items-center justify-center font-bold">
                <ParkingCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#64748B]/20 text-[#94A3B8] border border-[#64748B]/30 font-semibold">
                Planned
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#94A3B8] transition-colors">
              Smart Parking
            </h3>
            <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
              Real-time urban parking slot reservation, IoT sensor integration, and destination EV charging routing.
            </p>
            <div className="mt-4 pt-3 border-t border-[#334155] flex items-center justify-between text-xs font-semibold text-[#94A3B8]">
              <span>Explore Concept</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 5: Transit Analytics (Planned) */}
          <div
            onClick={() => onNavigateModule('parking')}
            className="card-slate p-6 hover:border-[#475569] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#64748B]/10 text-[#94A3B8] flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#64748B]/20 text-[#94A3B8] border border-[#64748B]/30 font-semibold">
                Planned
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#94A3B8] transition-colors">
              Transit Analytics
            </h3>
            <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
              City-wide commuter flow modeling, public transport corridor optimization, and traffic bottleneck heatmaps.
            </p>
            <div className="mt-4 pt-3 border-t border-[#334155] flex items-center justify-between text-xs font-semibold text-[#94A3B8]">
              <span>Explore Concept</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
