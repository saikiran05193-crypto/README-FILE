import React from 'react';
import { EnvironmentalMap } from '../dashboard/EnvironmentalMap';
import { SensorNode } from '../../types/telemetry';

interface RiskMapViewProps {
  nodes: SensorNode[];
  onSelectNode: (node: SensorNode) => void;
}

export const RiskMapView: React.FC<RiskMapViewProps> = ({ nodes, onSelectNode }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-wider">
            🗺️ GEOSPATIAL RISK MAP & NODE INSPECTOR
          </h2>
          <p className="text-xs text-slate-400">
            Interactive GIS Layer with real-time hazard spatial positioning
          </p>
        </div>
      </div>

      <EnvironmentalMap nodes={nodes} onSelectNode={onSelectNode} />
    </div>
  );
};
