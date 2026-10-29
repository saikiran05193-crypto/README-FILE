import React from 'react';
import { 
  AlertOctagon, 
  Radio, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import { CalculatedRisks } from '../../types/telemetry';
import { getRiskColorClass } from '../../services/dataSimulator';

interface RiskOverviewCardsProps {
  risks: CalculatedRisks;
  activeAlertsCount: number;
  criticalAlertsCount: number;
  warningAlertsCount: number;
  onlineNodesCount: number;
  totalNodesCount: number;
}

export const RiskOverviewCards: React.FC<RiskOverviewCardsProps> = ({
  risks,
  activeAlertsCount,
  criticalAlertsCount,
  warningAlertsCount,
  onlineNodesCount,
  totalNodesCount,
}) => {
  const riskColor = getRiskColorClass(risks.overallLevel);
  const strokeDashoffset = 283 - (283 * risks.overallRisk) / 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* CARD 1: Overall Risk */}
      <div className={`glass-card rounded-2xl p-4 border ${riskColor.border} relative overflow-hidden`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Overall Risk</span>
            <div className={`text-2xl lg:text-3xl font-black mt-1 ${riskColor.text}`}>
              {risks.overallLevel}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Risk Score: <strong className="text-white font-mono">{risks.overallRisk}%</strong>
            </p>
          </div>
          
          {/* SVG Circular Progress Meter */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="text-slate-800"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                className={`transition-all duration-700 ease-out ${riskColor.text}`}
                strokeWidth="10"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <ShieldAlert className={`absolute w-6 h-6 ${riskColor.text}`} />
          </div>
        </div>
      </div>

      {/* CARD 2: Active Alerts */}
      <div className="glass-card rounded-2xl p-4 border border-slate-700/60 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Active Alerts</span>
            <div className="text-2xl lg:text-3xl font-black mt-1 text-white font-mono">
              {activeAlertsCount.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center space-x-3 mt-2 text-xs font-semibold">
              <span className="text-red-400 bg-red-950/50 px-2 py-0.5 rounded border border-red-800/40">
                Critical: {criticalAlertsCount.toString().padStart(2, '0')}
              </span>
              <span className="text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                Warning: {warningAlertsCount.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* CARD 3: Sensor Nodes */}
      <div className="glass-card rounded-2xl p-4 border border-slate-700/60 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Sensor Nodes</span>
            <div className="text-2xl lg:text-3xl font-black mt-1 text-white font-mono">
              {onlineNodesCount} <span className="text-slate-500 text-lg font-normal">/ {totalNodesCount}</span>
            </div>
            <div className="flex items-center space-x-1.5 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-400">Online</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* CARD 4: Network Status */}
      <div className="glass-card rounded-2xl p-4 border border-slate-700/60 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Network Status</span>
            <div className="text-2xl lg:text-3xl font-black mt-1 text-emerald-400 tracking-wide">
              ONLINE
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Edge Nodes Active
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

    </div>
  );
};
