import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Map, Layers, Radio, ShieldAlert, Thermometer, Waves, Wind, Battery, Signal } from 'lucide-react';
import { SensorNode } from '../../types/telemetry';
import { getRiskColorClass } from '../../services/dataSimulator';

// Fix default Leaflet icon assets
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface EnvironmentalMapProps {
  nodes: SensorNode[];
  onSelectNode: (node: SensorNode) => void;
}

export const EnvironmentalMap: React.FC<EnvironmentalMapProps> = ({ nodes, onSelectNode }) => {
  const [filterHazard, setFilterHazard] = useState<string>('ALL');

  const filteredNodes = nodes.filter(node => {
    if (filterHazard === 'ALL') return true;
    return node.hazardType === filterHazard;
  });

  const getMarkerColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return '#ef4444'; // Red
      case 'HIGH': return '#f97316';     // Orange
      case 'MEDIUM': return '#eab308';   // Yellow
      case 'LOW':
      default: return '#10b981';         // Green
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 mb-8 border border-slate-700/80">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100 tracking-wider">
              REAL-TIME ENVIRONMENTAL RISK MAP
            </h3>
            <p className="text-xs text-slate-400">
              GIS Node Telemetry & Spatial Threat Visualization
            </p>
          </div>
        </div>

        {/* Hazard Overlay Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-semibold">Layer:</span>
          <select
            value={filterHazard}
            onChange={(e) => setFilterHazard(e.target.value)}
            className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Hazards ({nodes.length} Nodes)</option>
            <option value="FIRE">🔥 Wildfire Watch</option>
            <option value="FLOOD">🌊 Flood Stations</option>
            <option value="AIR_POLLUTION">🌫️ Air Quality Stations</option>
          </select>
        </div>
      </div>

      {/* Interactive Leaflet Map Container */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-slate-800">
        <MapContainer
          center={[13.0827, 80.2707]}
          zoom={12}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredNodes.map((node) => {
            const color = getMarkerColor(node.riskLevel);
            return (
              <CircleMarker
                key={node.id}
                center={node.coordinates}
                radius={node.status === 'OFFLINE' ? 6 : 10}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: node.status === 'OFFLINE' ? 0.3 : 0.8,
                  weight: 2
                }}
                eventHandlers={{
                  click: () => onSelectNode(node)
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1 mb-2">
                      <span className="font-extrabold text-xs text-white">{node.id}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        node.riskLevel === 'CRITICAL' ? 'bg-red-500 text-white' :
                        node.riskLevel === 'HIGH' ? 'bg-orange-500 text-white' :
                        node.riskLevel === 'MEDIUM' ? 'bg-yellow-500 text-black' :
                        'bg-emerald-500 text-white'
                      }`}>
                        {node.riskLevel}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-200">{node.name}</p>
                    <p className="text-[10px] text-slate-400 mb-2">{node.location}</p>

                    <div className="grid grid-cols-2 gap-1 text-[11px] font-mono bg-slate-900/90 p-2 rounded border border-slate-800 mb-2">
                      <div>Temp: <strong>{node.telemetry.temperature}°C</strong></div>
                      <div>Water: <strong>{node.telemetry.waterLevel}%</strong></div>
                      <div>PM2.5: <strong>{node.telemetry.pm25} µg</strong></div>
                      <div>Risk: <strong className="text-cyan-400">{node.primaryRiskScore}%</strong></div>
                    </div>

                    <button
                      onClick={() => onSelectNode(node)}
                      className="w-full text-center py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold rounded transition-colors"
                    >
                      Inspect Telemetry
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[400] glass-panel px-3 py-2 rounded-lg border border-slate-700/80 text-xs shadow-xl flex items-center space-x-3">
          <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Legend:</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] text-slate-300">Normal</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="text-[10px] text-slate-300">Warning</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-[10px] text-slate-300">High</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[10px] text-slate-300">Critical</span>
          </div>
        </div>
      </div>

    </div>
  );
};
