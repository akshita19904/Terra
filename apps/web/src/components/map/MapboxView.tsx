import React, { useState, useEffect, useRef } from 'react';
import { Navigation, MapPin, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

interface MapboxViewProps {
  origin?: { lat: number; lng: number; address?: string };
  destination?: { lat: number; lng: number; address?: string };
}

export const MapboxView: React.FC<MapboxViewProps> = ({ origin, destination }) => {
  const [showDevPanel, setShowDevPanel] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const originAddress = origin?.address || 'Manipal Academy of Higher Education, Bengaluru';
  const destAddress = destination?.address || 'Brigade El Dorado, Aerospace Park, Bengaluru';
  const originLat = origin?.lat ? origin.lat.toFixed(4) : '13.0827';
  const originLng = origin?.lng ? origin.lng.toFixed(4) : '77.5900';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] rounded-2xl glass-panel overflow-hidden border border-darkBorder flex flex-col justify-between p-6 shadow-2xl"
    >
      {/* Dark Vector Map Canvas Visual Background */}
      <div className="absolute inset-0 bg-[#07111F] z-0 overflow-hidden">
        {/* Simulated Road Network & Grid Vector Polyline Paths */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50,100 Q200,80 400,250 T800,300 T1200,450" stroke="#65F5C6" strokeWidth="3" fill="none" />
          <path d="M100,-50 Q250,200 500,220 T900,550" stroke="#38D9A9" strokeWidth="2" strokeDasharray="6,6" fill="none" />
          <path d="M-100,350 Q300,380 600,150 T1100,100" stroke="#1E293B" strokeWidth="8" fill="none" />
          <path d="M-100,350 Q300,380 600,150 T1100,100" stroke="#334155" strokeWidth="4" fill="none" />
          <circle cx="400" cy="250" r="180" fill="url(#mapGlow)" opacity="0.15" />
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#65F5C6" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>

        {/* Map Grid Pattern */}
        <div
          className="w-full h-full opacity-10"
          style={{
            backgroundImage: `radial-gradient(#65F5C6 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Map Header Overlay Top - Clean User Context Only */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2.5 shadow-sm border border-white/10">
          <Navigation className="w-4 h-4 text-mint" aria-hidden="true" />
          <span className="text-xs font-bold text-white tracking-wide">Live Route Map</span>
        </div>

        {/* Collapsible Dev-Only Panel */}
        {import.meta.env.DEV && (
          <div className="glass-card rounded-xl border border-darkBorder text-xs text-gray-300 overflow-hidden">
            <button
              onClick={() => setShowDevPanel(!showDevPanel)}
              className="px-3 py-1.5 flex items-center gap-1.5 text-[11px] font-mono text-gray-400 hover:text-white transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-mint" />
              <span>Dev Telemetry</span>
              {showDevPanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showDevPanel && (
              <div className="px-3 py-2 border-t border-darkBorder bg-bg-primary/95 space-y-1 font-mono text-[10px]">
                <div className="text-mint font-semibold">PostGIS Vector Renderer</div>
                <div className="text-gray-400">Spatial SRID: 4326 (WGS 84)</div>
                <div className="text-gray-400">Map Style: dark-v11 (#07111F)</div>
                <div className="text-gray-400">Raw Bounds: {originLat}°N, {originLng}°E</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Interactive Polyline & Pin Layer */}
      <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none my-4">
        <div className="relative w-11/12 h-56 rounded-3xl flex items-center justify-between px-8 bg-[#0E1B2E]/60 border border-mint/20 backdrop-blur-md shadow-glass">
          {/* Pickup Point Pin */}
          <div className="flex flex-col items-center gap-1.5 max-w-[180px] text-center">
            <div className="w-11 h-11 rounded-full bg-mint text-bg-primary font-bold flex items-center justify-center shadow-mintGlow transform hover:scale-105 transition-transform pointer-events-auto cursor-pointer">
              <MapPin className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="text-[11px] font-bold text-mint bg-bg-primary/95 px-3 py-1 rounded-lg border border-mint/30 shadow-md truncate w-full">
              {originAddress.split(',')[0]}
            </span>
            <span className="text-[10px] text-gray-200 font-semibold">Pickup Point</span>
          </div>

          {/* Active Commute Trajectory Line */}
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full h-2 bg-gradient-to-r from-mint via-mint-hover to-emerald-400 rounded-full shadow-mintGlow relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-mint text-bg-primary flex items-center justify-center shadow-xl animate-pulse">
                <Navigation className="w-4.5 h-4.5 transform rotate-45" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Dropoff Point Pin */}
          <div className="flex flex-col items-center gap-1.5 max-w-[180px] text-center">
            <div className="w-11 h-11 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform pointer-events-auto cursor-pointer">
              <MapPin className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="text-[11px] font-bold text-emerald-400 bg-bg-primary/95 px-3 py-1 rounded-lg border border-emerald-500/30 shadow-md truncate w-full">
              {destAddress.split(',')[0]}
            </span>
            <span className="text-[10px] text-gray-200 font-semibold">Dropoff Point</span>
          </div>
        </div>
      </div>

      {/* Map Legend Footer */}
      <div className="relative z-10 flex items-center justify-between text-xs text-gray-300 font-medium">
        <div>
          <span>Bengaluru Region, IN</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-mint shadow-mintGlow" /> Driver Route
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Passenger Trajectory
          </span>
        </div>
      </div>
    </div>
  );
};
