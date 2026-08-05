import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Leaf, Car, ShieldCheck } from 'lucide-react';

const mockAnalyticsData = [
  { time: '08:00', matches: 12, co2SavedKg: 45, detourSavedMins: 110 },
  { time: '09:00', matches: 28, co2SavedKg: 112, detourSavedMins: 240 },
  { time: '10:00', matches: 18, co2SavedKg: 78, detourSavedMins: 165 },
  { time: '11:00', matches: 15, co2SavedKg: 62, detourSavedMins: 130 },
  { time: '12:00', matches: 22, co2SavedKg: 95, detourSavedMins: 190 },
  { time: '13:00', matches: 35, co2SavedKg: 150, detourSavedMins: 310 },
];

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-darkBorder space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-mint" /> Commute Optimization Analytics
          </h3>
          <p className="text-xs text-gray-400">Real-time aggregate platform impact and performance metrics</p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-bg-secondary/70 p-4 rounded-xl border border-darkBorder">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-mint" /> CO2 Emissions Reduced
          </span>
          <div className="text-2xl font-extrabold text-white mt-1">
            552 <span className="text-xs text-mint font-normal">kg CO₂</span>
          </div>
        </div>

        <div className="bg-bg-secondary/70 p-4 rounded-xl border border-darkBorder">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Car className="w-4 h-4 text-mint" /> Vehicle Detours Saved
          </span>
          <div className="text-2xl font-extrabold text-white mt-1">
            1,145 <span className="text-xs text-mint font-normal">mins</span>
          </div>
        </div>

        <div className="bg-bg-secondary/70 p-4 rounded-xl border border-darkBorder">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-mint" /> Ride Match Success
          </span>
          <div className="text-2xl font-extrabold text-white mt-1">
            94.8% <span className="text-xs text-mint font-normal">+2.4%</span>
          </div>
        </div>
      </div>

      {/* Recharts Operations Graph */}
      <div className="h-64 w-full bg-bg-secondary/40 p-4 rounded-xl border border-darkBorder">
        <h4 className="text-xs font-semibold text-gray-300 mb-4">
          Hourly Commute Matches & CO₂ Offset (Kg)
        </h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockAnalyticsData}>
            <defs>
              <linearGradient id="mintGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#65F5C6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#65F5C6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="time" stroke="#9CA3AF" fontSize={11} />
            <YAxis stroke="#9CA3AF" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0E1B2E',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="co2SavedKg"
              stroke="#65F5C6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#mintGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
