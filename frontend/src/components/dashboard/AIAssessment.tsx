import React from 'react';
import { Cpu, ArrowRight, ShieldCheck, Zap, Server, Radio, AlertTriangle } from 'lucide-react';
import { CalculatedRisks, EdgeAIConfidence } from '../../types/telemetry';

interface AIAssessmentProps {
  risks: CalculatedRisks;
  confidence: EdgeAIConfidence;
}

export const AIAssessment: React.FC<AIAssessmentProps> = ({ risks, confidence }) => {
  const steps = [
    { name: "SENSORS", icon: Radio, desc: "DHT22 / Water / Smoke / PM2.5" },
    { name: "DATA PROCESSING", icon: Server, desc: "Local Filtering & Normalization" },
    { name: "EDGE AI", icon: Cpu, desc: "TinyML Inference Engine" },
    { name: "RISK SCORE", icon: Zap, desc: "Multi-Hazard Math Model" },
    { name: "CRITICAL ALERT", icon: AlertTriangle, desc: "Sub-Second Threshold Check" },
    { name: "CONTROL CENTER", icon: ShieldCheck, desc: "Dashboard & Siren Trigger" },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 mb-8 border border-slate-700/80 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950/90">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100 tracking-wider">
              EDGE AI RISK ASSESSMENT
            </h3>
            <p className="text-xs text-slate-400">
              Sensor data is processed locally on ESP32 edge microcontrollers before cloud transmission.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>ESP32 TinyML Model Active</span>
        </div>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="mb-8">
        <div className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase mb-3">
          Edge Processing Pipeline
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative group">
                <div className="glass-card rounded-xl p-3 border border-slate-800 hover:border-cyan-500/50 transition-all text-center flex flex-col items-center h-full justify-between">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-black tracking-wider text-slate-200 uppercase mb-1">
                    {step.name}
                  </div>
                  <p className="text-[9px] text-slate-400 font-medium">
                    {step.desc}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ArrowRight className="w-4 h-4 text-cyan-500/60" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Predictions & Confidence Meters */}
      <div>
        <div className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase mb-4">
          Real-time Edge AI Hazard Predictions
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Fire AI Prediction */}
          <div className="glass-card rounded-xl p-4 border border-red-500/30 bg-red-950/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">Fire Risk Prediction</span>
              <span className="text-xs font-mono font-bold text-red-400">{risks.fireRisk}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-500" 
                style={{ width: `${risks.fireRisk}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Model Confidence:</span>
              <strong className="text-slate-200 font-mono">{confidence.fireConfidence}%</strong>
            </div>
          </div>

          {/* Flood AI Prediction */}
          <div className="glass-card rounded-xl p-4 border border-cyan-500/30 bg-cyan-950/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">Flood Risk Prediction</span>
              <span className="text-xs font-mono font-bold text-cyan-400">{risks.floodRisk}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-500" 
                style={{ width: `${risks.floodRisk}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Model Confidence:</span>
              <strong className="text-slate-200 font-mono">{confidence.floodConfidence}%</strong>
            </div>
          </div>

          {/* Air Pollution AI Prediction */}
          <div className="glass-card rounded-xl p-4 border border-purple-500/30 bg-purple-950/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">Air Pollution Prediction</span>
              <span className="text-xs font-mono font-bold text-yellow-400">{risks.pollutionRisk}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-purple-500 h-full transition-all duration-500" 
                style={{ width: `${risks.pollutionRisk}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Model Confidence:</span>
              <strong className="text-slate-200 font-mono">{confidence.pollutionConfidence}%</strong>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
