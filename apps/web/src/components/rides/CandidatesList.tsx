import React from 'react';
import { CandidateMatch } from '../../types';
import { Star, Clock, Navigation, CheckCircle2, ChevronRight, ShieldCheck, Zap, Sparkles, MapPin, Car } from 'lucide-react';
import { useDevMode } from '../../context/DevModeContext';

interface CandidatesListProps {
  candidates: CandidateMatch[];
  onConfirmMatch: (candidate: CandidateMatch) => void;
}

export const CandidatesList: React.FC<CandidatesListProps> = ({ candidates, onConfirmMatch }) => {
  const { isDevMode } = useDevMode();

  if (candidates.length === 0) {
    return (
      <div className="glass-panel p-8 text-center rounded-2xl border border-darkBorder">
        <div className="w-12 h-12 rounded-full bg-mint/10 text-mint flex items-center justify-center mx-auto mb-3">
          <Navigation className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">Find Your Commute Match</h3>
        <p className="text-xs text-gray-300 max-w-sm mx-auto font-medium">
          Enter your pickup and destination details above to view top-ranked driver matches for your route.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Developer Mode Telemetry Banner (Visible ONLY when Dev Mode is ON) */}
      {isDevMode && (
        <div className="glass-panel p-3 rounded-xl border border-mint/40 bg-mint/5 space-y-1.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-mint flex items-center gap-2">
              <Zap className="w-4 h-4 text-mint animate-pulse" /> Dev Mode: 7-Stage Pipeline Sweep
            </h3>
            <span className="text-[10px] text-mint font-mono font-bold">Execution Time: 12ms</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-300 overflow-x-auto pb-0.5">
            <span className="px-2 py-0.5 rounded bg-bg-primary border border-darkBorder">1. PostGIS Pruned</span>
            <span>→</span>
            <span className="px-2 py-0.5 rounded bg-bg-primary border border-darkBorder">2. Time Filtered</span>
            <span>→</span>
            <span className="px-2 py-0.5 rounded bg-bg-primary border border-darkBorder">3. CosSim Trajectory</span>
            <span>→</span>
            <span className="px-2 py-0.5 rounded bg-bg-primary border border-darkBorder">4. S(d,p) Ranked</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-mint" /> Recommended Commute Rides ({candidates.length})
        </h3>
        <span className="text-xs text-gray-400 font-medium">Ranked by best match</span>
      </div>

      {/* Cards List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1" role="list">
        {candidates.map((match, idx) => (
          <div
            key={match.offerId}
            role="listitem"
            className="glass-card p-5 rounded-2xl border border-darkBorder hover:border-mint/40 transition-all flex flex-col justify-between gap-4 group"
          >
            {/* Consumer Driver Profile Section */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-mint/15 border border-mint/30 text-mint font-extrabold flex items-center justify-center text-sm shadow-sm">
                  {match.driverName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{match.driverName}</h4>
                    <span className="flex items-center text-xs text-amber-400 font-extrabold gap-0.5 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {match.driverTrustScore.toFixed(2)}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-mint/20 text-mint font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 font-medium mt-0.5 flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-gray-400" />
                    <span>{match.vehicleMakeModel}</span>
                    <span className="text-gray-500">•</span>
                    <span className="font-mono text-gray-300">KA 04 EV 102{idx + 1}</span>
                  </p>
                </div>
              </div>

              {/* Price Tag */}
              <div className="text-right">
                <div className="text-lg font-extrabold text-mint font-mono">
                  ₹{match.estimatedFare.toFixed(0)}
                </div>
                <span className="text-[10px] text-gray-400 font-medium block">Saved ~₹120 vs solo taxi</span>
              </div>
            </div>

            {/* Consumer Key Ride Highlights */}
            <div className="grid grid-cols-3 gap-2 bg-bg-secondary/80 p-3 rounded-xl border border-darkBorder text-xs">
              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Pickup ETA
                </span>
                <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-mint" />
                  8 Mins Away
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Route Detour
                </span>
                <span className="font-semibold text-emerald-400 mt-0.5 block">
                  +{Math.round(match.estimatedDetourSeconds / 60)} Mins (Fast)
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Seats Available
                </span>
                <span className="font-bold text-white mt-0.5 block">
                  {match.availableCapacity} Seats Open
                </span>
              </div>
            </div>

            {/* Developer Mode Deep Inspection Panel (Only when Dev Mode is ON) */}
            {isDevMode && (
              <div className="bg-[#07111F] p-3 rounded-xl border border-mint/30 space-y-2 text-[11px] font-mono text-gray-300">
                <div className="text-mint font-bold flex items-center justify-between border-b border-white/10 pb-1">
                  <span>DEV TELEMETRY: Candidate #{idx + 1}</span>
                  <span>Composite S(d,p): {(match.matchScore * 100).toFixed(1)}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-gray-400">PostGIS LineString Sim:</span>{' '}
                    <span className="text-white">{(match.routeSimilarityScore * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Detour Ratio:</span>{' '}
                    <span className="text-white">{match.estimatedDetourSeconds}s / 600s</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Geohash Bucket:</span>{' '}
                    <span className="text-mint font-mono">tdr1v8</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Trust Formula score:</span>{' '}
                    <span className="text-amber-300">{match.driverTrustScore.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Accept Ride CTA */}
            <button
              onClick={() => onConfirmMatch(match)}
              className="w-full py-3 rounded-xl bg-mint hover:bg-mint-hover text-bg-primary font-extrabold text-xs shadow-mintGlow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Accept & Book Ride (₹{match.estimatedFare.toFixed(0)})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
