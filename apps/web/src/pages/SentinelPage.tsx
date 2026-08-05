import React from 'react';
import { ShieldAlert, AlertTriangle, Radio, PhoneCall } from 'lucide-react';

export const SentinelPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="glass-panel p-6 rounded-2xl border border-red-500/30 bg-red-500/5 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">Sentinel Emergency Response</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
              25% Complete — Emergency SOS Preview
            </span>
          </div>
          <p className="text-xs text-gray-300 font-medium">
            High-priority emergency SOS broadcasting, dispatch telemetry console, and incident geo-fencing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-darkBorder space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-400" /> Live Dispatch Console Preview
          </h2>
          <div className="bg-[#07111F] p-4 rounded-xl border border-red-500/30 text-xs text-gray-300 space-y-2 font-mono">
            <div className="text-red-400 font-bold">STATUS: TELEMETRY LISTENING (PORT 4000)</div>
            <div>Active Emergency Broadcast Listeners: 3 Dispatch Centers</div>
            <div>Average SOS Broadcast Latency: &lt; 45ms</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-darkBorder space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-red-400" /> Emergency Hotline Integrations
          </h2>
          <div className="space-y-2 text-xs text-gray-300 font-medium">
            <div className="p-3 rounded-xl bg-bg-secondary border border-darkBorder flex justify-between">
              <span>National Emergency Number (112)</span>
              <span className="text-emerald-400 font-bold">Connected</span>
            </div>
            <div className="p-3 rounded-xl bg-bg-secondary border border-darkBorder flex justify-between">
              <span>Bengaluru Traffic Police Dispatch</span>
              <span className="text-emerald-400 font-bold">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
