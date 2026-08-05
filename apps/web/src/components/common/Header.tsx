import React from 'react';
import { Compass, AlertTriangle, Zap, WifiOff, LogOut } from 'lucide-react';

interface HeaderProps {
  onTriggerSos: () => void;
  isRealtimeConnected: boolean;
  user?: { firstName?: string; lastName?: string; email?: string } | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onTriggerSos, isRealtimeConnected, user, onLogout }) => {
  const firstName = user?.firstName || 'John';
  const lastName = user?.lastName || 'Doe';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <header className="w-full glass-panel border-b border-darkBorder px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mint-hover to-mint flex items-center justify-center shadow-mintGlow"
          aria-hidden="true"
        >
          <Compass className="w-6 h-6 text-bg-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-white">TERRA</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint/20 text-mint border border-mint/40 font-bold shadow-xs">
              Waypoint v1.0
            </span>
          </div>
          <p className="text-xs text-gray-300 font-medium">Intelligent Commute & Urban Operations Platform</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Real-time Status Badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
            isRealtimeConnected
              ? 'bg-mint/15 border-mint/30 text-mint'
              : 'bg-red-950/40 border-red-500/30 text-red-300'
          }`}
          role="status"
          aria-live="polite"
        >
          {isRealtimeConnected ? (
            <Zap className="w-3.5 h-3.5 text-mint animate-pulse" aria-hidden="true" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
          )}
          <span>{isRealtimeConnected ? 'Live Socket Connected' : 'Offline / Disconnected'}</span>
        </div>

        {/* Emergency SOS Button */}
        <button
          onClick={onTriggerSos}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/30 hover:bg-red-600/40 text-red-200 border border-red-500/50 text-xs font-bold transition-all focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#07111F]"
          aria-label="Trigger Emergency SOS notification to dispatchers"
        >
          <AlertTriangle className="w-4 h-4 text-red-300" aria-hidden="true" />
          <span>Emergency SOS</span>
        </button>

        {/* User Profile Avatar with Initials */}
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-full bg-mint/15 border border-mint/40 flex items-center justify-center text-xs font-extrabold text-mint shadow-sm"
            aria-label={`User Profile: ${firstName} ${lastName}`}
            role="img"
          >
            {initials}
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Log out of session"
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
