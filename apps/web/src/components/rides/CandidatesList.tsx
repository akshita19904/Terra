import React from 'react';
import { CandidateMatch } from '../../types';
import { Star, Clock, Navigation, CheckCircle2, ChevronRight, ShieldCheck, Zap } from 'lucide-react';

interface CandidatesListProps {
  candidates: CandidateMatch[];
  onConfirmMatch: (candidate: CandidateMatch) => void;
}

export const CandidatesList: React.FC<CandidatesListProps> = ({ candidates, onConfirmMatch }) => {
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
      {/* Matching Pipeline Header & Badge */}
      <div className="glass-panel p-3 rounded-xl border border-darkBorder space-y-1.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-mint" aria-hidden="true" /> Evaluated Matches ({candidates.length})
          </h3>
          <span className="text-[11px] text-mint font-semibold">7-Stage Pipeline Sweep</span>
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

      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1" role="list">
        {candidates.map((match, idx) => (
          <div
            key={match.offerId}
            role="listitem"
            className="glass-card p-5 rounded-2xl border border-darkBorder flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-mint/15 border border-mint/30 text-mint font-bold flex items-center justify-center text-sm"
                  aria-label={`Rank position ${idx + 1}`}
                >
                  #{idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {match.driverName}
                    <span
                      className="flex items-center text-xs text-amber-400 font-bold gap-0.5 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30"
                      aria-label={`Structured Trust Score ${match.driverTrustScore.toFixed(2)} out of 5.00`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                      Trust Score: {match.driverTrustScore.toFixed(2)} / 5.00
                    </span>
                  </h4>
                  <p className="text-xs text-gray-300 font-medium mt-0.5">
                    {match.vehicleMakeModel} • {match.availableCapacity} seats open • Verified Driver
                  </p>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="text-right">
                <div className="text-xs font-bold px-3 py-1 rounded-full bg-mint/20 text-mint border border-mint/40 inline-flex items-center gap-1 shadow-xs">
                  <span>Match Score:</span>
                  <span className="text-sm font-extrabold font-mono">
                    {Math.round(match.matchScore * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate Metric Badges Grid */}
            <div className="grid grid-cols-3 gap-2 bg-bg-secondary/70 p-3 rounded-xl border border-darkBorder text-xs">
              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Pickup Detour
                </span>
                <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-mint" aria-hidden="true" />
                  {Math.round(match.estimatedDetourSeconds / 60)} mins
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Route Alignment
                </span>
                <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                  <Navigation className="w-3 h-3 text-mint" aria-hidden="true" />
                  {Math.round(match.routeSimilarityScore * 100)}% aligned
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Calculated Fare
                </span>
                <span className="font-extrabold text-mint mt-0.5 text-sm">
                  ₹{match.estimatedFare.toFixed(0)}
                </span>
              </div>
            </div>

            {/* Confirm Match CTA */}
            <button
              onClick={() => onConfirmMatch(match)}
              className="w-full py-2.5 rounded-xl bg-bg-secondary hover:bg-mint/15 hover:border-mint/40 border border-darkBorder text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group focus:ring-2 focus:ring-mint focus:ring-offset-2 focus:ring-offset-[#07111F]"
              aria-label={`Confirm commute match with ${match.driverName} for ₹${match.estimatedFare.toFixed(0)}`}
            >
              <span>Confirm Commute Match</span>
              <ChevronRight className="w-4 h-4 text-mint group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
