import React from 'react';
import { CheckCircle2, X, Car, ShieldCheck, MapPin, Clock, Navigation } from 'lucide-react';
import { CandidateMatch } from '../../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  match: CandidateMatch | null;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, match, onClose }) => {
  if (!isOpen || !match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0E1B2E] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Subtle Background Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-mint/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-mint/15 border border-mint/30 text-mint flex items-center justify-center shadow-mintGlow">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 id="modal-title" className="text-lg font-bold text-white tracking-tight">
                Match Confirmed
              </h3>
              <p className="text-xs text-mint font-medium">Your commute seat is reserved</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Driver & Vehicle Card */}
        <div className="bg-bg-primary/80 border border-darkBorder rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-darkBorder pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                Assigned Driver
              </span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                {match.driverName}
                <span className="text-xs text-amber-400 flex items-center gap-0.5">
                  ★ {match.driverTrustScore.toFixed(2)}
                </span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                Total Fare
              </span>
              <span className="text-base font-extrabold text-mint">
                ₹{match.estimatedFare.toFixed(0)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <Car className="w-4 h-4 text-mint shrink-0" />
              <span className="truncate">{match.vehicleMakeModel}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <ShieldCheck className="w-4 h-4 text-mint shrink-0" />
              <span>Verified Match</span>
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="space-y-2 text-xs bg-bg-primary/50 p-3.5 rounded-xl border border-darkBorder">
          <div className="flex items-center justify-between text-gray-300">
            <span className="flex items-center gap-1.5 text-gray-400">
              <Clock className="w-3.5 h-3.5 text-mint" /> Estimated Detour
            </span>
            <span className="font-semibold text-white">{Math.round(match.estimatedDetourSeconds / 60)} mins</span>
          </div>

          <div className="flex items-center justify-between text-gray-300">
            <span className="flex items-center gap-1.5 text-gray-400">
              <Navigation className="w-3.5 h-3.5 text-mint" /> Route Alignment
            </span>
            <span className="font-semibold text-white">{(match.routeSimilarityScore * 100).toFixed(0)}% aligned</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-mint to-mint-hover text-bg-primary font-bold text-sm shadow-mintGlow hover:opacity-95 transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};
