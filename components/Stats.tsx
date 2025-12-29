
import React from 'react';
import { BusinessProfile } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsProps {
  results: BusinessProfile[];
}

const Stats: React.FC<StatsProps> = ({ results }) => {
  // Aggregate data for a small chart - ratings distribution
  const ratings = results.reduce((acc, curr) => {
    const bucket = Math.floor(curr.rating || 0);
    if (bucket > 0) {
      acc[bucket] = (acc[bucket] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  const chartData = Object.entries(ratings).map(([key, value]) => ({
    name: `${key}★`,
    count: value,
  })).sort((a, b) => parseInt(a.name) - parseInt(b.name));

  const COLORS = ['#94a3b8', '#64748b', '#475569', '#334155', '#4f46e5'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 border border-slate-200 rounded-2xl flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-900">Ratings Distribution</h3>
          <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">Analysis</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-indigo-600 p-6 rounded-2xl text-white flex flex-col justify-between overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm font-medium mb-1">Total Extracted</p>
          <p className="text-5xl font-black">{results.length}</p>
          <p className="text-indigo-100 text-sm mt-4">Verified business profiles found in this region.</p>
        </div>
        
        <div className="absolute -bottom-4 -right-4 text-white opacity-10">
          <BarChart width={150} height={150} data={chartData}>
             <Bar dataKey="count" fill="currentColor" />
          </BarChart>
        </div>

        <div className="relative z-10 mt-8">
            <div className="flex items-center gap-2 text-xs bg-white/20 px-3 py-1.5 rounded-full w-fit">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                Live Extraction Active
            </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
