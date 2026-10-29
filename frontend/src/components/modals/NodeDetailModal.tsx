import React from 'react';
import { X, Radio, Battery, Signal, Thermometer, Droplets, Waves, CloudRain, Flame, Wind, Activity, RefreshCw, Cpu } from 'lucide-react';
import type { SensorNode } from '../../types/telemetry';
import { getRiskColorClass } from '../../services/dataSimulator';

interface NodeDetailModalProps {
  node: SensorNode | null;
  onClose: () => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  const riskColor = getRiskColorClass(node.riskLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-white">{node.id}</h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${riskColor.badgeBg}`}>
                  {node.riskLevel} RISK
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  node.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                }`}>
                  {node.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">{node.name} • {node.location}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">COORDINATES</span>
              <strong className="text-slate-200">{node.coordinates[0].toFixed(4)}, {node.coordinates[1].toFixed(4)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">BATTERY LEVEL</span>
              <strong className="text-emerald-400 flex items-center gap-1">
                <Battery className="w-3.5 h-3.5" />
                {node.batteryLevel}%
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">SIGNAL (RSSI)</span>
              <strong className="text-cyan-400 flex items-center gap-1">
                <Signal className="w-3.5 h-3.5" />
                {node.rssi} dBm
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">LAST UPDATED</span>
              <strong className="text-slate-200">{node.lastUpdated}</strong>
            </div>
          </div>

          {/* Primary Telemetry Values */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Detailed Sensor Readings
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Temperature</span>
                <strong className="text-sm font-mono text-white">{node.telemetry.temperature}°C</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Humidity</span>
                <strong className="text-sm font-mono text-white">{node.telemetry.humidity}%</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Water Level</span>
                <strong className="text-sm font-mono text-white">{node.telemetry.waterLevel}%</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Rainfall</span>
                <strong className="text-sm font-mono text-white">{node.telemetry.rainfall} mm/hr</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Smoke Density</span>
                <strong className="text-sm font-mono text-white">{node.telemetry.smoke}%</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Flame Sensor</span>
                <strong className={`text-sm font-mono ${node.telemetry.flameDetected ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                  {node.telemetry.flameDetected ? 'DETECTED' : 'Clear'}
                </strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">PM2.5 AQI</span>
                <strong className="text-sm font-mono text-white">
                  {node.telemetry.pm25 !== null && node.telemetry.pm25 !== undefined ? `${node.telemetry.pm25} µg/m³` : 'No PM2.5 Data'}
                </strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">PM10 AQI</span>
                <strong className="text-sm font-mono text-white">
                  {node.telemetry.pm10 !== null && node.telemetry.pm10 !== undefined ? `${node.telemetry.pm10} µg/m³` : 'No PM10 Data'}
                </strong>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
            <button
              onClick={() => alert(`Ping sent to ${node.id}. Latency: 18ms.`)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ping Node</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
