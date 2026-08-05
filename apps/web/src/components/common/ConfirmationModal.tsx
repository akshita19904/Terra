import React from 'react';
import { CandidateMatch } from '../../types';
import { CheckCircle2, Star, Clock, Navigation, Car, ShieldCheck } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  match: CandidateMatch | null;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, match, onClose }) => {
  if (!isOpen || !match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md card-slate p-6 space-y-5 border border-[#334155] shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold text-[#F8FAFC]">Commute Match Confirmed!</h3>
          <p className="text-xs text-[#94A3B8]">
            Your ride with <strong className="text-[#F8FAFC]">{match.driverName}</strong> has been successfully booked.
          </p>
        </div>

        {/* Structured Driver & Vehicle Card */}
        <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155] space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8]">Driver Name</span>
            <span className="font-semibold text-[#F8FAFC] flex items-center gap-1">
              {match.driverName}
              <span className="text-amber-400 font-bold flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400" />
                {match.driverTrustScore.toFixed(2)}
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8]">Vehicle Model</span>
            <span className="font-semibold text-[#F8FAFC] flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-[#3B82F6]" />
              {match.vehicleMakeModel}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8]">Pickup Detour</span>
            <span className="font-semibold text-[#16A34A]">
              +{Math.round(match.estimatedDetourSeconds / 60)} Mins
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8]">Route Alignment</span>
            <span className="font-semibold text-[#3B82F6]">
              {Math.round(match.routeSimilarityScore * 100)}% Aligned
            </span>
          </div>

          <div className="pt-2 border-t border-[#334155] flex items-center justify-between">
            <span className="font-bold text-[#F8FAFC]">Total Calculated Fare</span>
            <span className="text-lg font-bold text-[#16A34A] font-mono">
              ₹{match.estimatedFare.toFixed(0)}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-primary py-2.5 cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
