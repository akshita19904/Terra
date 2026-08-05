import React from 'react';
import { AlertCircle, MapPin, CheckCircle2, Clock, Wrench, ArrowRight, Construction } from 'lucide-react';

export const CivicPulsePage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">CivicPulse Operations</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
              40% Complete — Prototype Preview
            </span>
          </div>
          <p className="text-xs text-gray-300 font-medium">
            Crowdsourced infrastructure reporting, pothole telemetry, and municipal work-order dispatch.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-amber-400 text-bg-primary font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer">
          <Construction className="w-4 h-4" /> Report Road Pothole
        </button>
      </div>

      {/* Development Status & Architecture Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 glass-panel p-6 rounded-2xl border border-darkBorder space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" /> Active Civic Infrastructure Incidents
          </h2>

          <div className="space-y-3">
            <div className="glass-card p-4 rounded-xl border border-darkBorder flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Severe Pothole Cluster — Yelahanka Main Rd</h3>
                  <p className="text-[11px] text-gray-400">Reported by 14 Waypoint Commuters • Dispatched to BBMP Works</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                In Progress
              </span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-darkBorder flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Traffic Signal Fault — Indiranagar 100ft Rd</h3>
                  <p className="text-[11px] text-gray-400">Resolved in 2.4 Hours • Municipal Verification Complete</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-bold">
                Resolved
              </span>
            </div>
          </div>
        </div>

        {/* Development Roadmap */}
        <div className="glass-panel p-6 rounded-2xl border border-darkBorder space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> Module Development Roadmap
          </h2>
          <ul className="space-y-3 text-xs text-gray-300 font-medium">
            <li className="flex items-center justify-between text-mint font-bold">
              <span>✓ Pothole Image AI Verification</span>
              <span>100%</span>
            </li>
            <li className="flex items-center justify-between text-amber-300 font-bold">
              <span>⏳ Municipal BBMP API Integration</span>
              <span>40%</span>
            </li>
            <li className="flex items-center justify-between text-gray-500">
              <span>○ Automated Work-Order Dispatch</span>
              <span>0%</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
