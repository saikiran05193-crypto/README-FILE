import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Wifi, 
  Activity, 
  AlertTriangle, 
  Play, 
  Pause, 
  Cpu, 
  ShieldAlert,
  Clock,
  User,
  LogOut,
  LogIn,
  Plus,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';
import { AlertItem } from '../../types/telemetry';
import { useAuth } from '../../context/AuthContext';
import { isSoundEnabled, setSoundEnabled, initializeAudioPermission, playSynthesizedSiren } from '../../utils/soundEngine';

interface HeaderProps {
  onlineNodesCount: number;
  totalNodesCount: number;
  alerts: AlertItem[];
  isSimulationActive: boolean;
  isBackendConnected: boolean;
  onToggleSimulation: () => void;
  onOpenEmergencyModal: () => void;
  onOpenESP32Modal: () => void;
  onOpenLoginModal: () => void;
  onOpenAddNodeModal?: () => void;
  useLiveEsp32: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onlineNodesCount,
  totalNodesCount,
  alerts,
  isSimulationActive,
  isBackendConnected,
  onToggleSimulation,
  onOpenEmergencyModal,
  onOpenESP32Modal,
  onOpenLoginModal,
  onOpenAddNodeModal,
  useLiveEsp32
}) => {
  const { user, logout, isAuthenticated, isAdmin, isOperator } = useAuth();
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [soundActive, setSoundActive] = useState<boolean>(isSoundEnabled());

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const enableSoundPermission = () => {
    initializeAudioPermission();
    setSoundActive(true);
  };

  const toggleSoundPermission = () => {
    if (!soundActive) {
      enableSoundPermission();
    } else {
      setSoundEnabled(false);
      setSoundActive(false);
    }
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <header className="sticky top-0 z-40 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Viewer Audio Permission Initialization Banner */}
      {!soundActive && (
        <div className="w-full bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-b border-amber-500/50 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-200 shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center space-x-2">
            <VolumeX className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span className="font-semibold">
              🔊 <strong>Emergency Alert System:</strong> Emergency siren must be enabled to receive critical disaster alerts.
            </span>
          </div>
          <button
            onClick={enableSoundPermission}
            className="px-3.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black tracking-wide text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            [ ENABLE EMERGENCY SIREN ]
          </button>
        </div>
      )}

      <div className="px-4 lg:px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Title & Branding */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 via-orange-500/20 to-cyan-500/20 border border-slate-700/80 shadow-inner">
            <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg lg:text-xl font-extrabold tracking-wider bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
                ENVIRONMENTAL INTELLIGENCE NETWORK
              </h1>
              <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-blue-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
                Edge AI
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              AI-Powered Multi-Hazard Early Warning & Environmental Monitoring System
            </p>
          </div>
        </div>

        {/* Right Status & Auth Controls */}
        <div className="flex items-center flex-wrap gap-2 lg:gap-3 text-xs">
          
          {/* Socket.IO Connection Status Badge */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border font-semibold ${
            isBackendConnected 
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
              : 'bg-amber-950/40 border-amber-500/30 text-amber-400'
          }`}>
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isBackendConnected ? 'bg-emerald-400' : 'bg-amber-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isBackendConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}></span>
            </span>
            <span className="tracking-wide uppercase text-[11px]">
              {isBackendConnected ? '● LIVE' : '● RECONNECTING...'}
            </span>
          </div>

          {/* Viewer Sound Permission Toggle */}
          <button
            onClick={toggleSoundPermission}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-semibold ${
              soundActive
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={soundActive ? "Emergency siren audio enabled" : "Click to enable emergency alert sound"}
          >
            {soundActive ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span>{soundActive ? '🔊 Sound ON' : '🔇 Enable Sound'}</span>
          </button>

          {/* Node Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <span>Nodes: <strong className="text-white">{onlineNodesCount}/{totalNodesCount}</strong> Online</span>
          </div>

          {/* Add Node Button for ADMIN */}
          {isAdmin && onOpenAddNodeModal && (
            <button
              onClick={onOpenAddNodeModal}
              className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Add Node</span>
            </button>
          )}

          {/* Live Time Clock */}
          <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex items-center space-x-1.5 font-mono">
              <span className="text-slate-400">{date}</span>
              <span className="text-cyan-300 font-bold">{time}</span>
            </div>
          </div>

          {/* Simulation Toggle */}
          <button
            onClick={onToggleSimulation}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              isSimulationActive 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20' 
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={isSimulationActive ? "Pause simulated live data updates" : "Resume simulated live data updates"}
          >
            {isSimulationActive ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="font-semibold">{isSimulationActive ? 'Live Stream' : 'Paused'}</span>
          </button>

          <button
            onClick={onOpenESP32Modal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all font-semibold cursor-pointer"
            title="Configure ESP32 REST / MQTT Backend Integration"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">ESP32 Connect</span>
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unacknowledgedAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white animate-pulse">
                  {unacknowledgedAlerts.length}
                </span>
              )}
            </button>

            {/* Notification Menu */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-xl shadow-2xl z-50 border border-slate-700/80 overflow-hidden">
                <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-slate-200">Active Notifications</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {alerts.length} Total
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {alerts.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs">No active hazard alerts</div>
                  ) : (
                    alerts.map(alert => (
                      <div key={alert.id} className="p-3 hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                            alert.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                          }`}>
                            {alert.severity}
                          </span>
                          <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-200 mt-1">{alert.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{alert.details}</p>
                        <div className="text-[10px] text-cyan-400 mt-1 font-mono">
                          {alert.nodeId} • {alert.location}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-200">{user?.name}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded w-max self-end ${
                  user?.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                  user?.role === 'OPERATOR' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {user?.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 text-slate-300 hover:text-red-300 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Emergency Broadcast Trigger Button (ADMIN & OPERATOR) */}
          {isOperator && (
            <button
              onClick={onOpenEmergencyModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 text-white font-extrabold shadow-[0_0_15px_rgba(225,29,72,0.4)] hover:brightness-110 active:scale-95 transition-all text-xs cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 animate-bounce" />
              <span>🚨 EMERGENCY ALERT</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
