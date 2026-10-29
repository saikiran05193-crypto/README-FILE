import React, { useState } from 'react';
import { AlertOctagon, CheckCircle2, Download, Filter, Flame, Waves, Wind } from 'lucide-react';
import { AlertItem } from '../../types/telemetry';

interface AlertsViewProps {
  alerts: AlertItem[];
  onAcknowledgeAlert: (id: string) => void;
  onSelectNodeById: (nodeId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ alerts, onAcknowledgeAlert, onSelectNodeById }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  const exportAlerts = () => {
    const jsonStr = JSON.stringify(alerts, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `environmental_alerts_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-amber-400" />
            ENVIRONMENTAL ALERTS ARCHIVE & LOGS
          </h2>
          <p className="text-xs text-slate-400">
            Historical Incident Dispatch & Early Warning Notifications
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">🔴 Critical Only</option>
            <option value="HIGH">🟠 High Only</option>
            <option value="WARNING">🟡 Warning Only</option>
          </select>

          <button
            onClick={exportAlerts}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredAlerts.map(alert => (
          <div key={alert.id} className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${
                alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                alert.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
              }`}>
                {alert.severity}
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-100">{alert.title}</h4>
                <p className="text-xs text-slate-400">{alert.details}</p>
                <div className="text-[10px] text-cyan-400 font-mono mt-1">
                  {alert.nodeId} • {alert.location} • {alert.timestamp}
                </div>
              </div>
            </div>

            {!alert.acknowledged ? (
              <button
                onClick={() => onAcknowledgeAlert(alert.id)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded"
              >
                Acknowledge
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
