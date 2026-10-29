import React from 'react';
import { AlertOctagon, CheckCircle2, Flame, Waves, Wind, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { AlertItem, SensorNode } from '../../types/telemetry';

interface AlertPanelProps {
  alerts: AlertItem[];
  onAcknowledgeAlert: (id: string) => void;
  onSelectNodeById: (nodeId: string) => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({
  alerts,
  onAcknowledgeAlert,
  onSelectNodeById
}) => {
  return (
    <div className="glass-panel rounded-2xl p-5 mb-8 border border-slate-700/80">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100 tracking-wider">
              ACTIVE ENVIRONMENTAL ALERTS
            </h3>
            <p className="text-xs text-slate-400">
              Live anomaly alerts and early warning dispatch feed
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-amber-400 border border-slate-700">
          {alerts.filter(a => !a.acknowledged).length} Pending Action
        </span>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            No active hazard alerts recorded.
          </div>
        ) : (
          alerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isHigh = alert.severity === 'HIGH';
            
            return (
              <div 
                key={alert.id}
                className={`glass-card rounded-xl p-4 border transition-all ${
                  isCritical ? 'border-red-500/40 bg-red-950/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]' :
                  isHigh ? 'border-orange-500/40 bg-orange-950/10 shadow-[0_0_15px_rgba(249,115,22,0.1)]' :
                  'border-yellow-500/30 bg-yellow-950/10'
                } ${alert.acknowledged ? 'opacity-60' : ''}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Left Icon & Details */}
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                      isHigh ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                    }`}>
                      {alert.hazard === 'FIRE' ? <Flame className="w-5 h-5" /> :
                       alert.hazard === 'FLOOD' ? <Waves className="w-5 h-5" /> :
                       <Wind className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                          isCritical ? 'bg-red-500/30 text-red-300 border-red-500/50 animate-pulse' :
                          isHigh ? 'bg-orange-500/30 text-orange-300 border-orange-500/50' :
                          'bg-yellow-500/30 text-yellow-300 border-yellow-500/50'
                        }`}>
                          {alert.severity}
                        </span>
                        
                        <h4 className="text-sm font-bold text-slate-100">{alert.title}</h4>
                        
                        <span className="text-[11px] text-slate-400 font-mono">
                          • {alert.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1">
                        {alert.details}
                      </p>

                      <div className="flex items-center space-x-3 mt-2 text-xs font-mono">
                        <button 
                          onClick={() => onSelectNodeById(alert.nodeId)}
                          className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>{alert.nodeId}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-400">{alert.location}</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-amber-400 font-bold">Score: {alert.riskScore}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="shrink-0 flex items-center justify-end sm:justify-center">
                    {!alert.acknowledged ? (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Acknowledge</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Acknowledged
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
