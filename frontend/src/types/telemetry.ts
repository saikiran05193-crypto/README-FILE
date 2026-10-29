export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type HazardType = 'FIRE' | 'FLOOD' | 'AIR_POLLUTION' | 'GENERAL';
export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'WARNING' | 'INFO';
export type PageView = 
  | 'dashboard' 
  | 'fire' 
  | 'flood' 
  | 'pollution' 
  | 'map' 
  | 'nodes' 
  | 'alerts' 
  | 'analytics' 
  | 'settings';

export interface SensorTelemetry {
  water?: number | null;     // Raw analog value (0-4095)
  rain?: number | null;      // Raw analog value (0-4095)
  temperature: number | null;// °C
  humidity: number | null;   // %
  waterLevel: number;        // % or raw analog value
  rainfall: number;          // mm/hr or raw analog value
  waterRiseRate: number;     // cm/hr
  smoke: number | null;      // % or raw analog value
  flameDetected: boolean;
  pm25: number | null;        // null if no PM2.5 sensor attached
  pm10?: number | null;       // null if unavailable
  co2?: number | null;        // ppm
  voc?: number | null;        // ppb
  windSpeed?: number;         // km/h
  gasLevel?: number;          // ppm / index
  flood?: boolean;            // Flood status boolean
  fire?: boolean;             // Fire status boolean
  airAlert?: boolean;         // Air quality alert boolean
  timestamp?: string;         // Time ISO string
  deviceStatus?: 'ONLINE' | 'OFFLINE'; // 10s watchdog device status
  lastUpdatedText?: string;   // e.g. "Just now" or "12 seconds ago"
}

export interface CalculatedRisks {
  fireRisk: number;       // 0-100%
  floodRisk: number;      // 0-100%
  pollutionRisk: number;  // 0-100%
  overallRisk: number;    // 0-100%
  fireLevel: RiskLevel;
  floodLevel: RiskLevel;
  pollutionLevel: RiskLevel;
  overallLevel: RiskLevel;
}

export interface SensorNode {
  id: string;             // e.g. "NODE-001"
  name: string;           // e.g. "River Monitoring Station"
  location: string;       // e.g. "Hussain Sagar Inlet"
  coordinates: [number, number]; // [lat, lng]
  status: 'ONLINE' | 'OFFLINE' | 'WARNING' | 'DEGRADED';
  batteryLevel: number;   // %
  rssi?: number;           // dBm
  lastUpdated: string;
  hazardType?: HazardType;
  primaryRiskScore: number;
  riskLevel: RiskLevel;
  telemetry: SensorTelemetry;
}

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  hazard: HazardType;
  title: string;
  nodeId: string;
  location: string;
  details: string;
  riskScore: number;
  timestamp: string;
  acknowledged: boolean;
}

export interface HistoricalTrendPoint {
  time: string;
  fireRisk: number;
  floodRisk: number;
  pollutionRisk: number;
  temperature: number;
  waterLevel: number;
  pm25: number;
}

export interface EdgeAIConfidence {
  fireConfidence: number;      // e.g. 94%
  floodConfidence: number;     // e.g. 89%
  pollutionConfidence: number; // e.g. 96%
}

export interface ESP32Config {
  baseUrl: string;
  mqttBroker: string;
  updateIntervalMs: number;
  useLiveEsp32: boolean;
  apiKey: string;
}
