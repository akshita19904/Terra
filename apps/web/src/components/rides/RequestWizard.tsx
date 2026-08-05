import React, { useState } from 'react';
import { Search, Clock, Users, ShieldAlert, Sparkles, MapPin } from 'lucide-react';

interface RequestWizardProps {
  onFindMatches: (payload: any) => void;
  isLoading: boolean;
}

export const RequestWizard: React.FC<RequestWizardProps> = ({ onFindMatches, isLoading }) => {
  const [pickup, setPickup] = useState('Manipal Academy of Higher Education, Bengaluru');
  const [dropoff, setDropoff] = useState('Brigade El Dorado, Aerospace Park, Bengaluru');
  const [departureTime, setDepartureTime] = useState(
    new Date(Date.now() + 15 * 60000).toISOString().slice(0, 16)
  );
  const [requestedSeats, setRequestedSeats] = useState(2);
  const [maxDetourMinutes, setMaxDetourMinutes] = useState(10);

  // Helper for Indian address coordinate lookup
  const resolveIndiaCoordinates = (address: string, isOrigin: boolean) => {
    const lower = address.toLowerCase();
    if (lower.includes('manipal')) {
      return { lat: 13.0827, lng: 77.5900 };
    }
    if (lower.includes('brigade') || lower.includes('el dorado')) {
      return { lat: 13.1989, lng: 77.6358 };
    }
    if (lower.includes('koramangala')) {
      return { lat: 12.9352, lng: 77.6245 };
    }
    if (lower.includes('indiranagar')) {
      return { lat: 12.9784, lng: 77.6408 };
    }
    if (lower.includes('whitefield')) {
      return { lat: 12.9698, lng: 77.7499 };
    }
    // Default fallback to Bengaluru India coordinates
    return isOrigin ? { lat: 13.0827, lng: 77.5900 } : { lat: 13.1989, lng: 77.6358 };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pickupCoords = resolveIndiaCoordinates(pickup, true);
    const dropoffCoords = resolveIndiaCoordinates(dropoff, false);

    onFindMatches({
      pickup: { ...pickupCoords, address: pickup },
      dropoff: { ...dropoffCoords, address: dropoff },
      desiredDepartureTime: new Date(departureTime).toISOString(),
      requestedSeats,
      maxDetourMinutes,
    });
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-darkBorder">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-mint" /> Request Commute Match
          </h2>
          <p className="text-xs text-gray-400">
            India Commute Optimization Engine (Bengaluru & Urban Hubs)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-mint" /> Pickup Location (India)
          </label>
          <input
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="e.g. Manipal Academy of Higher Education, Yelahanka..."
            className="w-full bg-bg-secondary border border-darkBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-mint transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Dropoff Destination (India)
          </label>
          <input
            type="text"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            placeholder="e.g. Brigade El Dorado, Aerospace Park..."
            className="w-full bg-bg-secondary border border-darkBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-mint transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-mint" /> Desired Departure
            </label>
            <input
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full bg-bg-secondary border border-darkBorder rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-mint"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-mint" /> Seats
            </label>
            <select
              value={requestedSeats}
              onChange={(e) => setRequestedSeats(Number(e.target.value))}
              className="w-full bg-bg-secondary border border-darkBorder rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-mint"
            >
              <option value={1}>1 Passenger Seat</option>
              <option value={2}>2 Passenger Seats</option>
              <option value={3}>3 Passenger Seats</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs text-gray-300 mb-1">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-mint" /> Maximum Detour Limit
            </span>
            <span className="font-bold text-mint">{maxDetourMinutes} Mins</span>
          </div>
          <input
            type="range"
            min={3}
            max={25}
            value={maxDetourMinutes}
            onChange={(e) => setMaxDetourMinutes(Number(e.target.value))}
            className="w-full accent-mint cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-mint to-mint-hover text-bg-primary font-bold text-sm shadow-mintGlow hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          {isLoading ? 'Running India Optimization Engine...' : 'Run Matching Engine'}
        </button>
      </form>
    </div>
  );
};
