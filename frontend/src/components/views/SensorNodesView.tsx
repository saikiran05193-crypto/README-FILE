import React from 'react';
import { Radio, Battery, Signal, ArrowUpRight, RefreshCw, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import type { SensorNode } from '../../types/telemetry';
import { getRiskColorClass } from '../../services/dataSimulator';

interface SensorNodesViewProps {
  nodes: SensorNode[];
  onSelectNode: (node: SensorNode) => void;
}

export const SensorNodesView: React.FC<SensorNodesViewProps> = ({ nodes, onSelectNode }) => {
  const onlineCount = nodes.filter((n) => n.status === 'ONLINE').length;
  const offlineCount = nodes.filter((n) => n.status !== 'ONLINE').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
            <Radio className="w-6 h-6 text-cyan-400" />
            SENSOR NODES NETWORK MANAGEMENT
          </h2>
          <p className="text-xs text-slate-400">
            Deployed ESP32 Edge Hardware Nodes & Battery/Telemetry Health
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold">
            {onlineCount} ONLINE
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-red-950 border border-red-800 text-red-400 font-bold">
            {offlineCount} OFFLINE / WARNING
          </span>
        </div>
      </div>

      {/* Nodes Table */}
      <div className="glass-panel rounded-2xl border border-slate-700/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Node Code</th>
                <th className="p-3.5">Name & Location</th>
                <th className="p-3.5">Primary Hazard</th>
                <th className="p-3.5">Risk Score</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Battery</th>
                <th className="p-3.5">Last Seen</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {nodes.map((node) => {
                const riskColor = getRiskColorClass(node.riskLevel || 'LOW');
                const isOnline = node.status === 'ONLINE';

                return (
                  <tr key={node.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 font-bold text-cyan-400">{node.id}</td>
                    <td className="p-3.5">
                      <div className="font-sans font-bold text-slate-200">{node.name}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{node.location}</div>
                    </td>
                    <td className="p-3.5 font-sans font-semibold text-slate-300">
                      {node.hazardType === 'FIRE' ? '🔥 Wildfire' : node.hazardType === 'FLOOD' ? '🌊 Flood' : '🌫️ Air Quality'}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded font-black text-[11px] ${riskColor.badgeBg}`}>
                        {node.primaryRiskScore}% ({node.riskLevel || 'LOW'})
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isOnline ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                      }`}>
                        {node.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-200">
                      <span className={node.batteryLevel < 20 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                        {node.batteryLevel}%
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">{node.lastUpdated || 'Just now'}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => onSelectNode(node)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800/60 hover:bg-cyan-800/50 text-cyan-300 text-[11px] font-bold font-sans transition-all cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
