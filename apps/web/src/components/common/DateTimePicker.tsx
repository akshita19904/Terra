import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronDown } from 'lucide-react';

interface DateTimePickerProps {
  value: string; // "YYYY-MM-DDTHH:mm" format in local time
  onChange: (val: string) => void;
  label?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to parse local datetime string "YYYY-MM-DDTHH:mm" without UTC shifts
  const parseLocalString = (str: string): Date => {
    if (!str) return new Date();
    const [datePart, timePart] = str.split('T');
    if (!datePart || !timePart) return new Date(str);

    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  // Helper to format Date into "YYYY-MM-DDTHH:mm" local string
  const formatLocalString = (d: Date): string => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const currentDate = parseLocalString(value);

  // Format display string e.g. "Wed, 5 Aug • 16:00" in 24-hour local time
  const formattedDatePart = currentDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const formattedHours = String(currentDate.getHours()).padStart(2, '0');
  const formattedMinutes = String(currentDate.getMinutes()).padStart(2, '0');
  const formattedDisplay = `${formattedDatePart} • ${formattedHours}:${formattedMinutes}`;

  const handleDateSelect = (daysFromNow: number) => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysFromNow);
    nextDate.setHours(currentDate.getHours(), currentDate.getMinutes());
    onChange(formatLocalString(nextDate));
  };

  const handleTimeSelect = (hour: number, minute: number) => {
    const nextDate = new Date(currentDate);
    nextDate.setHours(hour, minute);
    onChange(formatLocalString(nextDate));
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-mint" aria-hidden="true" /> {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-bg-secondary/90 hover:bg-bg-secondary border border-darkBorder focus:border-mint focus:ring-1 focus:ring-mint rounded-xl px-3.5 py-2.5 text-xs text-white flex items-center justify-between transition-all shadow-sm"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Select departure date and time"
      >
        <span className="flex items-center gap-2 font-medium">
          <CalendarIcon className="w-4 h-4 text-mint shrink-0" aria-hidden="true" />
          <span className="font-mono text-gray-100">{formattedDisplay}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Glassmorphism Popover Container */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-full bg-[#0E1B2E] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-2">
              Select Day
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleDateSelect(0);
                  setIsOpen(false);
                }}
                className="py-2 px-2 rounded-lg bg-bg-primary hover:bg-mint/15 hover:border-mint/30 border border-darkBorder text-xs text-white font-semibold transition-all"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDateSelect(1);
                  setIsOpen(false);
                }}
                className="py-2 px-2 rounded-lg bg-bg-primary hover:bg-mint/15 hover:border-mint/30 border border-darkBorder text-xs text-white font-semibold transition-all"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDateSelect(2);
                  setIsOpen(false);
                }}
                className="py-2 px-2 rounded-lg bg-bg-primary hover:bg-mint/15 hover:border-mint/30 border border-darkBorder text-xs text-white font-semibold transition-all"
              >
                In 2 Days
              </button>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-2">
              Select Departure Time (24-Hour Local)
            </span>
            <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => {
                    handleTimeSelect(h, 0);
                    setIsOpen(false);
                  }}
                  className={`py-1.5 rounded-md text-[11px] font-mono border transition-all ${
                    currentDate.getHours() === h
                      ? 'bg-mint text-bg-primary border-mint font-extrabold shadow-sm'
                      : 'bg-bg-primary/70 text-gray-300 border-darkBorder hover:border-mint/40'
                  }`}
                >
                  {h < 10 ? `0${h}` : h}:00
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
