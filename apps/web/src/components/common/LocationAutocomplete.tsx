import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Home, Briefcase, Clock, Search, X, Check, Dumbbell, GraduationCap } from 'lucide-react';

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category?: 'saved' | 'recent' | 'suggestion';
  iconType?: 'home' | 'office' | 'gym' | 'college' | 'pin';
}

interface LocationAutocompleteProps {
  label: string;
  value: string;
  onChange: (address: string, coords?: { lat: number; lng: number }) => void;
  placeholder?: string;
  iconColor?: string;
}

// Bounded database of popular Bengaluru locations for instant zero-latency autocomplete
const BENGALURU_PLACES: LocationItem[] = [
  { id: '1', name: 'Manipal Academy of Higher Education', address: 'Govindapura, Yelahanka, Bengaluru, Karnataka 560064', lat: 13.0827, lng: 77.5900, category: 'saved', iconType: 'home' },
  { id: '2', name: 'Brigade El Dorado', address: 'Aerospace Park, Hunasamaranahalli, Bengaluru, Karnataka 562157', lat: 13.1989, lng: 77.6358, category: 'saved', iconType: 'office' },
  { id: '3', name: 'Koramangala 1st Block', address: 'Koramangala 1st Block, Bengaluru, Karnataka 560034', lat: 12.9279, lng: 77.6271, category: 'suggestion' },
  { id: '4', name: 'Koramangala 4th Block BDA Complex', address: '17th Main Rd, 4th Block, Koramangala, Bengaluru, Karnataka 560034', lat: 12.9352, lng: 77.6245, category: 'suggestion' },
  { id: '5', name: 'Koramangala Metro Station', address: 'Hosur Rd, Koramangala, Bengaluru, Karnataka 560095', lat: 12.9312, lng: 77.6189, category: 'suggestion' },
  { id: '6', name: 'Indiranagar 100ft Road', address: '100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru 560038', lat: 12.9784, lng: 77.6408, category: 'recent' },
  { id: '7', name: 'Kempegowda International Airport (BLR)', address: 'KIAL Rd, Devanahalli, Bengaluru, Karnataka 560300', lat: 13.1986, lng: 77.7066, category: 'recent' },
  { id: '8', name: 'Whitefield ITPL Tech Park', address: 'ITPL Main Rd, Pattandur Agrahara, Whitefield, Bengaluru 560066', lat: 12.9698, lng: 77.7499, category: 'recent' },
  { id: '9', name: 'Cult.Fit Gym Yelahanka', address: 'Major Unnikrishnan Rd, Yelahanka New Town, Bengaluru 560064', lat: 13.0991, lng: 77.5922, category: 'saved', iconType: 'gym' },
  { id: '10', name: 'BMS College of Engineering', address: 'Bull Temple Rd, Basavanagudi, Bengaluru 560019', lat: 12.9410, lng: 77.5655, category: 'saved', iconType: 'college' },
];

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Search location or address...',
  iconColor = 'text-[#2563EB]',
}) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matching suggestions
  const filteredSuggestions = BENGALURU_PLACES.filter((place) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return place.name.toLowerCase().includes(q) || place.address.toLowerCase().includes(q);
  });

  const handleSelect = (item: LocationItem) => {
    setQuery(item.name);
    onChange(item.address, { lat: item.lat, lng: item.lng });
    setIsOpen(false);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const locStr = `Current Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`;
          setQuery(locStr);
          onChange(locStr, { lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsOpen(false);
        },
        () => {
          const fallback = 'Manipal Academy of Higher Education, Yelahanka';
          setQuery(fallback);
          onChange(fallback, { lat: 13.0827, lng: 77.5900 });
          setIsOpen(false);
        }
      );
    } else {
      const fallback = 'Manipal Academy of Higher Education, Yelahanka';
      setQuery(fallback);
      onChange(fallback, { lat: 13.0827, lng: 77.5900 });
      setIsOpen(false);
    }
  };

  const renderIcon = (iconType?: string) => {
    switch (iconType) {
      case 'home': return <Home className="w-3.5 h-3.5 text-[#3B82F6]" />;
      case 'office': return <Briefcase className="w-3.5 h-3.5 text-[#16A34A]" />;
      case 'gym': return <Dumbbell className="w-3.5 h-3.5 text-[#F59E0B]" />;
      case 'college': return <GraduationCap className="w-3.5 h-3.5 text-[#3B82F6]" />;
      default: return <MapPin className={`w-3.5 h-3.5 ${iconColor}`} />;
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-semibold text-[#94A3B8] flex items-center gap-1">
          <MapPin className={`w-3.5 h-3.5 ${iconColor}`} aria-hidden="true" /> {label}
        </label>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="text-[11px] text-[#3B82F6] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Navigation className="w-3 h-3" /> Current Location
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full bg-[#0F172A] border border-[#334155] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] rounded-lg px-3.5 py-2 text-sm text-[#F8FAFC] focus:outline-none transition-all placeholder:text-[#64748B]"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              onChange('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 w-full bg-[#1E293B] border border-[#334155] rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in duration-100">
          {/* Quick Shortcuts Bar */}
          <div className="p-2 border-b border-[#334155] bg-[#0F172A] flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            {BENGALURU_PLACES.filter((p) => p.category === 'saved').map((saved) => (
              <button
                key={saved.id}
                type="button"
                onClick={() => handleSelect(saved)}
                className="px-2.5 py-1 rounded-md bg-[#1E293B] hover:bg-[#2563EB]/20 border border-[#334155] text-[11px] text-[#F8FAFC] font-medium flex items-center gap-1 shrink-0 transition-all cursor-pointer"
              >
                {renderIcon(saved.iconType)}
                <span>{saved.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Search Result List */}
          {filteredSuggestions.length > 0 ? (
            <ul role="listbox">
              {filteredSuggestions.map((place, idx) => (
                <li
                  key={place.id}
                  role="option"
                  aria-selected={idx === highlightedIndex}
                  onClick={() => handleSelect(place)}
                  className="px-3.5 py-2.5 hover:bg-[#273449] cursor-pointer flex items-start gap-2.5 transition-colors border-b border-[#334155]/40 last:border-0"
                >
                  <div className="mt-0.5 shrink-0">{renderIcon(place.iconType)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[#F8FAFC] truncate">{place.name}</div>
                    <div className="text-[11px] text-[#94A3B8] truncate">{place.address}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-xs text-[#94A3B8]">
              No places found. Press enter to use "{query}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};
