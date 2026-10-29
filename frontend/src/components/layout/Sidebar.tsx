import React from 'react';
import { 
  LayoutDashboard, 
  Flame, 
  Waves, 
  Wind, 
  Map, 
  Radio, 
  AlertOctagon, 
  BarChart3, 
  Settings, 
  Cpu
} from 'lucide-react';
import { PageView } from '../../types/telemetry';

interface SidebarProps {
  activeView: PageView;
  onSelectView: (view: PageView) => void;
  unacknowledgedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  unacknowledgedCount
}) => {
  const navItems: { id: PageView; label: string; icon: React.FC<{ className?: string }>; badge?: number; color?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fire', label: 'Fire Monitoring', icon: Flame, color: 'text-red-400 hover:text-red-300' },
    { id: 'flood', label: 'Flood Monitoring', icon: Waves, color: 'text-cyan-400 hover:text-cyan-300' },
    { id: 'pollution', label: 'Air Pollution', icon: Wind, color: 'text-yellow-400 hover:text-yellow-300' },
    { id: 'map', label: 'Risk Map', icon: Map },
    { id: 'nodes', label: 'Sensor Nodes', icon: Radio },
    { id: 'alerts', label: 'Alerts', icon: AlertOctagon, badge: unacknowledgedCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#0a0f1d] border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col justify-between shrink-0">
      
      {/* Top Nav List */}
      <div className="p-3 lg:p-4 space-y-1 overflow-x-auto lg:overflow-y-auto flex lg:flex-col flex-row gap-1 lg:gap-1 scrollbar-none">
        
        <div className="hidden lg:block text-[10px] font-extrabold tracking-widest text-slate-500 uppercase px-3 py-2">
          Control Center Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs lg:text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-slate-800 to-slate-800/60 text-white border border-slate-700/80 shadow-md shadow-black/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : item.color || 'text-slate-400'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-red-500 text-white animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer Branding */}
      <div className="hidden lg:block p-4 m-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
        <div className="flex items-center justify-center space-x-2 text-cyan-400 mb-1">
          <Cpu className="w-4 h-4 animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider uppercase">Edge AI Engine</span>
        </div>
        <p className="text-[11px] font-semibold text-slate-300">
          Environmental Intelligence Network
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Edge AI Monitoring System
        </p>
        <div className="mt-2 text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 border border-cyan-800/40 rounded py-0.5 px-2 inline-block">
          Version 1.0 (ESP32 Ready)
        </div>
      </div>
    </aside>
  );
};
