import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, ShieldCheck, Leaf } from 'lucide-react';

const mockAnalyticsData = [
  { time: '06:00', matches: 120, co2SavedKg: 45 },
  { time: '08:00', matches: 450, co2SavedKg: 180 },
  { time: '10:00', matches: 320, co2SavedKg: 130 },
  { time: '12:00', matches: 210, co2SavedKg: 85 },
  { time: '14:00', matches: 280, co2SavedKg: 110 },
  { time: '16:00', matches: 540, co2SavedKg: 220 },
  { time: '18:00', matches: 680, co2SavedKg: 275 },
  { time: '20:00', matches: 390, co2SavedKg: 155 },
];

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-slate p-5 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#3B82F6]" /> Match Efficiency
          </span>
          <div className="text-2xl font-bold text-[#F8FAFC] font-mono">94.6%</div>
          <span className="text-xs text-[#16A34A] font-medium">Optimal trajectory alignment</span>
        </div>

        <div className="card-slate p-5 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-[#16A34A]" /> Daily CO₂ Saved
          </span>
          <div className="text-2xl font-bold text-[#16A34A] font-mono">1,200 kg</div>
          <span className="text-xs text-[#94A3B8]">Commute pool reduction</span>
        </div>

        <div className="card-slate p-5 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" /> Platform Trust Index
          </span>
          <div className="text-2xl font-bold text-[#F59E0B] font-mono">4.92 / 5.00</div>
          <span className="text-xs text-[#94A3B8]">Verified passenger & driver ratings</span>
        </div>
      </div>

      {/* Hourly Commute Operations Chart */}
      <div className="card-slate p-6 space-y-4 border border-[#334155]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#3B82F6]" /> Hourly Commute Match Volume & CO₂ Reduction
          </h3>
          <span className="text-xs text-[#94A3B8]">Live Telemetry Feed</span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockAnalyticsData}>
              <defs>
                <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px', color: '#F8FAFC' }}
              />
              <Area type="monotone" dataKey="matches" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorMatches)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
