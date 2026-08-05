import React from 'react';
import { Compass, Car, ShieldAlert, AlertCircle, ParkingCircle, BarChart3, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface TerraDashboardProps {
  onNavigateModule: (module: string) => void;
}

export const TerraDashboard: React.FC<TerraDashboardProps> = ({ onNavigateModule }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Platform Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-darkBorder relative overflow-hidden bg-gradient-to-r from-[#0E1B2E] via-[#0E1B2E]/90 to-[#07111F]">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/15 text-mint border border-mint/30 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Terra Urban Operations Platform
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Intelligent Mobility & Connected Civic Systems
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed font-medium">
            Terra unifies urban transport optimization with real-time civic infrastructure response.
            Our flagship mobility module, <strong className="text-mint font-bold">Waypoint</strong>, is fully operational across Bengaluru metro corridors.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onNavigateModule('waypoint')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-mint to-mint-hover text-bg-primary font-extrabold text-xs shadow-mintGlow hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Waypoint Commute Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateModule('civicpulse')}
              className="px-5 py-3 rounded-xl bg-bg-secondary hover:bg-white/5 border border-darkBorder text-gray-200 font-bold text-xs transition-all"
            >
              Explore CivicPulse
            </button>
          </div>
        </div>
      </div>

      {/* Platform Key Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-darkBorder space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Commutes Matched</span>
          <div className="text-2xl font-extrabold text-white font-mono">14,280+</div>
          <span className="text-xs text-mint font-semibold">↑ 18% this month</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-darkBorder space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">CO₂ Emissions Prevented</span>
          <div className="text-2xl font-extrabold text-mint font-mono">3,850 kg</div>
          <span className="text-xs text-gray-300 font-medium">Shared EV/Hybrid rides</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-darkBorder space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Average Pickup Detour</span>
          <div className="text-2xl font-extrabold text-white font-mono">4.2 Mins</div>
          <span className="text-xs text-emerald-400 font-semibold">Optimized trajectory</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-darkBorder space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Driver Trust Index</span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">4.92 / 5.00</div>
          <span className="text-xs text-gray-300 font-medium">Verified active drivers</span>
        </div>
      </div>

      {/* Platform Module Architecture Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-mint" /> Platform Modules Ecosystem
          </h2>
          <span className="text-xs text-gray-400 font-medium">Terra Operations Sitemap</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Flagship Module 1: Waypoint (100% Ready) */}
          <div
            onClick={() => onNavigateModule('waypoint')}
            className="glass-panel p-6 rounded-2xl border border-mint/40 bg-mint/5 hover:border-mint transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-mint/20 text-mint flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-mint text-bg-primary font-extrabold">
                100% Production Ready
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-mint transition-colors">
              Waypoint Mobility
            </h3>
            <p className="text-xs text-gray-300 mt-2 font-medium leading-relaxed">
              Flagship intelligent commute ride-matching engine, PostGIS spatial route alignment, live driver telemetry, and Rupee fare calculation.
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-mint">
              <span>Open Commute Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 2: CivicPulse (40% In Development) */}
          <div
            onClick={() => onNavigateModule('civicpulse')}
            className="glass-panel p-6 rounded-2xl border border-darkBorder hover:border-gray-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                40% In Development
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              CivicPulse Operations
            </h3>
            <p className="text-xs text-gray-300 mt-2 font-medium leading-relaxed">
              Crowdsourced infrastructure reporting, road damage telemetry, pothole verification, and municipal task dispatch workflow.
            </p>
            <div className="mt-4 pt-4 border-t border-darkBorder flex items-center justify-between text-xs font-bold text-amber-400">
              <span>View Module Roadmap</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 3: Sentinel (25% Preview) */}
          <div
            onClick={() => onNavigateModule('sentinel')}
            className="glass-panel p-6 rounded-2xl border border-darkBorder hover:border-gray-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                25% In Development
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-red-300 transition-colors">
              Sentinel Response
            </h3>
            <p className="text-xs text-gray-300 mt-2 font-medium leading-relaxed">
              High-priority emergency SOS broadcasting, dispatcher telemetry console, and incident geo-fencing.
            </p>
            <div className="mt-4 pt-4 border-t border-darkBorder flex items-center justify-between text-xs font-bold text-red-400">
              <span>View SOS Preview</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
