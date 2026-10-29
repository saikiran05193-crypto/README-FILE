import React, { useState } from 'react';
import { Settings, Save, Sliders, Cpu, Bell, Shield } from 'lucide-react';

interface SystemSettingsViewProps {
  isSimulationActive: boolean;
  onToggleSimulation: () => void;
  onOpenESP32Modal: () => void;
}

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({
  isSimulationActive,
  onToggleSimulation,
  onOpenESP32Modal
}) => {
  const [fireThreshold, setFireThreshold] = useState<number>(75);
  const [floodThreshold, setFloodThreshold] = useState<number>(65);
  const [pollutionThreshold, setPollutionThreshold] = useState<number>(80);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-400" />
            CONTROL CENTER SYSTEM SETTINGS
          </h2>
          <p className="text-xs text-slate-400">
            Configure Alarm Thresholds, ESP32 API Bridges & Telemetry Polling Frequencies
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-950"
        >
          <Save className="w-4 h-4" />
          <span>Save Thresholds</span>
        </button>
      </div>

      {savedToast && (
        <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold animate-in fade-in">
          ✓ System threshold settings successfully saved to edge configuration!
        </div>
      )}

      {/* Threshold Sliders */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 space-y-5">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Critical Alarm Trigger Thresholds (%)
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-red-400">🔥 Wildfire Critical Alarm Trigger:</span>
              <span className="text-white font-mono">{fireThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={fireThreshold}
              onChange={(e) => setFireThreshold(Number(e.target.value))}
              className="w-full accent-red-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-cyan-400">🌊 Flood Critical Watch Trigger:</span>
              <span className="text-white font-mono">{floodThreshold}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="90"
              value={floodThreshold}
              onChange={(e) => setFloodThreshold(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-yellow-400">🌫️ Hazardous AQI Alarm Trigger:</span>
              <span className="text-white font-mono">{pollutionThreshold}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="95"
              value={pollutionThreshold}
              onChange={(e) => setPollutionThreshold(Number(e.target.value))}
              className="w-full accent-yellow-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Mode Controls */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 space-y-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Hardware & Data Simulation Bridge
        </h3>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-white">ESP32 Hardware Connector Config</h4>
            <p className="text-[11px] text-slate-400">View C++ Arduino code snippets, REST endpoints & JSON schemas</p>
          </div>
          <button
            onClick={onOpenESP32Modal}
            className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold"
          >
            Configure ESP32
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-white">Live Data Stream Simulator</h4>
            <p className="text-[11px] text-slate-400">Automatically update sensors and risks every 3 seconds</p>
          </div>
          <button
            onClick={onToggleSimulation}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isSimulationActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isSimulationActive ? 'Pause Stream' : 'Resume Stream'}
          </button>
        </div>
      </div>

    </div>
  );
};
