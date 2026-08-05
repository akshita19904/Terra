import React, { useState } from 'react';
import { Search, Users, ShieldAlert, Sparkles, MapPin, Navigation, Home, Briefcase, Clock, ChevronRight, Check } from 'lucide-react';
import { DateTimePicker } from '../common/DateTimePicker';

interface RequestWizardProps {
  onFindMatches: (payload: any) => void;
  isLoading: boolean;
}

const SAVED_LOCATIONS = [
  { label: 'Home', address: 'Manipal Academy of Higher Education, Bengaluru', icon: Home, lat: 13.0827, lng: 77.5900 },
  { label: 'Office', address: 'Brigade El Dorado, Aerospace Park, Bengaluru', icon: Briefcase, lat: 13.1989, lng: 77.6358 },
  { label: 'Koramangala 5th Block', address: 'Koramangala 5th Block, Bengaluru', icon: Clock, lat: 12.9352, lng: 77.6245 },
  { label: 'Indiranagar 100ft Rd', address: 'Indiranagar 100ft Road, Bengaluru', icon: Clock, lat: 12.9784, lng: 77.6408 },
  { label: 'Kempegowda Airport', address: 'Kempegowda International Airport, Bengaluru', icon: Navigation, lat: 13.1986, lng: 77.7066 },
];

export const RequestWizard: React.FC<RequestWizardProps> = ({ onFindMatches, isLoading }) => {
  const [step, setStep] = useState<number>(1);
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
    if (lower.includes('airport')) return { lat: 13.1986, lng: 77.7066 };
    return isOrigin ? { lat: 13.0827, lng: 77.5900 } : { lat: 13.1989, lng: 77.6358 };
  };

  const handleUseCurrentLocation = () => {
    setPickup('Current Location (Yelahanka, Bengaluru)');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
    <div className="glass-panel p-6 rounded-2xl border border-darkBorder space-y-5">
      {/* Wizard Progress Header */}
      <div className="flex items-center justify-between border-b border-darkBorder pb-4">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-mint" aria-hidden="true" /> Find Best Commute Match
          </h2>
          <p className="text-xs text-gray-300 font-medium mt-0.5">
            Step {step} of 3: {step === 1 ? 'Pickup & Destination' : step === 2 ? 'Schedule & Seats' : 'Preferences'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-6 h-1.5 rounded-full transition-all ${
                s === step
                  ? 'bg-mint w-8'
                  : s < step
                  ? 'bg-mint/50'
                  : 'bg-darkBorder'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Pickup & Destination */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-mint" aria-hidden="true" /> Pickup Point
              </label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="text-[11px] text-mint font-bold hover:underline flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" /> Current Location
              </button>
            </div>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="e.g. Manipal Academy, Yelahanka..."
              className="w-full bg-bg-secondary/90 hover:bg-bg-secondary border border-darkBorder focus:border-mint focus:ring-1 focus:ring-mint rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> Destination
            </label>
            <input
              type="text"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="e.g. Brigade El Dorado, Aerospace Park..."
              className="w-full bg-bg-secondary/90 hover:bg-bg-secondary border border-darkBorder focus:border-mint focus:ring-1 focus:ring-mint rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
            />
          </div>

          {/* Quick Saved Places Chips */}
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-2">
              Saved & Recent Places
            </span>
            <div className="flex flex-wrap gap-2">
              {SAVED_LOCATIONS.map((loc) => {
                const Icon = loc.icon;
                return (
                  <button
                    key={loc.label}
                    type="button"
                    onClick={() => setDropoff(loc.address)}
                    className="px-3 py-1.5 rounded-lg bg-bg-secondary hover:bg-mint/15 hover:border-mint/30 border border-darkBorder text-xs text-gray-200 font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Icon className="w-3 h-3 text-mint" />
                    <span>{loc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full mt-2 py-3 rounded-xl bg-mint text-bg-primary font-extrabold text-xs shadow-mintGlow hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue to Schedule</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Schedule & Seats */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div>
            <DateTimePicker
              label="Desired Departure Time"
              value={departureTime}
              onChange={setDepartureTime}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-mint" aria-hidden="true" /> Number of Passengers
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRequestedSeats(num)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    requestedSeats === num
                      ? 'bg-mint text-bg-primary border-mint shadow-xs'
                      : 'bg-bg-secondary text-gray-300 border-darkBorder hover:border-mint/30'
                  }`}
                >
                  {num} {num === 1 ? 'Seat' : 'Seats'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 py-3 rounded-xl bg-bg-secondary text-gray-300 hover:text-white border border-darkBorder font-bold text-xs"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-2/3 py-3 rounded-xl bg-mint text-bg-primary font-extrabold text-xs shadow-mintGlow hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Preferences & Search</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preferences & Submit */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div>
            <div className="flex justify-between items-center text-xs text-gray-300 mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-mint" aria-hidden="true" /> Max Route Detour
              </span>
              <span className="font-bold text-mint text-sm">{maxDetourMinutes} Mins</span>
            </div>
            <input
              type="range"
              min={3}
              max={25}
              value={maxDetourMinutes}
              onChange={(e) => setMaxDetourMinutes(Number(e.target.value))}
              className="w-full accent-mint cursor-pointer"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Lower detour limit ensures faster trip, higher limit increases match availability.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-1/3 py-3 rounded-xl bg-bg-secondary text-gray-300 hover:text-white border border-darkBorder font-bold text-xs"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isLoading}
              className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-mint to-mint-hover text-bg-primary font-extrabold text-xs shadow-mintGlow hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? 'Finding Best Match...' : 'Find Best Ride'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
