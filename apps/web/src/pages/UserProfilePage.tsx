import React, { useState } from 'react';
import { User, ShieldCheck, Star, MapPin, Clock, Car, Heart, Settings, Plus, Trash2, RotateCcw, CheckCircle2, ChevronRight, Award, Leaf, Wallet } from 'lucide-react';

interface UserProfilePageProps {
  user?: any;
  onNavigateModule: (module: string) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, onNavigateModule }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'saved_places' | 'history' | 'favorites' | 'settings'>('overview');

  const [savedPlaces, setSavedPlaces] = useState([
    { id: '1', label: 'Home', address: 'Manipal Academy of Higher Education, Yelahanka, Bengaluru', icon: '🏠' },
    { id: '2', label: 'Office', address: 'Brigade El Dorado, Aerospace Park, Bengaluru', icon: '🏢' },
    { id: '3', label: 'Gym', address: 'Cult.Fit Yelahanka New Town, Bengaluru', icon: '🏋️' },
    { id: '4', label: 'University', address: 'BMS College of Engineering, Basavanagudi, Bengaluru', icon: '🎓' },
  ]);

  const rideHistory = [
    {
      id: 'ride_101',
      date: 'Wed, 5 Aug 2026 • 08:30 AM',
      pickup: 'Manipal Academy, Yelahanka',
      dropoff: 'Brigade El Dorado, Aerospace Park',
      driverName: 'Aarav Sharma',
      vehicle: 'Tata Nexon EV (Electric)',
      fare: 180,
      status: 'COMPLETED',
      rating: 5,
    },
    {
      id: 'ride_102',
      date: 'Mon, 3 Aug 2026 • 05:45 PM',
      pickup: 'Koramangala 5th Block',
      dropoff: 'Indiranagar 100ft Road',
      driverName: 'Priya Patel',
      vehicle: 'Hyundai Creta SX (Petrol)',
      fare: 240,
      status: 'COMPLETED',
      rating: 5,
    },
    {
      id: 'ride_103',
      date: 'Fri, 31 Jul 2026 • 09:15 AM',
      pickup: 'Indiranagar Metro',
      dropoff: 'Whitefield ITPL Tech Park',
      driverName: 'Rohan Verma',
      vehicle: 'Mahindra XUV400 (Electric)',
      fare: 210,
      status: 'COMPLETED',
      rating: 4,
    },
  ];

  const favoriteDrivers = [
    { id: 'drv_1', name: 'Aarav Sharma', vehicle: 'Tata Nexon EV', rating: 4.95, totalRides: 42, photo: 'AS' },
    { id: 'drv_2', name: 'Priya Patel', vehicle: 'Hyundai Creta SX', rating: 4.88, totalRides: 28, photo: 'PP' },
  ];

  const handleDeleteSavedPlace = (id: string) => {
    setSavedPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Profile Overview Card */}
      <div className="card-slate p-6 space-y-6 border border-[#334155]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#3B82F6] text-xl font-bold flex items-center justify-center shadow-md">
              {user?.firstName?.charAt(0) || 'J'}{user?.lastName?.charAt(0) || 'D'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#F8FAFC]">
                  {user?.firstName || 'John'} {user?.lastName || 'Doe'}
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Member
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5 font-medium">
                {user?.email || 'driver.demo@terra.in'} • +91 98765 43210
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateModule('waypoint')}
              className="btn-primary py-2 text-xs"
            >
              Book New Commute
            </button>
          </div>
        </div>

        {/* Profile Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#334155]">
          <div className="bg-[#0F172A] p-3 rounded-xl border border-[#334155]">
            <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider block">Trust Score</span>
            <span className="text-lg font-bold text-[#F59E0B] font-mono flex items-center gap-1 mt-0.5">
              <Star className="w-4 h-4 fill-[#F59E0B]" /> 4.95 / 5.00
            </span>
          </div>

          <div className="bg-[#0F172A] p-3 rounded-xl border border-[#334155]">
            <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider block">Completed Rides</span>
            <span className="text-lg font-bold text-[#F8FAFC] font-mono mt-0.5 block">142 Trips</span>
          </div>

          <div className="bg-[#0F172A] p-3 rounded-xl border border-[#334155]">
            <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider block">CO₂ Saved</span>
            <span className="text-lg font-bold text-[#16A34A] font-mono flex items-center gap-1 mt-0.5">
              <Leaf className="w-4 h-4" /> 120 kg
            </span>
          </div>

          <div className="bg-[#0F172A] p-3 rounded-xl border border-[#334155]">
            <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider block">Money Saved</span>
            <span className="text-lg font-bold text-[#3B82F6] font-mono flex items-center gap-1 mt-0.5">
              <Wallet className="w-4 h-4" /> ₹3,450
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#334155] pb-2 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'overview' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('saved_places')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'saved_places' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Saved Addresses ({savedPlaces.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'history' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          My Rides ({rideHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'favorites' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Favorite Drivers ({favoriteDrivers.length})
        </button>
      </div>

      {/* Tab 1: Saved Addresses */}
      {activeTab === 'saved_places' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#F8FAFC]">Saved & Frequent Places</h2>
            <button className="btn-secondary py-1.5 text-xs flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedPlaces.map((place) => (
              <div key={place.id} className="card-slate p-4 flex items-center justify-between border border-[#334155]">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{place.icon}</span>
                  <div>
                    <h3 className="text-xs font-bold text-[#F8FAFC]">{place.label}</h3>
                    <p className="text-[11px] text-[#94A3B8] truncate max-w-xs">{place.address}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSavedPlace(place.id)}
                  className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors"
                  title="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Ride History */}
      {(activeTab === 'overview' || activeTab === 'history') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#F8FAFC]">Recent Trip History</h2>
            <span className="text-xs text-[#94A3B8]">All completed rides</span>
          </div>

          <div className="space-y-3">
            {rideHistory.map((ride) => (
              <div key={ride.id} className="card-slate p-4 border border-[#334155] space-y-3">
                <div className="flex items-center justify-between border-b border-[#334155] pb-2 text-xs">
                  <span className="text-[#94A3B8] font-medium">{ride.date}</span>
                  <span className="px-2 py-0.5 rounded bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30 font-bold">
                    {ride.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#F8FAFC]">
                      {ride.pickup} → {ride.dropoff}
                    </h3>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      Driver: <span className="text-[#F8FAFC] font-semibold">{ride.driverName}</span> ({ride.vehicle})
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-[#3B82F6] font-mono">₹{ride.fare}</div>
                    <button
                      onClick={() => onNavigateModule('waypoint')}
                      className="text-[11px] text-[#3B82F6] font-semibold hover:underline flex items-center gap-1 mt-1 justify-end"
                    >
                      <RotateCcw className="w-3 h-3" /> Rebook Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Favorite Drivers */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#F8FAFC]">Your Bookmarked Drivers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteDrivers.map((drv) => (
              <div key={drv.id} className="card-slate p-4 flex items-center justify-between border border-[#334155]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#3B82F6] font-bold flex items-center justify-center text-sm">
                    {drv.photo}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                      {drv.name}
                      <span className="text-amber-400 font-bold flex items-center text-[11px] gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" /> {drv.rating}
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#94A3B8]">{drv.vehicle} • {drv.totalRides} rides completed</p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateModule('waypoint')}
                  className="btn-primary py-1.5 px-3 text-xs"
                >
                  Quick Book
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
