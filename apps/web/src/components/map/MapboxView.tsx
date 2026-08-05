import React from 'react';
import { Navigation, MapPin, Layers } from 'lucide-react';

interface MapboxViewProps {
  origin?: { lat: number; lng: number; address?: string };
  destination?: { lat: number; lng: number; address?: string };
}

export const MapboxView: React.FC<MapboxViewProps> = ({ origin, destination }) => {
  return (
    <div className="relative w-full h-[520px] rounded-2xl glass-panel overflow-hidden border border-darkBorder flex flex-col justify-between p-6">
      {/* Mock Map Canvas Visualizer */}
      <div className="absolute inset-0 bg-[#07111F] opacity-90">
        {/* Decorative Grid Lines to simulate dark vector map tiles */}
        <div
          className="w-full h-full opacity-10"
          style={{
            backgroundImage: `radial-gradient(#65F5C6 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Map Control Overlay Top */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3">
          <Layers className="w-4 h-4 text-mint" />
          <span className="text-xs font-semibold text-white">PostGIS Vector Tile Renderer</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-mint/10 text-mint border border-mint/20">
            SRID 4326
          </span>
        </div>

        <div className="glass-card px-3 py-2 rounded-xl text-xs text-gray-300">
          Mapbox GL JS v3.5
        </div>
      </div>

      {/* Simulated Polyline Vector Overlay */}
      <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none">
        <div className="relative w-4/5 h-48 border-2 border-dashed border-mint/40 rounded-3xl flex items-center justify-between px-12 bg-mint/5 backdrop-blur-xs">
          {/* Origin Marker */}
          <div className="flex flex-col items-center gap-1 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-mint text-bg-primary font-bold flex items-center justify-center shadow-mintGlow">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-mint bg-bg-primary/80 px-2 py-0.5 rounded border border-mint/20">
              Pickup Point
            </span>
          </div>

          {/* Route Segment Flow */}
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full h-1 bg-gradient-to-r from-mint via-mint-hover to-emerald-400 rounded-full shadow-mintGlow relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-mint text-bg-primary flex items-center justify-center shadow-lg">
                <Navigation className="w-3.5 h-3.5 transform rotate-45" />
              </div>
            </div>
          </div>

          {/* Destination Marker */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shadow-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 bg-bg-primary/80 px-2 py-0.5 rounded border border-emerald-500/20">
              Dropoff Point
            </span>
          </div>
        </div>
      </div>

      {/* Map Footer Information */}
      <div className="relative z-10 flex items-center justify-between text-xs text-gray-400">
        <div>
          <span>Lat: 37.7749° N, Lng: 122.4194° W</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-mint"></span> Driver Polyline
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Passenger Trajectory
          </span>
        </div>
      </div>
    </div>
  );
};
