import React from 'react';
import { CandidateMatch } from '../../types';
import { Star, ShieldCheck, Clock, Navigation, CheckCircle2, ChevronRight } from 'lucide-react';

interface CandidatesListProps {
  candidates: CandidateMatch[];
  onConfirmMatch: (candidate: CandidateMatch) => void;
}

export const CandidatesList: React.FC<CandidatesListProps> = ({ candidates, onConfirmMatch }) => {
  if (candidates.length === 0) {
    return (
      <div className="glass-panel p-8 text-center rounded-2xl border border-darkBorder">
        <div className="w-12 h-12 rounded-full bg-mint/10 text-mint flex items-center justify-center mx-auto mb-3">
          <Navigation className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">No Active Match Sweep Run Yet</h3>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          Submit your commute details above to execute the PostGIS spatial candidate evaluation pipeline.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-mint" /> Evaluated Candidates ({candidates.length})
        </h3>
        <span className="text-xs text-gray-400">Ranked by Multi-Objective Score S(d, p)</span>
      </div>

      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
        {candidates.map((match, idx) => (
          <div
            key={match.offerId}
            className="glass-card p-5 rounded-2xl border border-darkBorder flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-mint/10 border border-mint/20 text-mint font-bold flex items-center justify-center text-sm">
                  #{idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {match.driverName}
                    <span className="flex items-center text-xs text-amber-400 font-semibold gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {match.driverTrustScore.toFixed(2)}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-400">
                    {match.vehicleMakeModel} • {match.availableCapacity} seats open
                  </p>
                </div>
              </div>

              {/* Composite Score Badge */}
              <div className="text-right">
                <div className="text-xs font-bold px-3 py-1 rounded-full bg-mint/15 text-mint border border-mint/30 inline-flex items-center gap-1 shadow-mintGlow">
                  <span>Match Score:</span>
                  <span className="text-sm font-extrabold font-mono">
                    {(match.matchScore * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate Metric Badges Grid */}
            <div className="grid grid-cols-3 gap-2 bg-bg-secondary/60 p-3 rounded-xl border border-darkBorder text-xs">
              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider">
                  Pickup Detour
                </span>
                <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-mint" />
                  {Math.round(match.estimatedDetourSeconds / 60)} mins
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider">
                  Route Similarity
                </span>
                <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                  <Navigation className="w-3 h-3 text-mint" />
                  {(match.routeSimilarityScore * 100).toFixed(0)}% aligned
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider">
                  Calculated Fare
                </span>
                <span className="font-extrabold text-mint mt-0.5">
                  ${match.estimatedFare.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Confirm Match CTA */}
            <button
              onClick={() => onConfirmMatch(match)}
              className="w-full py-2.5 rounded-xl bg-bg-secondary hover:bg-mint/10 hover:border-mint/30 border border-darkBorder text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group"
            >
              <span>Confirm & Lock Commute Match</span>
              <ChevronRight className="w-4 h-4 text-mint group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
