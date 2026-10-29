import React from 'react';
import { AlertTriangle, ShieldAlert, Volume2, CheckCircle2, Clock, MapPin, Flame, Waves, Wind } from 'lucide-react';
import { AlertItem } from '../../types/telemetry';

interface EmergencyAlertModalProps {
  alert: AlertItem | null;
  onAcknowledge: (id: string) => void;
  onClose: () => void;
}

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({
  alert,
  onAcknowledge,
  onClose
}) => {
  if (!alert) return null;

  const handleAcknowledge = () => {
    onAcknowledge(alert.id);
    onClose();
  };

  const getHazardBadge = () => {
    switch (alert.hazard) {
      case 'FIRE':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full font-bold text-xs">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>🔥 WILDFIRE SECTOR EMERGENCY</span>
          </div>
        );
      case 'FLOOD':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full font-bold text-xs">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span>🌊 FLOOD INUNDATION EMERGENCY</span>
          </div>
        );
      case 'AIR_POLLUTION':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full font-bold text-xs">
            <Wind className="w-4 h-4 text-purple-400" />
            <span>🌫️ TOXIC AIR QUALITY EMERGENCY</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/40 rounded-full font-bold text-xs">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>🚨 GENERAL DISASTER EMERGENCY</span>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-lg p-4 animate-in fade-in duration-200">
      
      {/* Outer Pulse Container */}
      <div className="bg-slate-900 border-2 border-red-500/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-slate-100 relative shadow-[0_0_50px_rgba(239,68,68,0.5)] overflow-hidden">
        
        {/* Animated Alarm Top Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse"></div>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <div className="absolute -inset-2 rounded-full bg-red-500/30 animate-ping"></div>
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-red-950 border-2 border-red-500 text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.6)]">
              <ShieldAlert className="w-10 h-10 animate-bounce" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-red-600 text-white font-black text-[11px] tracking-widest uppercase rounded shadow-sm">
              CRITICAL EMERGENCY
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white uppercase">
            {alert.title || 'EMERGENCY BROADCAST'}
          </h2>
          
          <div className="mt-2">
            {getHazardBadge()}
          </div>
        </div>

        {/* Alert Details Body */}
        <div className="space-y-4 mb-6 bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {alert.details}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">{alert.location || 'Control Center'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 justify-end">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Time: {alert.timestamp || 'Just now'}</span>
            </div>
          </div>
        </div>

        {/* Siren Active Indicator Banner */}
        <div className="mb-6 p-3 bg-red-950/60 border border-red-500/40 rounded-xl flex items-center justify-center space-x-2 text-red-300 font-extrabold text-xs tracking-wider animate-pulse">
          <Volume2 className="w-4 h-4 text-red-400 animate-bounce" />
          <span>🔊 EMERGENCY SIREN ACTIVE</span>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleAcknowledge}
            className="w-full py-4 px-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>ACKNOWLEDGE ALERT</span>
          </button>
        </div>

      </div>
    </div>
  );
};
