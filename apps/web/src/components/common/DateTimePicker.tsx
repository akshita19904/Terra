import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronDown, ChevronLeft, ChevronRight, AlertCircle, Check } from 'lucide-react';

interface DateTimePickerProps {
  value: string; // "YYYY-MM-DDTHH:mm" format in local time
  onChange: (val: string) => void;
  label?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'calendar'>('quick');
  const popoverRef = useRef<HTMLDivElement>(null);

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

  // Compute smart initial default if value is invalid or in the past
  const getSmartDefaultDeparture = (): Date => {
    const now = new Date();
    const target = new Date(now);

    // If current time is late at night (>= 22:00 / 10 PM), roll over to Tomorrow 08:00 AM
    if (now.getHours() >= 22) {
      target.setDate(target.getDate() + 1);
      target.setHours(8, 0, 0, 0);
      return target;
    }

    // Otherwise, find the next 30-minute interval (at least 15 mins into the future)
    target.setMinutes(target.getMinutes() + 15);
    const remainder = 30 - (target.getMinutes() % 30);
    target.setMinutes(target.getMinutes() + (remainder === 30 ? 0 : remainder));
    target.setSeconds(0, 0);
    return target;
  };

  // Active selected Date object
  const selectedDate = value ? parseLocalString(value) : getSmartDefaultDeparture();

  // Validate on mount / value change: if selectedDate is in the past, reset to smart default
  useEffect(() => {
    const now = new Date();
    if (!value || parseLocalString(value).getTime() < now.getTime() - 60000) {
      const smartDefault = getSmartDefaultDeparture();
      onChange(formatLocalString(smartDefault));
    }
  }, [value]);

  // Handle click outside popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if selected date is Today, Tomorrow, or another day
  const isToday = (d: Date): boolean => {
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const isTomorrow = (d: Date): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return d.getDate() === tomorrow.getDate() && d.getMonth() === tomorrow.getMonth() && d.getFullYear() === tomorrow.getFullYear();
  };

  // Generate 48 30-minute time slots (00:00 to 23:30) with past state calculation
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();

    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const slotDate = new Date(selectedDate);
        slotDate.setHours(h, m, 0, 0);

        const isPast = isToday(selectedDate) && slotDate.getTime() < now.getTime();
        const isSelected = selectedDate.getHours() === h && Math.abs(selectedDate.getMinutes() - m) < 15;

        // 12-hour format string e.g. "08:30 AM" or "02:00 PM"
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 === 0 ? 12 : h % 12;
        const displayHourStr = String(displayHour).padStart(2, '0');
        const displayMinStr = String(m).padStart(2, '0');
        const label12 = `${displayHourStr}:${displayMinStr} ${period}`;
        const label24 = `${String(h).padStart(2, '0')}:${displayMinStr}`;

        slots.push({
          hour: h,
          minute: m,
          isPast,
          isSelected,
          label12,
          label24,
          slotDate,
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Display label formatting
  const dayPrefix = isToday(selectedDate) ? 'Today' : isTomorrow(selectedDate) ? 'Tomorrow' : selectedDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const period = selectedDate.getHours() >= 12 ? 'PM' : 'AM';
  const displayHour = selectedDate.getHours() % 12 === 0 ? 12 : selectedDate.getHours() % 12;
  const timeString = `${String(displayHour).padStart(2, '0')}:${String(selectedDate.getMinutes()).padStart(2, '0')} ${period}`;
  const formattedDisplay = `${dayPrefix} • ${timeString}`;

  const handleDateChange = (daysFromNow: number) => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysFromNow);
    nextDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);

    // If switching to today and current selected time is in the past, bump to smart default
    const now = new Date();
    if (daysFromNow === 0 && nextDate.getTime() < now.getTime()) {
      const smart = getSmartDefaultDeparture();
      onChange(formatLocalString(smart));
    } else {
      onChange(formatLocalString(nextDate));
    }
  };

  const handleTimeSlotSelect = (h: number, m: number) => {
    const nextDate = new Date(selectedDate);
    nextDate.setHours(h, m, 0, 0);

    const now = new Date();
    if (nextDate.getTime() < now.getTime()) {
      return; // Past times cannot be selected
    }

    onChange(formatLocalString(nextDate));
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={popoverRef}>
      {label && (
        <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-mint" aria-hidden="true" /> {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-bg-secondary/90 hover:bg-bg-secondary border border-darkBorder focus:border-mint focus:ring-1 focus:ring-mint rounded-xl px-3.5 py-2.5 text-xs text-white flex items-center justify-between transition-all shadow-sm group"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Select departure date and time"
      >
        <span className="flex items-center gap-2 font-medium">
          <CalendarIcon className="w-4 h-4 text-mint shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
          <span className="font-semibold text-white">{formattedDisplay}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-mint' : ''}`} />
      </button>

      {/* Glassmorphism Popover Container */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-full sm:w-80 bg-[#0E1B2E] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 space-y-4">
          {/* Day Selector Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Select Day
              </span>
              <span className="text-[11px] text-mint font-semibold">
                {selectedDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleDateChange(0)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  isToday(selectedDate)
                    ? 'bg-mint text-bg-primary border-mint shadow-xs'
                    : 'bg-bg-primary/80 text-gray-300 border-darkBorder hover:border-mint/30'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleDateChange(1)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  isTomorrow(selectedDate)
                    ? 'bg-mint text-bg-primary border-mint shadow-xs'
                    : 'bg-bg-primary/80 text-gray-300 border-darkBorder hover:border-mint/30'
                }`}
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handleDateChange(2)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  !isToday(selectedDate) && !isTomorrow(selectedDate)
                    ? 'bg-mint text-bg-primary border-mint shadow-xs'
                    : 'bg-bg-primary/80 text-gray-300 border-darkBorder hover:border-mint/30'
                }`}
              >
                In 2 Days
              </button>
            </div>
          </div>

          {/* 30-Minute Scrollable Time Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Available Departure Times (30-Min Slots)
              </span>
              {isToday(selectedDate) && (
                <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Past times disabled
                </span>
              )}
            </div>

            {/* Smooth Scrollable Container */}
            <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {timeSlots.map((slot) => (
                <button
                  key={`${slot.hour}_${slot.minute}`}
                  type="button"
                  disabled={slot.isPast}
                  onClick={() => handleTimeSlotSelect(slot.hour, slot.minute)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1 border ${
                    slot.isPast
                      ? 'opacity-30 bg-gray-900/50 text-gray-600 border-transparent cursor-not-allowed line-through'
                      : slot.isSelected
                      ? 'bg-mint text-bg-primary border-mint shadow-mintGlow font-extrabold'
                      : 'bg-bg-primary/80 text-gray-200 border-darkBorder hover:border-mint/50 hover:bg-mint/10'
                  }`}
                  title={slot.isPast ? 'This time slot has already passed' : `Select ${slot.label12}`}
                >
                  <span>{slot.label12}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
