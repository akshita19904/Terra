import React from 'react';
import { Compass, AlertTriangle, Zap, WifiOff, LogOut, Terminal, Code } from 'lucide-react';
import { useDevMode } from '../../context/DevModeContext';

interface HeaderProps {
  onTriggerSos: () => void;
  isRealtimeConnected: boolean;
  user?: { firstName?: string; lastName?: string; email?: string } | null;
  onLogout?: () => void;
  activeModule: string;
  onSelectModule: (module: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onTriggerSos,
  isRealtimeConnected,
  user,
  onLogout,
  activeModule,
  onSelectModule,
}) => {
  const { isDevMode, toggleDevMode } = useDevMode();
  const firstName = user?.firstName || 'John';
  const lastName = user?.lastName || 'Doe';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <header className="w-full glass-panel border-b border-darkBorder px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
      {/* Brand & Module Nav */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => onSelectModule('dashboard')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mint-hover to-mint flex items-center justify-center shadow-mintGlow group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 text-bg-primary" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white">TERRA</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-mint/20 text-mint border border-mint/40 font-extrabold tracking-wide uppercase">
                Urban Operations Platform
              </span>
            </div>
            <p className="text-xs text-gray-300 font-medium">Flagship: Waypoint Commute Engine</p>
          </div>
        </button>

        {/* Top Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-bg-secondary/70 p-1 rounded-xl border border-darkBorder">
          <button
            onClick={() => onSelectModule('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeModule === 'dashboard'
                ? 'bg-mint text-bg-primary shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectModule('waypoint')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeModule === 'waypoint'
                ? 'bg-mint text-bg-primary shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Waypoint</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
          <button
            onClick={() => onSelectModule('civicpulse')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeModule === 'civicpulse'
                ? 'bg-mint text-bg-primary shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            CivicPulse
          </button>
          <button
            onClick={() => onSelectModule('sentinel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeModule === 'sentinel'
                ? 'bg-mint text-bg-primary shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sentinel
          </button>
          <button
            onClick={() => onSelectModule('parking')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeModule === 'parking'
                ? 'bg-mint text-bg-primary shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Smart Parking
          </button>
        </nav>
      </div>

      {/* Right Utility Actions */}
      <div className="flex items-center gap-3">
        {/* Developer Mode Toggle Switch */}
        <button
          onClick={toggleDevMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
            isDevMode
              ? 'bg-mint/20 border-mint/60 text-mint ring-1 ring-mint/40 shadow-mintGlow'
              : 'bg-bg-secondary border-darkBorder text-gray-400 hover:text-white'
          }`}
          title="Toggle Developer Telemetry Mode for Interview Inspections"
        >
          {isDevMode ? <Terminal className="w-3.5 h-3.5 text-mint" /> : <Code className="w-3.5 h-3.5" />}
          <span>{isDevMode ? 'Dev Telemetry: ON' : 'Dev Mode'}</span>
        </button>

        {/* Real-time Connection Status */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
            isRealtimeConnected
              ? 'bg-mint/15 border-mint/30 text-mint'
              : 'bg-red-950/40 border-red-500/30 text-red-300'
          }`}
          role="status"
        >
          {isRealtimeConnected ? (
            <Zap className="w-3.5 h-3.5 text-mint animate-pulse" aria-hidden="true" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">
            {isRealtimeConnected ? 'Live Connection' : 'Offline'}
          </span>
        </div>

        {/* Emergency SOS */}
        <button
          onClick={onTriggerSos}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600/40 text-red-200 border border-red-500/50 text-xs font-bold transition-all"
          aria-label="Emergency SOS"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-300" aria-hidden="true" />
          <span className="hidden sm:inline">SOS</span>
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-full bg-mint/15 border border-mint/40 flex items-center justify-center text-xs font-extrabold text-mint shadow-sm"
            aria-label={`User Profile: ${firstName} ${lastName}`}
          >
            {initials}
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Log out"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
