import React, { useState } from 'react';
import { Search, Clock, Users, ShieldAlert, Sparkles } from 'lucide-react';

interface RequestWizardProps {
  onFindMatches: (payload: any) => void;
  isLoading: boolean;
}

export const RequestWizard: React.FC<RequestWizardProps> = ({ onFindMatches, isLoading }) => {
  const [pickup, setPickup] = useState('Market St & 4th St, San Francisco');
  const [dropoff, setDropoff] = useState('Mission Bay Blvd, San Francisco');
  const [departureTime, setDepartureTime] = useState(
    new Date(Date.now() + 15 * 60000).toISOString().slice(0, 16)
  );
  const [requestedSeats, setRequestedSeats] = useState(1);
  const [maxDetourMinutes, setMaxDetourMinutes] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFindMatches({
      pickup: { lat: 37.7858, lng: -122.4065, address: pickup },
      dropoff: { lat: 37.7712, lng: -122.3892, address: dropoff },
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
            Intelligent multi-objective route optimization & driver matching
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Pickup Location
          </label>
          <input
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full bg-bg-secondary border border-darkBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-mint transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Dropoff Destination
          </label>
          <input
            type="text"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
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
          {isLoading ? 'Running Optimization Engine...' : 'Run Matching Engine'}
        </button>
      </form>
    </div>
  );
};
