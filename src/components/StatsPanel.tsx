import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const data = [
  { name: '00:00', fire: 4, wind: 12 },
  { name: '04:00', fire: 3, wind: 15 },
  { name: '08:00', fire: 6, wind: 22 },
  { name: '12:00', fire: 12, wind: 28 },
  { name: '16:00', fire: 18, wind: 35 },
  { name: '20:00', fire: 15, wind: 25 },
  { name: '23:59', fire: 11, wind: 18 },
];

export function StatsPanel() {
  return (
      <div className="grid grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93]">Incidencia de Focos</h3>
            <span className="text-[10px] bg-emergency/10 text-emergency px-2 py-0.5 rounded border border-emergency/20 font-bold">+12% vs ayer</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorFire" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF3B30" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#8E8E93', fontSize: 10}}
                />
                <YAxis hide />
                <Tooltip
                    contentStyle={{backgroundColor: '#121417', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px'}}
                    itemStyle={{color: '#fff', fontSize: 12}}
                />
                <Area
                    type="monotone"
                    dataKey="fire"
                    stroke="#FF3B30"
                    fillOpacity={1}
                    fill="url(#colorFire)"
                    strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93]">Velocidad Viento (km/h)</h3>
            <span className="text-[10px] text-white/30 font-bold">Promedio 22km/h</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#8E8E93', fontSize: 10}}
                />
                <YAxis hide />
                <Tooltip
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{backgroundColor: '#121417', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px'}}
                    itemStyle={{color: '#fff', fontSize: 12}}
                />
                <Bar
                    dataKey="wind"
                    fill="#FF3B30"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
  );
}
