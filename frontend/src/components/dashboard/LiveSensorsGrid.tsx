import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Waves, 
  CloudRain, 
  Flame, 
  ShieldAlert, 
  Wind, 
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { SensorTelemetry } from '../../types/telemetry';

interface LiveSensorsGridProps {
  telemetry: SensorTelemetry;
}

export const LiveSensorsGrid: React.FC<LiveSensorsGridProps> = ({ telemetry }) => {
  const isOffline = telemetry.deviceStatus === 'OFFLINE';
  const pm25Val = telemetry.pm25;
  const tempVal = telemetry.temperature;
  const humVal = telemetry.humidity;
  const smokeVal = telemetry.smoke;
  const waterVal = telemetry.water !== undefined && telemetry.water !== null ? telemetry.water : telemetry.waterLevel;
  const rainVal = telemetry.rain !== undefined && telemetry.rain !== null ? telemetry.rain : telemetry.rainfall;

  const sensors = [
    {
      title: "Temperature",
      value: tempVal !== null && tempVal !== undefined ? `${tempVal}°C` : "N/A",
      trend: "DHT11 Sensor",
      isUp: (tempVal || 0) > 30,
      icon: Thermometer,
      status: tempVal === null || tempVal === undefined ? "N/A" : tempVal > 40 ? "HIGH HEAT" : "Normal",
      statusColor: tempVal === null || tempVal === undefined ? "text-slate-400 bg-slate-800/50 border-slate-700" : tempVal > 40 ? "text-red-400 bg-red-950/50 border-red-500/40" : "text-emerald-400 bg-emerald-950/50 border-emerald-500/40"
    },
    {
      title: "Humidity",
      value: humVal !== null && humVal !== undefined ? `${humVal}%` : "N/A",
      trend: "DHT11 Sensor",
      isUp: false,
      icon: Droplets,
      status: humVal === null || humVal === undefined ? "N/A" : humVal < 30 ? "DRY AIR" : "Optimal",
      statusColor: humVal === null || humVal === undefined ? "text-slate-400 bg-slate-800/50 border-slate-700" : humVal < 30 ? "text-orange-400 bg-orange-950/50 border-orange-500/40" : "text-emerald-400 bg-emerald-950/50 border-emerald-500/40"
    },
    {
      title: "Water Sensor (AO)",
      value: waterVal !== null && waterVal !== undefined ? `${waterVal}` : "N/A",
      trend: waterVal > 2000 ? "HIGH FLOOD RISK" : "Normal Level",
      isUp: waterVal > 2000,
      icon: Waves,
      status: waterVal > 2000 ? "FLOOD ALERT" : "Normal",
      statusColor: waterVal > 2000 ? "text-red-400 bg-red-950/50 border-red-500/40 animate-pulse" : "text-cyan-400 bg-cyan-950/50 border-cyan-500/40"
    },
    {
      title: "Rain Sensor (AO)",
      value: rainVal !== null && rainVal !== undefined ? `${rainVal}` : "N/A",
      trend: rainVal > 1500 ? "HEAVY RAIN" : "Dry / Light",
      isUp: rainVal > 1500,
      icon: CloudRain,
      status: rainVal > 1500 ? "RAIN ALERT" : "Normal",
      statusColor: rainVal > 1500 ? "text-blue-400 bg-blue-950/50 border-blue-500/40 animate-pulse" : "text-emerald-400 bg-emerald-950/50 border-emerald-500/40"
    },
    {
      title: "Smoke Level (MQ-2)",
      value: smokeVal !== null && smokeVal !== undefined ? `${smokeVal}` : "N/A",
      trend: smokeVal !== null && smokeVal > 1800 ? "FIRE DANGER" : "Low Smoke",
      isUp: smokeVal !== null && smokeVal > 1800,
      icon: Flame,
      status: smokeVal !== null && smokeVal > 1800 ? "FIRE ALERT" : "Low",
      statusColor: smokeVal !== null && smokeVal > 1800 ? "text-red-400 bg-red-950/50 border-red-500/40 animate-pulse" : "text-emerald-400 bg-emerald-950/50 border-emerald-500/40"
    },
    {
      title: "Flame / Fire Status",
      value: telemetry.fire || telemetry.flameDetected ? "DETECTED" : "Normal",
      trend: telemetry.fire || telemetry.flameDetected ? "ACTIVE FIRE" : "Clear",
      isUp: Boolean(telemetry.fire || telemetry.flameDetected),
      icon: ShieldAlert,
      status: telemetry.fire || telemetry.flameDetected ? "TRIGGERED" : "Clear",
      statusColor: telemetry.fire || telemetry.flameDetected ? "text-red-400 bg-red-950/60 border-red-500/50 animate-pulse" : "text-emerald-400 bg-emerald-950/50 border-emerald-500/40"
    },
    {
      title: "PM2.5 Level",
      value: pm25Val !== null && pm25Val !== undefined ? `${pm25Val} µg/m³` : "PM2.5 Sensor Offline",
      trend: pm25Val !== null && pm25Val !== undefined ? (pm25Val > 35 || telemetry.airAlert ? "ALERT" : "Normal") : "Sensor Offline",
      isUp: (pm25Val !== null && pm25Val > 35) || Boolean(telemetry.airAlert),
      icon: Wind,
      status: pm25Val === null || pm25Val === undefined ? "NO DATA" : (telemetry.airAlert || pm25Val > 35) ? "ALERT" : "NORMAL",
      statusColor: pm25Val === null || pm25Val === undefined ? "text-slate-400 bg-slate-800/50 border-slate-700" : (telemetry.airAlert || pm25Val > 35) ? "text-red-400 bg-red-950/50 border-red-500/40 animate-pulse" : "text-emerald-400 bg-emerald-950/50 border-emerald-500/40"
    },
    {
      title: "PM10 Level",
      value: telemetry.pm10 !== null && telemetry.pm10 !== undefined ? `${telemetry.pm10} µg/m³` : "No PM10 Data",
      trend: telemetry.pm10 !== null && telemetry.pm10 !== undefined ? "Live Sensor" : "Sensor Offline",
      isUp: false,
      icon: Activity,
      status: telemetry.pm10 === null || telemetry.pm10 === undefined ? "NO DATA" : telemetry.pm10 > 50 ? "ALERT" : "NORMAL",
      statusColor: telemetry.pm10 === null || telemetry.pm10 === undefined ? "text-slate-400 bg-slate-800/50 border-slate-700" : telemetry.pm10 > 50 ? "text-red-400 bg-red-950/50 border-red-500/40" : "text-emerald-400 bg-emerald-950/50 border-emerald-500/40"
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h3 className="text-base font-extrabold text-slate-100 tracking-wider flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          LIVE ENVIRONMENTAL SENSORS
        </h3>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full font-bold border ${
            isOffline
              ? 'bg-red-950/60 border-red-500/50 text-red-400 animate-pulse'
              : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-red-500' : 'bg-emerald-400 animate-ping'}`}></span>
            <span>ESP32 Device: {isOffline ? 'OFFLINE (No Data >10s)' : 'ONLINE'}</span>
          </span>
          {telemetry.lastUpdatedText && (
            <span className="text-slate-400">
              Last updated: <strong className="text-slate-200">{telemetry.lastUpdatedText}</strong>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {sensors.map((sensor, idx) => {
          const Icon = sensor.icon;
          return (
            <div key={idx} className="glass-card rounded-xl p-3.5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  {sensor.title}
                </span>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${sensor.statusColor}`}>
                  {sensor.status}
                </span>
              </div>

              <div className="my-1">
                <div className="text-xl font-black font-mono text-slate-100 tracking-tight">
                  {sensor.value}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-800/80">
                <span className="text-slate-400">Live Trend</span>
                <span className={`font-mono font-bold flex items-center gap-0.5 ${sensor.isUp ? 'text-red-400' : 'text-emerald-400'}`}>
                  {sensor.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {sensor.trend}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
