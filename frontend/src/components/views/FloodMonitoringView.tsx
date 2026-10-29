import React from 'react';
import { Waves, CloudRain, ArrowUpRight, ShieldAlert, Droplets, Activity } from 'lucide-react';
import { SensorTelemetry, CalculatedRisks } from '../../types/telemetry';

interface FloodMonitoringViewProps {
  telemetry: SensorTelemetry;
  risks: CalculatedRisks;
}

export const FloodMonitoringView: React.FC<FloodMonitoringViewProps> = ({ telemetry, risks }) => {
  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/40 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <Waves className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
              🌊 HYDROLOGICAL FLOOD & RIVER INUNDATION
            </h2>
            <p className="text-xs text-slate-300">
              River Level Telemetry, Rainfall Gauges & Flood Rise Velocity
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-slate-400 block">Flood Danger Index</span>
          <span className="text-2xl font-black font-mono text-cyan-400">{risks.floodRisk}% ({risks.floodLevel})</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Water Basin Level</span>
          <div className="text-2xl font-black font-mono text-slate-100 flex items-center gap-2">
            <Waves className="w-6 h-6 text-cyan-400" />
            {telemetry.waterLevel}%
          </div>
          <span className="text-[10px] text-cyan-400 font-semibold mt-2 block">Threshold Warning: &gt;60%</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Rainfall Intensity</span>
          <div className="text-2xl font-black font-mono text-slate-100 flex items-center gap-2">
            <CloudRain className="w-6 h-6 text-blue-400" />
            {telemetry.rainfall} <span className="text-xs text-slate-400">mm/hr</span>
          </div>
          <span className="text-[10px] text-blue-400 font-semibold mt-2 block">Heavy Rain Indicator</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Water Rise Rate</span>
          <div className="text-2xl font-black font-mono text-slate-100 flex items-center gap-2">
            <ArrowUpRight className="w-6 h-6 text-orange-400" />
            {telemetry.waterRiseRate} <span className="text-xs text-slate-400">cm/hr</span>
          </div>
          <span className="text-[10px] text-orange-400 font-semibold mt-2 block">Rapid Surge Velocity</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">River Drainage Status</span>
          <div className="text-xl font-black font-mono text-cyan-300 mt-1">
            RISING RAPIDLY
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Dam Sluice Gate 2 Open</span>
        </div>

      </div>

      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 text-xs text-slate-200 space-y-2">
        <h3 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          Hydrological Flood Preparedness Guidance
        </h3>
        <p>1. Monitor downstream flood barriers at Node-05 and Node-06.</p>
        <p>2. Issue early evacuation advisory for Eastern Basin Flats if water rise exceeds 10 cm/hr.</p>
      </div>

    </div>
  );
};
