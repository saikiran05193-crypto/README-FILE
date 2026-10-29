import React from 'react';
import { Cpu, ArrowRight, ShieldCheck, WifiOff, Cloud, Server, Activity } from 'lucide-react';

export const SystemArchitecture: React.FC = () => {
  const steps = [
    { title: "Sensors", desc: "DHT22, Water, MQ-135, SDS011" },
    { title: "ESP32 Edge Node", desc: "Dual Core Microcontroller" },
    { title: "Edge AI", desc: "Local Anomaly Classification" },
    { title: "Communication", desc: "Wi-Fi / MQTT / LoRaWAN" },
    { title: "Cloud", desc: "Telemetry Aggregation API" },
    { title: "Control Dashboard", desc: "Multi-Hazard Monitoring UI" },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 mb-8 border border-slate-700/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100 tracking-wider">
              EDGE + CLOUD HYBRID SYSTEM
            </h3>
            <p className="text-xs text-slate-400">
              Fault-tolerant IoT Architecture with Local AI Edge Inference
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>🟢 EDGE PROCESSING ACTIVE</span>
        </div>
      </div>

      {/* Architecture Flow Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {steps.map((step, idx) => (
          <div key={idx} className="glass-card rounded-xl p-3 border border-slate-800 text-center flex flex-col justify-between">
            <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">
              STEP 0{idx + 1}
            </div>
            <div className="text-xs font-bold text-slate-100 mb-1">
              {step.title}
            </div>
            <div className="text-[9px] text-slate-400">
              {step.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Network Outage Survival Callout */}
      <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center space-x-3 text-xs">
        <WifiOff className="w-5 h-5 text-cyan-400 shrink-0" />
        <p className="text-slate-200">
          <strong className="text-cyan-300">Fail-Safe Guarantee:</strong> "Local AI inference continues even during network outages. Emergency buzzers and sirens trigger directly from the ESP32 without relying on internet connectivity."
        </p>
      </div>

    </div>
  );
};
