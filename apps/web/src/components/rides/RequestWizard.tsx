import React, { useState } from 'react';
import { Search, Users, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import { DateTimePicker } from '../common/DateTimePicker';

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

  const resolveIndiaCoordinates = (address: string, isOrigin: boolean) => {
    const lower = address.toLowerCase();
    if (lower.includes('manipal')) return { lat: 13.0827, lng: 77.5900 };
    if (lower.includes('brigade') || lower.includes('el dorado')) return { lat: 13.1989, lng: 77.6358 };
    if (lower.includes('koramangala')) return { lat: 12.9352, lng: 77.6245 };
    if (lower.includes('indiranagar')) return { lat: 12.9784, lng: 77.6408 };
    if (lower.includes('whitefield')) return { lat: 12.9698, lng: 77.7499 };
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
            <Sparkles className="w-5 h-5 text-mint" aria-hidden="true" /> Request Commute Match
          </h2>
          <p className="text-xs text-gray-300 font-medium">
            Intelligent Commute Route Optimization
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-mint" aria-hidden="true" /> Pickup Location
          </label>
          <input
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="e.g. Manipal Academy of Higher Education, Yelahanka..."
            className="w-full bg-bg-secondary/90 hover:bg-bg-secondary border border-darkBorder focus:border-mint focus:ring-1 focus:ring-mint rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
            required
            aria-label="Pickup location"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> Dropoff Destination
          </label>
          <input
            type="text"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            placeholder="e.g. Brigade El Dorado, Aerospace Park..."
            className="w-full bg-bg-secondary/90 hover:bg-bg-secondary border border-darkBorder focus:border-mint focus:ring-1 focus:ring-mint rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
            required
            aria-label="Dropoff destination"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <DateTimePicker
              label="Desired Departure"
              value={departureTime}
              onChange={setDepartureTime}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-mint" aria-hidden="true" /> Requested Seats
            </label>
            <select
              value={requestedSeats}
              onChange={(e) => setRequestedSeats(Number(e.target.value))}
              className="w-full bg-bg-secondary/90 hover:bg-bg-secondary border border-darkBorder focus:border-mint focus:ring-1 focus:ring-mint rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
              aria-label="Requested seats"
            >
              <option value={1}>1 Passenger Seat</option>
              <option value={2}>2 Passenger Seats</option>
              <option value={3}>3 Passenger Seats</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs text-gray-300 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-mint" aria-hidden="true" /> Maximum Detour Limit
            </span>
            <span className="font-bold text-mint text-sm">{maxDetourMinutes} Mins</span>
          </div>
          <input
            type="range"
            min={3}
            max={25}
            value={maxDetourMinutes}
            onChange={(e) => setMaxDetourMinutes(Number(e.target.value))}
            className="w-full accent-mint cursor-pointer focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-2 focus:ring-offset-[#07111F] rounded-lg"
            aria-label="Maximum detour limit in minutes"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-mint to-mint-hover text-bg-primary font-bold text-sm shadow-mintGlow hover:opacity-95 focus:ring-2 focus:ring-mint focus:ring-offset-2 focus:ring-offset-[#07111F] transition-all flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          {isLoading ? 'Running Optimization Engine...' : 'Run Matching Engine'}
        </button>
      </form>
    </div>
  );
};
