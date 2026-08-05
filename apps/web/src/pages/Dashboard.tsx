import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { MapboxView } from '../components/map/MapboxView';
import { RequestWizard } from '../components/rides/RequestWizard';
import { CandidatesList } from '../components/rides/CandidatesList';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { CandidateMatch } from '../types';

export const Dashboard: React.FC = () => {
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [candidates, setCandidates] = useState<CandidateMatch[]>([]);
  const [activeTab, setActiveTab] = useState<'matching' | 'analytics'>('matching');

  const handleFindMatches = (payload: any) => {
    setIsLoading(true);
    // Simulate candidate evaluation run from backend matching engine
    setTimeout(() => {
      setCandidates([
        {
          offerId: 'offer_1',
          driverId: 'drv_1',
          driverName: 'Alex Rivera',
          driverTrustScore: 4.92,
          vehicleMakeModel: 'Tesla Model 3 (Electric)',
          availableCapacity: 3,
          matchScore: 0.9425,
          routeSimilarityScore: 0.96,
          estimatedDetourSeconds: 240,
          estimatedDetourMeters: 1800,
          estimatedPickupTime: new Date(Date.now() + 8 * 60000).toISOString(),
          estimatedDropoffTime: new Date(Date.now() + 28 * 60000).toISOString(),
          estimatedFare: 8.75,
        },
        {
          offerId: 'offer_2',
          driverId: 'drv_2',
          driverName: 'Sarah Chen',
          driverTrustScore: 4.88,
          vehicleMakeModel: 'Toyota Prius (Hybrid)',
          availableCapacity: 2,
          matchScore: 0.8710,
          routeSimilarityScore: 0.89,
          estimatedDetourSeconds: 380,
          estimatedDetourMeters: 2900,
          estimatedPickupTime: new Date(Date.now() + 12 * 60000).toISOString(),
          estimatedDropoffTime: new Date(Date.now() + 35 * 60000).toISOString(),
          estimatedFare: 7.20,
        },
      ]);
      setIsLoading(false);
    }, 1200);
  };

  const handleConfirmMatch = (match: CandidateMatch) => {
    alert(`🎉 Commute Match Confirmed with ${match.driverName}! Match score: ${(match.matchScore * 100).toFixed(1)}%`);
  };

  const handleTriggerSos = () => {
    alert('🚨 EMERGENCY SOS BROADCAST: High priority location signal sent to Terra Dispatchers!');
  };

  return (
    <div className="min-h-screen bg-bg-primary text-gray-100 flex flex-col font-sans">
      <Header onTriggerSos={handleTriggerSos} isRealtimeConnected={isRealtimeConnected} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-3 border-b border-darkBorder pb-4">
          <button
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

        {activeTab === 'matching' ? (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column: Form & Scored Candidate List */}
            <div className="col-span-5 space-y-6">
              <RequestWizard onFindMatches={handleFindMatches} isLoading={isLoading} />
              <CandidatesList candidates={candidates} onConfirmMatch={handleConfirmMatch} />
            </div>

            {/* Right Column: Map Canvas Visualizer */}
            <div className="col-span-7">
              <MapboxView />
            </div>
          </div>
        ) : (
          <AnalyticsDashboard />
        )}
      </main>
    </div>
  );
};
