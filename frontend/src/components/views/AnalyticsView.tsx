import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { CalculatedRisks, HistoricalTrendPoint } from '../../types/telemetry';

interface AnalyticsViewProps {
  risks: CalculatedRisks;
  historicalData: HistoricalTrendPoint[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ risks, historicalData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          ADVANCED HAZARD ANALYTICS & PREDICTIVE FORECASTS
        </h2>
        <p className="text-xs text-slate-400">
          30-Day Multi-Hazard Risk Probability Engine
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-red-500/30">
          <span className="text-xs font-bold text-slate-400 block mb-1">Wildfire Peak Probability</span>
          <div className="text-3xl font-black font-mono text-red-400">78%</div>
          <p className="text-xs text-slate-400 mt-2">Highest danger period: 14:00 - 17:00 (Peak heat & dry winds)</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-cyan-500/30">
          <span className="text-xs font-bold text-slate-400 block mb-1">Flash Flood Probability</span>
          <div className="text-3xl font-black font-mono text-cyan-400">54%</div>
          <p className="text-xs text-slate-400 mt-2">River basin inundation risk under sustained rain &gt;40 mm/hr</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-yellow-500/30">
          <span className="text-xs font-bold text-slate-400 block mb-1">Toxic Smog Probability</span>
          <div className="text-3xl font-black font-mono text-yellow-400">81%</div>
          <p className="text-xs text-slate-400 mt-2">Thermal inversion holding particulates near urban ground level</p>
        </div>
      </div>
    </div>
  );
};
