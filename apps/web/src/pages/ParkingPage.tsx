import React from 'react';
import { ParkingCircle, Clock, Sparkles } from 'lucide-react';

export const ParkingPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="glass-panel p-6 rounded-2xl border border-mint/30 bg-mint/5 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">Smart Parking Optimization</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint/20 text-mint border border-mint/30 font-bold">
              15% Complete — Roadmap Preview
            </span>
          </div>
          <p className="text-xs text-gray-300 font-medium">
            Real-time urban parking slot reservation, IoT sensor integration, and EV charging station routing.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8 text-center rounded-2xl border border-darkBorder max-w-xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-full bg-mint/10 text-mint flex items-center justify-center mx-auto">
          <ParkingCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Module Under Active Development</h2>
        <p className="text-xs text-gray-300">
          Smart Parking will integrate directly with Waypoint commute routes, allowing drivers to reserve EV charging slots at destination hubs in advance.
        </p>
      </div>
    </div>
  );
};
