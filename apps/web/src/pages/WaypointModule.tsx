import React, { useState } from 'react';
import { MapboxView } from '../components/map/MapboxView';
import { RequestWizard } from '../components/rides/RequestWizard';
import { CandidatesList } from '../components/rides/CandidatesList';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { ToastContainer, ToastMessage } from '../components/common/Toast';
import { RideLifecycleStepper, RideState } from '../components/rides/RideLifecycleStepper';
import { CandidateMatch } from '../types';

export const WaypointModule: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [candidates, setCandidates] = useState<CandidateMatch[]>([]);
  const [activeTab, setActiveTab] = useState<'matching' | 'analytics'>('matching');
  const [selectedMatch, setSelectedMatch] = useState<CandidateMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentRideState, setCurrentRideState] = useState<RideState>('CREATED');

  const [currentOrigin, setCurrentOrigin] = useState<{ lat: number; lng: number; address?: string }>({
    lat: 13.0827,
    lng: 77.5900,
    address: 'Manipal Academy of Higher Education, Bengaluru',
  });
  const [currentDest, setCurrentDest] = useState<{ lat: number; lng: number; address?: string }>({
    lat: 13.1989,
    lng: 77.6358,
    address: 'Brigade El Dorado, Aerospace Park, Bengaluru',
  });

  const baseCandidates = [
    {
      offerId: 'offer_in_1',
      driverId: 'drv_in_1',
      driverName: 'Aarav Sharma',
      driverTrustScore: 4.95,
      vehicleMakeModel: 'Tata Nexon EV (Electric)',
      availableCapacity: 3,
      routeSimilarityScore: 0.96,
      estimatedDetourSeconds: 120, // 2 mins detour
      estimatedDetourMeters: 900,
      estimatedPickupTime: new Date(Date.now() + 8 * 60000).toISOString(),
      estimatedDropoffTime: new Date(Date.now() + 28 * 60000).toISOString(),
      estimatedFare: 180,
    },
    {
      offerId: 'offer_in_2',
      driverId: 'drv_in_2',
      driverName: 'Priya Patel',
      driverTrustScore: 4.88,
      vehicleMakeModel: 'Hyundai Creta SX (Petrol)',
      availableCapacity: 2,
      routeSimilarityScore: 0.89,
      estimatedDetourSeconds: 360, // 6 mins detour
      estimatedDetourMeters: 2700,
      estimatedPickupTime: new Date(Date.now() + 12 * 60000).toISOString(),
      estimatedDropoffTime: new Date(Date.now() + 35 * 60000).toISOString(),
      estimatedFare: 240,
    },
    {
      offerId: 'offer_in_3',
      driverId: 'drv_in_3',
      driverName: 'Rohan Verma',
      driverTrustScore: 4.82,
      vehicleMakeModel: 'Mahindra XUV400 (Electric)',
      availableCapacity: 3,
      routeSimilarityScore: 0.84,
      estimatedDetourSeconds: 540, // 9 mins detour
      estimatedDetourMeters: 4100,
      estimatedPickupTime: new Date(Date.now() + 16 * 60000).toISOString(),
      estimatedDropoffTime: new Date(Date.now() + 40 * 60000).toISOString(),
      estimatedFare: 210,
    },
  ];

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast_${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleFindMatches = (payload: any) => {
    setIsLoading(true);
    setCurrentRideState('SEARCHING');
    if (payload.pickup) setCurrentOrigin(payload.pickup);
    if (payload.dropoff) setCurrentDest(payload.dropoff);

    const maxDetourMins = payload.maxDetourMinutes || 10;
    const maxDetourSecs = maxDetourMins * 60;

    setTimeout(() => {
      const validCandidates = baseCandidates
        .filter((c) => c.estimatedDetourSeconds <= maxDetourSecs)
        .map((c) => {
          const detourScore = Math.max(0, 1 - c.estimatedDetourSeconds / maxDetourSecs);
          const trustScoreNorm = c.driverTrustScore / 5.0;

          const matchScore = Number(
            (0.35 * c.routeSimilarityScore + 0.25 * detourScore + 0.25 * 0.9 + 0.15 * trustScoreNorm).toFixed(4)
          );

          return {
            ...c,
            matchScore,
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore);

      setCandidates(validCandidates);
      setIsLoading(false);
      setCurrentRideState('MATCHED');
      addToast(
        'success',
        'Match Search Complete',
        `Found ${validCandidates.length} recommended ride match(es) for your route.`
      );
    }, 400);
  };

  const handleConfirmMatch = (match: CandidateMatch) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
    setCurrentRideState('ACCEPTED');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Navigation Mode Tabs */}
      <div className="flex items-center justify-between border-b border-darkBorder pb-4">
        <div className="flex items-center gap-3" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'matching'}
            onClick={() => setActiveTab('matching')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'matching'
                ? 'bg-mint text-bg-primary shadow-mintGlow'
                : 'bg-bg-secondary text-gray-400 hover:text-white border border-darkBorder'
            }`}
          >
            Find Ride Match
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-mint text-bg-primary shadow-mintGlow'
                : 'bg-bg-secondary text-gray-400 hover:text-white border border-darkBorder'
            }`}
          >
            Commute Analytics & Savings
          </button>
        </div>

        <div className="text-xs font-semibold text-mint bg-mint/10 px-3 py-1 rounded-lg border border-mint/20">
          🇮🇳 Region: Bengaluru Metro Corridors
        </div>
      </div>

      {/* Ride Lifecycle State Stepper */}
      <RideLifecycleStepper currentState={currentRideState} />

      {activeTab === 'matching' ? (
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column: Form & Scored Candidate List */}
          <div className="col-span-5 space-y-6">
            <RequestWizard onFindMatches={handleFindMatches} isLoading={isLoading} />
            <CandidatesList candidates={candidates} onConfirmMatch={handleConfirmMatch} />
          </div>

          {/* Right Column: Map Canvas Visualizer */}
          <div className="col-span-7">
            <MapboxView origin={currentOrigin} destination={currentDest} />
          </div>
        </div>
      ) : (
        <AnalyticsDashboard />
      )}

      {/* Structured Dark Glassmorphic Dialog Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        match={selectedMatch}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Custom Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
};
