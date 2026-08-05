import React, { useState } from 'react';
import { Search, Users, ShieldAlert, Sparkles, MapPin, ChevronRight, AlertCircle } from 'lucide-react';
import { DateTimePicker } from '../common/DateTimePicker';
import { LocationAutocomplete } from '../common/LocationAutocomplete';

interface RequestWizardProps {
  onFindMatches: (payload: any) => void;
  isLoading: boolean;
}

export const RequestWizard: React.FC<RequestWizardProps> = ({ onFindMatches, isLoading }) => {
  const [step, setStep] = useState<number>(1);
  const [pickup, setPickup] = useState('Manipal Academy of Higher Education, Bengaluru');
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number }>({ lat: 13.0827, lng: 77.5900 });

  const [dropoff, setDropoff] = useState('Brigade El Dorado, Aerospace Park, Bengaluru');
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number }>({ lat: 13.1989, lng: 77.6358 });

  const [departureTime, setDepartureTime] = useState(
    new Date(Date.now() + 15 * 60000).toISOString().slice(0, 16)
  );
  const [requestedSeats, setRequestedSeats] = useState(2);
  const [maxDetourMinutes, setMaxDetourMinutes] = useState(10);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const selectedDate = new Date(departureTime);
    const now = new Date();

    if (selectedDate.getTime() < now.getTime() - 60000) {
      setValidationError('This departure time has already passed. Please select a valid future time slot.');
      return;
    }

    onFindMatches({
      pickup: { ...pickupCoords, address: pickup },
      dropoff: { ...dropoffCoords, address: dropoff },
      desiredDepartureTime: selectedDate.toISOString(),
      requestedSeats,
      maxDetourMinutes,
    });
  };

  return (
    <div className="card-slate p-6 space-y-5 border border-[#334155]">
      {/* Wizard Progress Header */}
      <div className="flex items-center justify-between border-b border-[#334155] pb-3">
        <div>
          <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#3B82F6]" aria-hidden="true" /> Find Commute Match
          </h2>
          <p className="text-xs text-[#94A3B8] font-normal mt-0.5">
            Step {step} of 3: {step === 1 ? 'Route Locations' : step === 2 ? 'Schedule & Seats' : 'Preferences'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-6 h-1.5 rounded-full transition-all ${
                s === step ? 'bg-[#2563EB] w-8' : s < step ? 'bg-[#2563EB]/50' : 'bg-[#334155]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-3 text-xs text-[#F59E0B] flex items-center gap-2" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Step 1: Intelligent Location Autocomplete */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <LocationAutocomplete
            label="Pickup Location"
            value={pickup}
            onChange={(address, coords) => {
              setPickup(address);
              if (coords) setPickupCoords(coords);
            }}
            placeholder="Type pickup place e.g. Manipal, Koramangala..."
            iconColor="text-[#16A34A]"
          />

          <LocationAutocomplete
            label="Dropoff Destination"
            value={dropoff}
            onChange={(address, coords) => {
              setDropoff(address);
              if (coords) setDropoffCoords(coords);
            }}
            placeholder="Type destination e.g. Brigade El Dorado, Airport..."
            iconColor="text-[#2563EB]"
          />

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full mt-2 btn-primary py-2.5 cursor-pointer"
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
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#3B82F6]" aria-hidden="true" /> Number of Passenger Seats
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRequestedSeats(num)}
                  className={`py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    requestedSeats === num
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-[#0F172A] text-[#94A3B8] border-[#334155] hover:text-[#F8FAFC]'
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
              className="w-1/3 btn-secondary py-2 text-xs"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-2/3 btn-primary py-2 text-xs cursor-pointer"
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
            <div className="flex justify-between items-center text-xs text-[#94A3B8] mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#3B82F6]" aria-hidden="true" /> Maximum Route Detour
              </span>
              <span className="font-bold text-[#3B82F6] font-mono">{maxDetourMinutes} Mins</span>
            </div>
            <input
              type="range"
              min={3}
              max={25}
              value={maxDetourMinutes}
              onChange={(e) => setMaxDetourMinutes(Number(e.target.value))}
              className="w-full accent-[#2563EB] cursor-pointer"
            />
            <p className="text-[11px] text-[#94A3B8] mt-1">
              Lower detour limit ensures faster trip, higher limit increases match availability.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-1/3 btn-secondary py-2 text-xs"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isLoading}
              className="w-2/3 btn-primary py-2 text-xs cursor-pointer"
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
