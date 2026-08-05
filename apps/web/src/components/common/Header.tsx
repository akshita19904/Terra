import React from 'react';
import { Compass, AlertTriangle, Zap, WifiOff, LogOut, Terminal, Code, User } from 'lucide-react';
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
    <header className="w-full bg-[#1E293B] border-b border-[#334155] px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Brand & Module Nav */}
      <div className="flex items-center gap-8">
        <button
          onClick={() => onSelectModule('dashboard')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold shadow-sm">
            <Compass className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-[#F8FAFC]">TERRA</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#2563EB]/20 text-[#3B82F6] border border-[#2563EB]/30 font-semibold uppercase tracking-wider">
                Platform
              </span>
            </div>
          </div>
        </button>

        {/* Top Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0F172A] p-1 rounded-lg border border-[#334155]">
          <button
            onClick={() => onSelectModule('dashboard')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeModule === 'dashboard'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectModule('waypoint')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeModule === 'waypoint'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <span>Waypoint</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
          </button>
          <button
            onClick={() => onSelectModule('civicpulse')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeModule === 'civicpulse'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            CivicPulse
          </button>
          <button
            onClick={() => onSelectModule('sentinel')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeModule === 'sentinel'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Sentinel
          </button>
        </nav>
      </div>

      {/* Right Utility Actions */}
      <div className="flex items-center gap-3">
        {/* Developer Mode Toggle Switch */}
        <button
          onClick={toggleDevMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            isDevMode
              ? 'bg-[#2563EB]/20 border-[#2563EB] text-[#3B82F6] shadow-xs'
              : 'bg-[#0F172A] border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
          title="Toggle Developer Telemetry Mode for Technical Inspections"
        >
          {isDevMode ? <Terminal className="w-3.5 h-3.5 text-[#3B82F6]" /> : <Code className="w-3.5 h-3.5" />}
          <span>{isDevMode ? 'Dev Telemetry: ON' : 'Developer Mode'}</span>
        </button>

        {/* Real-time Connection Status */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
            isRealtimeConnected
              ? 'bg-[#16A34A]/10 border-[#16A34A]/30 text-[#16A34A]'
              : 'bg-[#DC2626]/10 border-[#DC2626]/30 text-[#DC2626]'
          }`}
          role="status"
        >
          {isRealtimeConnected ? (
            <Zap className="w-3.5 h-3.5 text-[#16A34A]" aria-hidden="true" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-[#DC2626]" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">
            {isRealtimeConnected ? 'Live Connection' : 'Offline'}
          </span>
        </div>

        {/* Emergency SOS */}
        <button
          onClick={onTriggerSos}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DC2626]/20 hover:bg-[#DC2626]/30 text-[#DC2626] border border-[#DC2626]/40 text-xs font-semibold transition-all"
          aria-label="Emergency SOS"
        >
          <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">SOS</span>
        </button>

        {/* Profile Avatar Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectModule('profile')}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
              activeModule === 'profile'
                ? 'bg-[#2563EB] text-white border-[#2563EB] ring-2 ring-[#3B82F6]/50'
                : 'bg-[#273449] border-[#334155] text-[#F8FAFC] hover:border-[#3B82F6]'
            }`}
            aria-label={`User Profile: ${firstName} ${lastName}`}
            title="View User Profile & Account Settings"
          >
            {initials}
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors cursor-pointer"
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
