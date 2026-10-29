import React, { useState } from 'react';
import { AlertTriangle, X, Radio, BellRing, ShieldCheck, Send } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerAlert: (hazard: string, severity: string, message?: string, title?: string) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onTriggerAlert
}) => {
  const [selectedHazard, setSelectedHazard] = useState<string>('GENERAL');
  const [severity, setSeverity] = useState<string>('CRITICAL');
  const [customMessage, setCustomMessage] = useState<string>('Emergency situation detected. Please take immediate action.');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [broadcasting, setBroadcasting] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleInitSend = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmSend = () => {
    setBroadcasting(true);
    const title = selectedHazard === 'FIRE' ? '🔥 Wildfire Emergency Broadcast' :
                  selectedHazard === 'FLOOD' ? '🌊 Flood Inundation Emergency Broadcast' :
                  selectedHazard === 'AIR_POLLUTION' ? '🌫️ Toxic Air Quality Emergency Broadcast' :
                  '🚨 General Disaster Emergency Broadcast';

    setTimeout(() => {
      setBroadcasting(false);
      setSentSuccess(true);
      onTriggerAlert(selectedHazard, severity, customMessage, title);
      setTimeout(() => {
        setSentSuccess(false);
        setShowConfirm(false);
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-red-500/50 bg-slate-900/95 shadow-[0_0_50px_rgba(239,68,68,0.3)] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-slate-900 p-4 flex items-center justify-between border-b border-red-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-wider text-white">
                🚨 ADMIN EMERGENCY BROADCAST
              </h3>
              <p className="text-xs text-red-300">
                Multi-Hazard Disaster Early Warning System
              </p>
            </div>
          </div>
          
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          
          {sentSuccess ? (
            <div className="py-8 text-center space-y-3">
              <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-white">Emergency Broadcast Dispatched!</h4>
              <p className="text-xs text-slate-300">
                Alert broadcast sent to all connected viewers, ESP32 edge sirens, and database records.
              </p>
            </div>
          ) : showConfirm ? (
            /* Confirmation Dialog Step */
            <div className="space-y-4 p-5 bg-red-950/50 border border-red-500/60 rounded-xl">
              <div className="text-center space-y-2">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto animate-pulse" />
                <h4 className="text-xl font-black text-red-100 tracking-wide">
                  🚨 SEND EMERGENCY ALERT?
                </h4>
                <p className="text-xs text-red-200 font-medium">
                  This will immediately notify all connected viewers and activate the emergency siren.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg text-xs space-y-1 font-mono text-slate-300 border border-slate-800">
                <div><span className="text-slate-500">Hazard:</span> {selectedHazard}</div>
                <div><span className="text-slate-500">Severity:</span> {severity}</div>
                <div><span className="text-slate-500">Message:</span> {customMessage}</div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={broadcasting}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer uppercase tracking-wider"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSend}
                  disabled={broadcasting}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center space-x-2 cursor-pointer uppercase tracking-wider"
                >
                  {broadcasting ? (
                    <span>DISPATCHING...</span>
                  ) : (
                    <span>SEND EMERGENCY ALERT</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Main Form Step */
            <form onSubmit={handleInitSend} className="space-y-4">
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/20 text-xs text-red-200 flex items-start space-x-2">
                <BellRing className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p>
                  Broadcasting an emergency alert immediately triggers audio sirens and popups on all active viewer dashboards.
                </p>
              </div>

              {/* Hazard Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                  Hazard Type:
                </label>
                <select
                  value={selectedHazard}
                  onChange={(e) => setSelectedHazard(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:border-red-500 focus:outline-none"
                >
                  <option value="GENERAL">🚨 General Emergency</option>
                  <option value="FIRE">🔥 Wildfire Sector Warning</option>
                  <option value="FLOOD">🌊 Hydrological Flood Warning</option>
                  <option value="AIR_POLLUTION">🌫️ Toxic Air Quality Warning</option>
                </select>
              </div>

              {/* Severity Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                  Severity Level:
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:border-red-500 focus:outline-none"
                >
                  <option value="CRITICAL">🔴 CRITICAL - Immediate Action Required</option>
                  <option value="HIGH">🟠 HIGH - Severe Watch</option>
                  <option value="WARNING">🟡 WARNING - Precautionary Alert</option>
                </select>
              </div>

              {/* Emergency Message */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase">
                  Emergency Message:
                </label>
                <textarea
                  rows={3}
                  required
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl p-3 text-xs font-medium focus:border-red-500 focus:outline-none"
                  placeholder="Enter detailed emergency instructions..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center space-x-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Emergency Alert</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
