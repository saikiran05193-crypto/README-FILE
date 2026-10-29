import React from 'react';
import { Flame, Waves, Wind, ArrowRight, AlertTriangle, Thermometer, Droplets, CloudRain, Activity } from 'lucide-react';
import { CalculatedRisks, SensorTelemetry, PageView } from '../../types/telemetry';

interface HazardCardsProps {
  telemetry: SensorTelemetry;
  risks: CalculatedRisks;
  onSelectView: (view: PageView) => void;
}

export const HazardCards: React.FC<HazardCardsProps> = ({
  telemetry,
  risks,
  onSelectView,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* 1. FIRE / WILDFIRE CARD */}
      <div className="glass-card rounded-2xl p-5 border border-red-500/40 relative overflow-hidden bg-gradient-to-b from-red-950/20 via-slate-900/60 to-slate-900/90 shadow-[0_0_20px_rgba(239,68,68,0.15)] flex flex-col justify-between group">
        
        {/* Glow Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                🔥 Fire Risk
              </h3>
              <span className="text-[11px] text-red-400/90 font-mono font-semibold uppercase">
                Wildfire Early Warning
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <span className={`px-2.5 py-1 text-xs font-black rounded-lg border uppercase tracking-wider ${
              risks.fireLevel === 'CRITICAL' ? 'bg-red-500/30 text-red-300 border-red-500/60 animate-pulse' :
              risks.fireLevel === 'HIGH' ? 'bg-orange-500/30 text-orange-300 border-orange-500/60' :
              risks.fireLevel === 'MEDIUM' ? 'bg-yellow-500/30 text-yellow-300 border-yellow-500/60' :
              'bg-emerald-500/30 text-emerald-300 border-emerald-500/60'
            }`}>
              {risks.fireLevel}
            </span>
          </div>
        </div>

        {/* Score Display */}
        <div className="my-4 flex items-baseline justify-between border-y border-red-500/20 py-3">
          <span className="text-xs font-semibold text-slate-400">Calculated Risk Score:</span>
          <span className="text-3xl font-black font-mono text-red-400">
            {risks.fireRisk}%
          </span>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Temperature</span>
            <strong className="text-slate-100 font-mono text-sm">{telemetry.temperature !== null && telemetry.temperature !== undefined ? `${telemetry.temperature}°C` : 'N/A'}</strong>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Smoke Level</span>
            <strong className="text-slate-100 font-mono text-sm">{telemetry.smoke !== null && telemetry.smoke !== undefined ? `${telemetry.smoke}` : 'N/A'}</strong>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Flame / Fire</span>
            <strong className={`font-mono text-sm ${telemetry.fire || telemetry.flameDetected ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
              {telemetry.fire || telemetry.flameDetected ? 'DETECTED' : 'Normal'}
            </strong>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Humidity</span>
            <strong className="text-slate-100 font-mono text-sm">{telemetry.humidity !== null && telemetry.humidity !== undefined ? `${telemetry.humidity}%` : 'N/A'}</strong>
          </div>
        </div>

        {/* Status Callout & Button */}
        <div>
          <div className="px-3 py-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-bold flex items-center justify-center space-x-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>⚠ HIGH FIRE RISK</span>
          </div>

          <button
            onClick={() => onSelectView('fire')}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all group-hover:border-red-500/70"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>

      {/* 2. FLOOD RISK CARD */}
      <div className="glass-card rounded-2xl p-5 border border-cyan-500/40 relative overflow-hidden bg-gradient-to-b from-cyan-950/20 via-slate-900/60 to-slate-900/90 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col justify-between group">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Waves className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                🌊 Flood Risk
              </h3>
              <span className="text-[11px] text-cyan-400/90 font-mono font-semibold uppercase">
                Hydrological Monitoring
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <span className={`px-2.5 py-1 text-xs font-black rounded-lg border uppercase tracking-wider ${
              risks.floodLevel === 'CRITICAL' ? 'bg-red-500/30 text-red-300 border-red-500/60 animate-pulse' :
              risks.floodLevel === 'HIGH' ? 'bg-orange-500/30 text-orange-300 border-orange-500/60' :
              risks.floodLevel === 'MEDIUM' ? 'bg-cyan-500/30 text-cyan-300 border-cyan-500/60' :
              'bg-emerald-500/30 text-emerald-300 border-emerald-500/60'
            }`}>
              {risks.floodLevel}
            </span>
          </div>
        </div>

        {/* Score Display */}
        <div className="my-4 flex items-baseline justify-between border-y border-cyan-500/20 py-3">
          <span className="text-xs font-semibold text-slate-400">Calculated Risk Score:</span>
          <span className="text-3xl font-black font-mono text-cyan-400">
            {risks.floodRisk}%
          </span>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Water Level</span>
            <strong className="text-slate-100 font-mono text-sm">{telemetry.waterLevel}%</strong>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Rainfall</span>
            <strong className="text-slate-100 font-mono text-sm">{telemetry.rainfall} mm/hr</strong>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Water Rise Rate</span>
            <strong className="text-slate-100 font-mono text-sm">{telemetry.waterRiseRate} cm/hr</strong>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">River Status</span>
            <strong className="text-cyan-300 font-mono text-sm">Rising Rapidly</strong>
          </div>
        </div>

        {/* Status Callout & Button */}
        <div>
          <div className="px-3 py-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center space-x-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>⚠ FLOOD WATCH</span>
          </div>

          <button
            onClick={() => onSelectView('flood')}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all group-hover:border-cyan-500/70"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>

      {/* 3. AIR POLLUTION CARD */}
      <div className="glass-card rounded-2xl p-5 border border-yellow-500/40 relative overflow-hidden bg-gradient-to-b from-purple-950/20 via-slate-900/60 to-slate-900/90 shadow-[0_0_20px_rgba(234,179,8,0.15)] flex flex-col justify-between group">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-400">
              <Wind className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                🌫️ Air Pollution Risk
              </h3>
              <span className="text-[11px] text-yellow-400/90 font-mono font-semibold uppercase">
                AQI & Particulate Alert
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <span className={`px-2.5 py-1 text-xs font-black rounded-lg border uppercase tracking-wider ${
              risks.pollutionLevel === 'CRITICAL' ? 'bg-purple-500/30 text-purple-300 border-purple-500/60 animate-pulse' :
              risks.pollutionLevel === 'HIGH' ? 'bg-yellow-500/30 text-yellow-300 border-yellow-500/60' :
              risks.pollutionLevel === 'MEDIUM' ? 'bg-amber-500/30 text-amber-300 border-amber-500/60' :
              'bg-emerald-500/30 text-emerald-300 border-emerald-500/60'
            }`}>
              {risks.pollutionLevel}
            </span>
          </div>
        </div>

        {/* Score Display */}
        <div className="my-4 flex items-baseline justify-between border-y border-yellow-500/20 py-3">
          <span className="text-xs font-semibold text-slate-400">Calculated Risk Score:</span>
          <span className="text-3xl font-black font-mono text-yellow-400">
            {risks.pollutionRisk}%
          </span>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">PM2.5 Level</span>
            <strong className="text-slate-100 font-mono text-sm">
              {telemetry.pm25 !== null && telemetry.pm25 !== undefined ? `${telemetry.pm25} µg/m³` : 'No PM2.5 Data'}
            </strong>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">PM10 Level</span>
            <strong className="text-slate-100 font-mono text-sm">
              {telemetry.pm10 !== null && telemetry.pm10 !== undefined ? `${telemetry.pm10} µg/m³` : 'No PM10 Data'}
            </strong>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Temperature</span>
            <strong className="text-slate-100 font-mono text-sm">
              {telemetry.temperature !== null && telemetry.temperature !== undefined ? `${telemetry.temperature}°C` : 'N/A'}
            </strong>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Humidity</span>
            <strong className="text-slate-100 font-mono text-sm">
              {telemetry.humidity !== null && telemetry.humidity !== undefined ? `${telemetry.humidity}%` : 'N/A'}
            </strong>
          </div>
        </div>

        {/* Status Callout & Button */}
        <div>
          <div className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 mb-3 border ${
            telemetry.airAlert || (telemetry.pm25 !== null && telemetry.pm25 > 35) || risks.pollutionLevel === 'CRITICAL' || risks.pollutionLevel === 'HIGH'
              ? 'bg-purple-950/60 border-purple-500/40 text-purple-300'
              : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
          }`}>
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{telemetry.airAlert || (telemetry.pm25 !== null && telemetry.pm25 > 35) ? '⚠ AIR ALERT' : 'AIR STATUS: NORMAL'}</span>
          </div>

          <button
            onClick={() => onSelectView('pollution')}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all group-hover:border-purple-500/70"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>

    </div>
  );
};
