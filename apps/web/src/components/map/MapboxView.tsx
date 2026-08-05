import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, ShieldCheck } from 'lucide-react';
import { useDevMode } from '../../context/DevModeContext';

interface MapboxViewProps {
  origin?: { lat: number; lng: number; address?: string };
  destination?: { lat: number; lng: number; address?: string };
  routeGeometry?: any;
}

export const MapboxView: React.FC<MapboxViewProps> = ({
  origin = { lat: 13.0827, lng: 77.5900, address: 'Manipal Academy of Higher Education, Bengaluru' },
  destination = { lat: 13.1989, lng: 77.6358, address: 'Brigade El Dorado, Aerospace Park, Bengaluru' },
}) => {
  const { isDevMode } = useDevMode();
  const [activeLayer, setActiveLayer] = useState<'traffic' | 'satellite' | 'dark'>('dark');

  return (
    <div className="card-slate overflow-hidden relative border border-[#334155] shadow-md flex flex-col h-[560px]">
      {/* Map Header Toolbar */}
      <div className="bg-[#1E293B] border-b border-[#334155] px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#3B82F6]" aria-hidden="true" />
          <h3 className="text-xs font-bold text-[#F8FAFC]">Live Route Map</h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30 font-semibold">
            Active Navigation
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveLayer(activeLayer === 'traffic' ? 'dark' : 'traffic')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all ${
              activeLayer === 'traffic'
                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                : 'bg-[#0F172A] text-[#94A3B8] border-[#334155] hover:text-[#F8FAFC]'
            }`}
          >
            Traffic Overlay
          </button>
        </div>
      </div>

      {/* Interactive Vector Map Canvas */}
      <div className="relative flex-1 bg-[#0F172A] overflow-hidden flex items-center justify-center">
        {/* SVG Route Trajectory Canvas */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" xmlns="http://www.w3.org/2000/svg">
          {/* Road Grid Overlay */}
          <pattern id="roadGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1E293B" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#roadGrid)" />

          {/* Commute Route Polyline Vector Path */}
          <path
            d="M 120 380 Q 240 220 540 140"
            fill="none"
            stroke="#2563EB"
            strokeWidth="4"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
          <path
            d="M 120 380 Q 240 220 540 140"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
          />

          {/* Active Moving Driver Marker Animation */}
          <circle cx="280" cy="270" r="6" fill="#16A34A" className="animate-ping opacity-75" />
          <circle cx="280" cy="270" r="5" fill="#16A34A" stroke="#F8FAFC" strokeWidth="1.5" />
        </svg>

        {/* Pickup Pin Marker */}
        <div className="absolute left-[100px] top-[360px] z-20 flex flex-col items-center">
          <div className="px-2.5 py-1 rounded bg-[#16A34A] text-white text-[10px] font-bold shadow-md flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Pickup
          </div>
          <div className="w-2.5 h-2.5 bg-[#16A34A] rotate-45 -mt-1 shadow-sm" />
        </div>

        {/* Dropoff Destination Pin Marker */}
        <div className="absolute right-[100px] top-[120px] z-20 flex flex-col items-center">
          <div className="px-2.5 py-1 rounded bg-[#2563EB] text-white text-[10px] font-bold shadow-md flex items-center gap-1">
            <Navigation className="w-3 h-3" /> Dropoff
          </div>
          <div className="w-2.5 h-2.5 bg-[#2563EB] rotate-45 -mt-1 shadow-sm" />
        </div>

        {/* Map Information Panel Overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-[#1E293B]/95 backdrop-blur-md border border-[#334155] p-3 rounded-xl flex items-center justify-between text-xs text-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <div>
              <span className="font-semibold block text-[#F8FAFC]">
                {origin.address || 'Manipal Academy, Yelahanka'} → {destination.address || 'Brigade El Dorado'}
              </span>
              <span className="text-[11px] text-[#94A3B8]">Est. Distance: 14.8 km • Optimal Traffic Corridor</span>
            </div>
          </div>
          <div className="text-right font-mono font-bold text-[#3B82F6]">
            ETA 24 Mins
          </div>
        </div>
      </div>

      {/* Conditional Developer Telemetry Panel */}
      {isDevMode && (
        <div className="bg-[#0F172A] border-t border-[#334155] px-4 py-2 text-[10px] font-mono text-[#94A3B8] flex items-center justify-between">
          <span>SRID 4326 WGS 84 • ST_DWithin Radius 1500m</span>
          <span>Vector CosSim 0.96 • PostGIS Index Active</span>
        </div>
      )}
    </div>
  );
};
