import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { MapboxView } from '../components/map/MapboxView';
import { RequestWizard } from '../components/rides/RequestWizard';
import { CandidatesList } from '../components/rides/CandidatesList';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { ToastContainer, ToastMessage } from '../components/common/Toast';
import { CandidateMatch } from '../types';

export const Dashboard: React.FC = () => {
  const [isRealtimeConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [candidates, setCandidates] = useState<CandidateMatch[]>([]);
  const [activeTab, setActiveTab] = useState<'matching' | 'analytics'>('matching');
  const [selectedMatch, setSelectedMatch] = useState<CandidateMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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
    if (payload.pickup) setCurrentOrigin(payload.pickup);
    if (payload.dropoff) setCurrentDest(payload.dropoff);

    setTimeout(() => {
      setCandidates([
        {
          offerId: 'offer_in_1',
          driverId: 'drv_in_1',
          driverName: 'Aarav Sharma',
          driverTrustScore: 4.95,
          vehicleMakeModel: 'Tata Nexon EV (Electric)',
          availableCapacity: 3,
          matchScore: 0.9480,
          routeSimilarityScore: 0.96,
          estimatedDetourSeconds: 240,
          estimatedDetourMeters: 1800,
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
          matchScore: 0.8820,
          routeSimilarityScore: 0.89,
          estimatedDetourSeconds: 380,
          estimatedDetourMeters: 2900,
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
          matchScore: 0.8350,
          routeSimilarityScore: 0.84,
          estimatedDetourSeconds: 450,
          estimatedDetourMeters: 3400,
          estimatedPickupTime: new Date(Date.now() + 16 * 60000).toISOString(),
          estimatedDropoffTime: new Date(Date.now() + 40 * 60000).toISOString(),
          estimatedFare: 210,
        },
      ]);
      setIsLoading(false);
      addToast('success', 'Optimization Sweep Complete', 'Ranked 3 candidates for your Indian route.');
    }, 900);
  };

  const handleConfirmMatch = (match: CandidateMatch) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleTriggerSos = () => {
    addToast(
      'emergency',
      'Emergency SOS Broadcast',
      'High-priority location signal sent to Terra Dispatchers and emergency contacts.'
    );
  };

  return (
    <div className="min-h-screen bg-bg-primary text-gray-100 flex flex-col font-sans">
      <Header onTriggerSos={handleTriggerSos} isRealtimeConnected={isRealtimeConnected} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
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
              Intelligent Ride Matching
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
              Platform Operations Analytics
            </button>
          </div>

          <div className="text-xs font-semibold text-mint bg-mint/10 px-3 py-1 rounded-lg border border-mint/20">
            🇮🇳 Region: Bengaluru & Indian Metro Corridors
          </div>
        </div>

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
      </main>

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
