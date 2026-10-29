import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import { HistoricalTrendPoint, CalculatedRisks } from '../../types/telemetry';

interface RiskChartsProps {
  historicalData: HistoricalTrendPoint[];
  risks: CalculatedRisks;
}

export const RiskCharts: React.FC<RiskChartsProps> = ({ historicalData, risks }) => {
  // Compute hazard distribution percentages
  const total = risks.fireRisk + risks.floodRisk + risks.pollutionRisk || 1;
  const firePct = Math.round((risks.fireRisk / total) * 100);
  const floodPct = Math.round((risks.floodRisk / total) * 100);
  const pollutionPct = 100 - firePct - floodPct;

  const pieData = [
    { name: 'Fire Risk', value: firePct, color: '#ef4444' },
    { name: 'Flood Risk', value: floodPct, color: '#06b6d4' },
    { name: 'Air Pollution', value: pollutionPct, color: '#eab308' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 rounded-xl border border-slate-700/80 shadow-2xl text-xs font-mono">
          <p className="text-slate-400 font-bold mb-1.5">Time: {label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 my-0.5" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="font-semibold">{entry.name}:</span>
              <strong className="text-white">{entry.value}%</strong>
            </div>
          ))}
        </div>
      );
    };
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* 24-Hour Risk Trends Line Chart (2 Cols) */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
              <LineChartIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-100 tracking-wider">
                24-HOUR RISK TRENDS
              </h3>
              <p className="text-xs text-slate-400">
                Multi-Hazard Predictive Risk Index Trajectory
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-semibold">
            <span className="flex items-center space-x-1.5 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span>Fire</span>
            </span>
            <span className="flex items-center space-x-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span>Flood</span>
            </span>
            <span className="flex items-center space-x-1.5 text-yellow-400">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
              <span>Pollution</span>
            </span>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="fireRisk" 
                name="Fire Risk"
                stroke="#ef4444" 
                strokeWidth={2.5} 
                dot={false}
                activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="floodRisk" 
                name="Flood Risk"
                stroke="#06b6d4" 
                strokeWidth={2.5} 
                dot={false}
                activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="pollutionRisk" 
                name="Pollution Risk"
                stroke="#eab308" 
                strokeWidth={2.5} 
                dot={false}
                activeDot={{ r: 6, fill: '#eab308', stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Hazard Distribution Donut Chart (1 Col) */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400">
              <PieChartIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-100 tracking-wider">
                CURRENT HAZARD DISTRIBUTION
              </h3>
              <p className="text-xs text-slate-400">
                Threat Breakdown Spectrum
              </p>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="w-full h-52 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(val: any) => [`${val}%`, 'Share']}
                contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Top Risk</span>
            <span className="text-lg font-black text-white font-mono">
              {risks.fireRisk >= risks.pollutionRisk && risks.fireRisk >= risks.floodRisk ? 'FIRE' :
               risks.pollutionRisk >= risks.floodRisk ? 'AQI' : 'FLOOD'}
            </span>
          </div>
        </div>

        {/* Legend Summary */}
        <div className="space-y-2 border-t border-slate-800/80 pt-3 text-xs">
          {pieData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="font-medium text-slate-300">{item.name}</span>
              </div>
              <strong className="font-mono text-white">{item.value}%</strong>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
