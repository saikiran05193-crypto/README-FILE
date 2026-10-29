import React from 'react';
import { Wind, Activity, Thermometer, Droplets, ShieldAlert, AlertTriangle } from 'lucide-react';
import { SensorTelemetry, CalculatedRisks } from '../../types/telemetry';

interface AirPollutionViewProps {
  telemetry: SensorTelemetry;
  risks: CalculatedRisks;
}

export const AirPollutionView: React.FC<AirPollutionViewProps> = ({ telemetry, risks }) => {
  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-yellow-500/40 bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-400">
            <Wind className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
              🌫️ AIR QUALITY & PARTICULATE POLLUTION
            </h2>
            <p className="text-xs text-slate-300">
              PM2.5, PM10 Fine Particulates, CO2 & Volatile Organic Compound Monitoring
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-slate-400 block">Air Toxicity Index</span>
          <span className="text-2xl font-black font-mono text-yellow-400">{risks.pollutionRisk}% ({risks.pollutionLevel})</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">PM2.5 Concentration</span>
          <div className="text-2xl font-black font-mono text-slate-100 flex items-center gap-2">
            <Wind className="w-6 h-6 text-purple-400" />
            {telemetry.pm25 !== null && telemetry.pm25 !== undefined ? (
              <>{telemetry.pm25} <span className="text-xs text-slate-400">µg/m³</span></>
            ) : (
              <span className="text-sm text-slate-400 font-sans">PM2.5 Sensor Offline</span>
            )}
          </div>
          <span className="text-[10px] text-purple-400 font-semibold mt-2 block">Threshold Alert &gt;35 µg/m³</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">PM10 Concentration</span>
          <div className="text-2xl font-black font-mono text-slate-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-yellow-400" />
            {telemetry.pm10 !== null && telemetry.pm10 !== undefined ? (
              <>{telemetry.pm10} <span className="text-xs text-slate-400">µg/m³</span></>
            ) : (
              <span className="text-sm text-slate-400 font-sans">No PM10 Data</span>
            )}
          </div>
          <span className="text-[10px] text-yellow-400 font-semibold mt-2 block">Coarse Dust Warning</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Carbon Dioxide (CO2)</span>
          <div className="text-2xl font-black font-mono text-slate-100 flex items-center gap-2">
            {telemetry.co2} <span className="text-xs text-slate-400">ppm</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold mt-2 block">Optimal &lt;800 ppm</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">VOC Gaseous Index</span>
          <div className="text-2xl font-black font-mono text-slate-100 flex items-center gap-2">
            {telemetry.voc} <span className="text-xs text-slate-400">ppb</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Industrial Chimney Zone</span>
        </div>

      </div>

      <div className="glass-panel p-5 rounded-2xl border border-yellow-500/30 bg-purple-950/20 text-xs text-slate-200 space-y-2">
        <h3 className="font-bold text-sm text-yellow-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          Public Air Health Advisory
        </h3>
        <p>• Vulnerable groups, elderly, and children should remain indoors near Industrial Sector Node-07.</p>
        <p>• N95 particulate masks recommended outdoors.</p>
      </div>

    </div>
  );
};
