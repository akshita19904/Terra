import React from 'react';
import { Compass, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface HeaderProps {
  onTriggerSos: () => void;
  isRealtimeConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onTriggerSos, isRealtimeConnected }) => {
  return (
    <header className="w-full glass-panel border-b border-darkBorder px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mint-hover to-mint flex items-center justify-center shadow-mintGlow">
          <Compass className="w-6 h-6 text-bg-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">TERRA</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-mint/10 text-mint border border-mint/20 font-medium">
              Waypoint v1.0
            </span>
          </div>
          <p className="text-xs text-gray-400">Intelligent Commute & Urban Operations Platform</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Real-time Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-secondary border border-darkBorder text-xs">
          <Zap className={`w-3.5 h-3.5 ${isRealtimeConnected ? 'text-mint animate-pulse' : 'text-gray-500'}`} />
          <span className="text-gray-300 font-medium">
            {isRealtimeConnected ? 'Live Socket Connected' : 'Connecting WebSocket...'}
          </span>
        </div>

        {/* Emergency SOS Button */}
        <button
          onClick={onTriggerSos}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-semibold transition-all shadow-sm"
        >
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>Emergency SOS</span>
        </button>

        {/* User Profile Avatar */}
        <div className="w-9 h-9 rounded-full bg-bg-secondary border border-darkBorder flex items-center justify-center text-xs font-bold text-mint">
          JD
        </div>
      </div>
    </header>
  );
};
