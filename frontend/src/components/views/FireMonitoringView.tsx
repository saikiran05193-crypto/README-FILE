import React from 'react';
import { Flame, Thermometer, Droplets, Wind, ShieldAlert, Activity, AlertTriangle } from 'lucide-react';
import { SensorTelemetry, CalculatedRisks } from '../../types/telemetry';

interface FireMonitoringViewProps {
  telemetry: SensorTelemetry;
  risks: CalculatedRisks;
}

export const FireMonitoringView: React.FC<FireMonitoringViewProps> = ({ telemetry, risks }) => {
  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-red-500/40 bg-gradient-to-r from-red-950/30 via-slate-900 to-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400">
            <Flame className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
              🔥 WILDFIRE MONITORING & EARLY WARNING
            </h2>
            <p className="text-xs text-slate-300">
              Thermal Imaging, Smoke Concentration & Micro-climate Fire Risk Index
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-slate-400 block">Fire Danger Level</span>
          <span className="text-2xl font-black font-mono text-red-400">{risks.fireRisk}% ({risks.fireLevel})</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Ambient Temperature</span>
          <div className="text-2xl font-black font-mono text-slate-100 flex items-center gap-2">
            <Thermometer className="w-6 h-6 text-red-400" />
            {telemetry.temperature}°C
          </div>
          <span className="text-[10px] text-red-400 font-semibold mt-2 block">Critical Threshold: 40°C</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Relative Humidity</span>
          <div className="text-2xl font-black font-mono text-slate-100 flex items-center gap-2">
            <Droplets className="w-6 h-6 text-cyan-400" />
            {telemetry.humidity}%
          </div>
          <span className="text-[10px] text-orange-400 font-semibold mt-2 block">Dryness Warning: &lt;30%</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Smoke Optical Density</span>
          <div className="text-2xl font-black font-mono text-slate-100 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-400" />
            {telemetry.smoke}%
          </div>
          <span className="text-[10px] text-red-400 font-semibold mt-2 block">MQ-135 High Smoke Signal</span>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Flame IR Detection</span>
          <div className={`text-2xl font-black font-mono flex items-center gap-2 ${telemetry.flameDetected ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
            <ShieldAlert className="w-6 h-6" />
            {telemetry.flameDetected ? 'DETECTED' : 'CLEAR'}
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Hardware Interrupt Active</span>
        </div>

      </div>

      {/* Fire Protocol Action Card */}
      <div className="glass-panel p-5 rounded-2xl border border-red-500/30 bg-red-950/20 text-xs text-slate-200 space-y-2">
        <h3 className="font-bold text-sm text-red-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          Standard Operating Protocol (SOP) for Wildfire Alert
        </h3>
        <p>1. Notify Forest Fire Department Sector 4 immediately.</p>
        <p>2. Activate automatic perimeter sprinkler nodes if water reserve exceeds 50%.</p>
        <p>3. Dispatch drone thermal surveillance to Node-03 coordinates.</p>
      </div>

    </div>
  );
};
