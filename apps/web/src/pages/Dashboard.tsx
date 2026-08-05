import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { TerraDashboard } from './TerraDashboard';
import { WaypointModule } from './WaypointModule';
import { CivicPulsePage } from './CivicPulsePage';
import { SentinelPage } from './SentinelPage';
import { ParkingPage } from './ParkingPage';
import { UserProfilePage } from './UserProfilePage';
import { ToastContainer, ToastMessage } from '../components/common/Toast';

interface DashboardProps {
  user?: any;
  onLogout?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [isRealtimeConnected] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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

  const handleTriggerSos = () => {
    addToast(
      'emergency',
      'Emergency SOS Broadcast',
      'High-priority location signal sent to Terra Dispatchers and emergency contacts.'
    );
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col font-sans">
      <Header
        onTriggerSos={handleTriggerSos}
        isRealtimeConnected={isRealtimeConnected}
        user={user}
        onLogout={onLogout}
        activeModule={activeModule}
        onSelectModule={setActiveModule}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {activeModule === 'dashboard' && <TerraDashboard onNavigateModule={setActiveModule} />}
        {activeModule === 'waypoint' && <WaypointModule />}
        {activeModule === 'civicpulse' && <CivicPulsePage />}
        {activeModule === 'sentinel' && <SentinelPage />}
        {activeModule === 'parking' && <ParkingPage />}
        {activeModule === 'profile' && <UserProfilePage user={user} onNavigateModule={setActiveModule} />}
      </main>

      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
};
