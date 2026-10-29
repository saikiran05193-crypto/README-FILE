import {
  CalculatedRisks,
  HazardType,
  HistoricalTrendPoint,
  RiskLevel,
  SensorNode,
  SensorTelemetry,
  AlertItem,
  EdgeAIConfidence
} from '../types/telemetry';

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 81) return 'CRITICAL';
  if (score >= 61) return 'HIGH';
  if (score >= 31) return 'MEDIUM';
  return 'LOW';
}

export function getRiskColorClass(level: RiskLevel): {
  text: string;
  bg: string;
  border: string;
  glow: string;
  badgeBg: string;
} {
  switch (level) {
    case 'CRITICAL':
      return {
        text: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/40',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.4)]',
        badgeBg: 'bg-red-500/20 text-red-400 border-red-500/50'
      };
    case 'HIGH':
      return {
        text: 'text-orange-500',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/40',
        glow: 'shadow-[0_0_15px_rgba(249,115,22,0.4)]',
        badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/50'
      };
    case 'MEDIUM':
      return {
        text: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/40',
        glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]',
        badgeBg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      };
    case 'LOW':
    default:
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/40',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
        badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
      };
  }
}

export function calculateEdgeRisks(telemetry: SensorTelemetry): CalculatedRisks {
  const temp = telemetry.temperature ?? 25;
  const hum = telemetry.humidity ?? 50;
  const smokeVal = telemetry.smoke ?? telemetry.smoke ?? 0;
  const waterVal = telemetry.water ?? telemetry.waterLevel ?? 0;
  const rainVal = telemetry.rain ?? telemetry.rainfall ?? 0;

  // Fire risk formula (Threshold: smoke > 1800 or flameDetected)
  const isFireTriggered = Boolean(telemetry.fire) || smokeVal > 1800 || telemetry.flameDetected;
  const tempRisk = Math.max(0, (temp - 22) / 28) * 30;
  const humidityRisk = Math.max(0, (75 - hum) / 75) * 20;
  const smokeRisk = Math.min(1, smokeVal / 2000) * 35;
  const flameBonus = isFireTriggered ? 50 : 0;
  const fireRisk = Math.min(100, Math.round(tempRisk + humidityRisk + smokeRisk + flameBonus));

  // Flood risk formula (Threshold: water > 2000 or rain > 1500)
  const isFloodTriggered = Boolean(telemetry.flood) || waterVal > 2000 || rainVal > 1500;
  const wlRisk = Math.min(1, waterVal / 3000) * 45;
  const rainRisk = Math.min(1, rainVal / 2000) * 35;
  const riseRisk = Math.min(20, telemetry.waterRiseRate || 0) / 20 * 20;
  const floodBonus = isFloodTriggered ? 40 : 0;
  const floodRisk = Math.min(100, Math.round(wlRisk + rainRisk + riseRisk + floodBonus));

  // Air pollution risk formula (Handle null PM2.5)
  let pollutionRisk = 0;
  if (telemetry.pm25 !== null && telemetry.pm25 !== undefined) {
    const pm25Ratio = Math.min(1.5, telemetry.pm25 / 180);
    const pm10Ratio = Math.min(1.5, (telemetry.pm10 || 0) / 260);
    pollutionRisk = Math.min(100, Math.round((pm25Ratio * 55) + (pm10Ratio * 45)));
  }

  // Overall combined risk
  const maxRisk = Math.max(fireRisk, floodRisk, pollutionRisk);
  const avgRisk = Math.round((fireRisk * 0.4) + (pollutionRisk * 0.35) + (floodRisk * 0.25));
  const overallRisk = Math.min(100, Math.round((maxRisk * 0.6) + (avgRisk * 0.4)));

  return {
    fireRisk,
    floodRisk,
    pollutionRisk,
    overallRisk,
    fireLevel: getRiskLevel(fireRisk),
    floodLevel: getRiskLevel(floodRisk),
    pollutionLevel: telemetry.pm25 === null ? 'LOW' : getRiskLevel(pollutionRisk),
    overallLevel: getRiskLevel(overallRisk)
  };
}

export const INITIAL_TELEMETRY: SensorTelemetry = {
  temperature: 42,
  humidity: 28,
  waterLevel: 68,
  rainfall: 42,
  waterRiseRate: 8,
  smoke: 82,
  flameDetected: true,
  pm25: 156,
  pm10: 234,
  co2: 650,
  voc: 180,
  windSpeed: 24
};

export const INITIAL_CONFIDENCE: EdgeAIConfidence = {
  fireConfidence: 94,
  floodConfidence: 89,
  pollutionConfidence: 96
};

// Initial 15 Sensor Nodes positioned around a realistic region (e.g. Western Ghats / University Campus / District)
export const INITIAL_NODES: SensorNode[] = [
  {
    id: "Node-01",
    name: "North Ridge Tower",
    location: "Forest Boundary - Zone A",
    coordinates: [13.0827, 80.2707],
    status: "ONLINE",
    batteryLevel: 98,
    rssi: -62,
    lastUpdated: "Just now",
    hazardType: "FIRE",
    primaryRiskScore: 28,
    riskLevel: "LOW",
    telemetry: { ...INITIAL_TELEMETRY, temperature: 29, smoke: 12, flameDetected: false, pm25: 32 }
  },
  {
    id: "Node-02",
    name: "Valley Watchtower",
    location: "South Pine Forest",
    coordinates: [13.0910, 80.2810],
    status: "ONLINE",
    batteryLevel: 92,
    rssi: -68,
    lastUpdated: "Just now",
    hazardType: "FIRE",
    primaryRiskScore: 58,
    riskLevel: "MEDIUM",
    telemetry: { ...INITIAL_TELEMETRY, temperature: 38, smoke: 45, flameDetected: false, pm25: 85 }
  },
  {
    id: "Node-03",
    name: "Deep Forest Sensor-A",
    location: "Forest Core Zone - Sector 4",
    coordinates: [13.0750, 80.2600],
    status: "ONLINE",
    batteryLevel: 88,
    rssi: -74,
    lastUpdated: "Just now",
    hazardType: "FIRE",
    primaryRiskScore: 92,
    riskLevel: "CRITICAL",
    telemetry: { ...INITIAL_TELEMETRY, temperature: 46, smoke: 89, flameDetected: true, humidity: 22 }
  },
  {
    id: "Node-04",
    name: "River Bridge Station",
    location: "Upper River Basin",
    coordinates: [13.1020, 80.2520],
    status: "ONLINE",
    batteryLevel: 95,
    rssi: -58,
    lastUpdated: "Just now",
    hazardType: "FLOOD",
    primaryRiskScore: 74,
    riskLevel: "HIGH",
    telemetry: { ...INITIAL_TELEMETRY, waterLevel: 82, rainfall: 68, waterRiseRate: 14 }
  },
  {
    id: "Node-05",
    name: "Dam Gate Monitor",
    location: "River Monitoring Zone",
    coordinates: [13.0650, 80.2910],
    status: "ONLINE",
    batteryLevel: 91,
    rssi: -65,
    lastUpdated: "Just now",
    hazardType: "FLOOD",
    primaryRiskScore: 48,
    riskLevel: "MEDIUM",
    telemetry: { ...INITIAL_TELEMETRY, waterLevel: 62, rainfall: 38, waterRiseRate: 7 }
  },
  {
    id: "Node-06",
    name: "Lowland Flood Post",
    location: "Eastern Basin Flats",
    coordinates: [13.0510, 80.2780],
    status: "ONLINE",
    batteryLevel: 84,
    rssi: -79,
    lastUpdated: "Just now",
    hazardType: "FLOOD",
    primaryRiskScore: 22,
    riskLevel: "LOW",
    telemetry: { ...INITIAL_TELEMETRY, waterLevel: 31, rainfall: 12, waterRiseRate: 2 }
  },
  {
    id: "Node-07",
    name: "Industrial AQI Node 1",
    location: "Urban Industrial Zone",
    coordinates: [13.0420, 80.2450],
    status: "ONLINE",
    batteryLevel: 99,
    rssi: -54,
    lastUpdated: "Just now",
    hazardType: "AIR_POLLUTION",
    primaryRiskScore: 84,
    riskLevel: "CRITICAL",
    telemetry: { ...INITIAL_TELEMETRY, pm25: 198, pm10: 295, co2: 890 }
  },
  {
    id: "Node-08",
    name: "Highway Junction Post",
    location: "Central Corridor",
    coordinates: [13.0780, 80.2390],
    status: "ONLINE",
    batteryLevel: 87,
    rssi: -69,
    lastUpdated: "Just now",
    hazardType: "AIR_POLLUTION",
    primaryRiskScore: 66,
    riskLevel: "HIGH",
    telemetry: { ...INITIAL_TELEMETRY, pm25: 142, pm10: 210 }
  },
  {
    id: "Node-09",
    name: "Campus Green Node",
    location: "University Campus Park",
    coordinates: [13.0890, 80.2640],
    status: "ONLINE",
    batteryLevel: 96,
    rssi: -61,
    lastUpdated: "Just now",
    hazardType: "AIR_POLLUTION",
    primaryRiskScore: 26,
    riskLevel: "LOW",
    telemetry: { ...INITIAL_TELEMETRY, pm25: 28, pm10: 45 }
  },
  {
    id: "Node-10",
    name: "West Mountain Ridge",
    location: "High Altitude Ridge",
    coordinates: [13.1150, 80.2310],
    status: "ONLINE",
    batteryLevel: 79,
    rssi: -82,
    lastUpdated: "Just now",
    hazardType: "FIRE",
    primaryRiskScore: 35,
    riskLevel: "MEDIUM",
    telemetry: { ...INITIAL_TELEMETRY, temperature: 33, smoke: 22, flameDetected: false }
  },
  {
    id: "Node-11",
    name: "East Creek Sensor",
    location: "East Drainage Network",
    coordinates: [13.0330, 80.2890],
    status: "ONLINE",
    batteryLevel: 90,
    rssi: -67,
    lastUpdated: "Just now",
    hazardType: "FLOOD",
    primaryRiskScore: 59,
    riskLevel: "MEDIUM",
    telemetry: { ...INITIAL_TELEMETRY, waterLevel: 65, rainfall: 45, waterRiseRate: 9 }
  },
  {
    id: "Node-12",
    name: "Residential Hub North",
    location: "North Suburb Sector",
    coordinates: [13.1100, 80.2680],
    status: "ONLINE",
    batteryLevel: 94,
    rssi: -60,
    lastUpdated: "Just now",
    hazardType: "AIR_POLLUTION",
    primaryRiskScore: 42,
    riskLevel: "MEDIUM",
    telemetry: { ...INITIAL_TELEMETRY, pm25: 78, pm10: 110 }
  },
  {
    id: "Node-13",
    name: "South Hills Watchtower",
    location: "South Ridge Forest",
    coordinates: [13.0250, 80.2580],
    status: "OFFLINE",
    batteryLevel: 0,
    rssi: -99,
    lastUpdated: "12m ago",
    hazardType: "FIRE",
    primaryRiskScore: 0,
    riskLevel: "LOW",
    telemetry: { ...INITIAL_TELEMETRY, temperature: 0, smoke: 0, flameDetected: false }
  },
  {
    id: "Node-14",
    name: "Harbor Inundation Node",
    location: "Coastal Drainage Exit",
    coordinates: [13.0980, 80.2980],
    status: "OFFLINE",
    batteryLevel: 12,
    rssi: -91,
    lastUpdated: "45m ago",
    hazardType: "FLOOD",
    primaryRiskScore: 0,
    riskLevel: "LOW",
    telemetry: { ...INITIAL_TELEMETRY, waterLevel: 0, rainfall: 0 }
  },
  {
    id: "Node-15",
    name: "Chemical Plant Perimeter",
    location: "North Industrial Park",
    coordinates: [13.1250, 80.2510],
    status: "OFFLINE",
    batteryLevel: 5,
    rssi: -95,
    lastUpdated: "2h ago",
    hazardType: "AIR_POLLUTION",
    primaryRiskScore: 0,
    riskLevel: "LOW",
    telemetry: { ...INITIAL_TELEMETRY, pm25: 0, pm10: 0 }
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "ALT-8092",
    severity: "CRITICAL",
    hazard: "FIRE",
    title: "Wildfire Risk Detected",
    nodeId: "Node-03",
    location: "Forest Core Zone",
    details: "High thermal radiation (46°C) and heavy smoke (89%) with flame detection triggered.",
    riskScore: 92,
    timestamp: "2 minutes ago",
    acknowledged: false
  },
  {
    id: "ALT-8089",
    severity: "HIGH",
    hazard: "AIR_POLLUTION",
    title: "Hazardous Air Quality Spike",
    nodeId: "Node-07",
    location: "Urban Industrial Zone",
    details: "PM2.5 exceeded critical threshold at 198 µg/m³. Respiratory warning active.",
    riskScore: 84,
    timestamp: "5 minutes ago",
    acknowledged: false
  },
  {
    id: "ALT-8084",
    severity: "WARNING",
    hazard: "FLOOD",
    title: "Rapid Water Level Increase",
    nodeId: "Node-05",
    location: "River Monitoring Zone",
    details: "Water level reached 68% with rise rate of 12 cm/hr under heavy rainfall.",
    riskScore: 54,
    timestamp: "8 minutes ago",
    acknowledged: false
  },
  {
    id: "ALT-8071",
    severity: "WARNING",
    hazard: "FIRE",
    title: "Elevated Dry Heat Warning",
    nodeId: "Node-02",
    location: "South Pine Forest",
    details: "Humidity dropped to 25% with rising surface temp (38°C).",
    riskScore: 58,
    timestamp: "18 minutes ago",
    acknowledged: true
  }
];

// Helper to generate realistic 24-hour time series history
export function generate24HourTrends(): HistoricalTrendPoint[] {
  const points: HistoricalTrendPoint[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3600 * 1000);
    const timeStr = `${t.getHours().toString().padStart(2, '0')}:00`;
    
    // Wave patterns for realistic curves
    const fireWave = Math.sin((i / 24) * Math.PI * 2) * 15 + 65 + (Math.random() * 6 - 3);
    const floodWave = Math.cos((i / 24) * Math.PI * 2) * 12 + 45 + (Math.random() * 6 - 3);
    const pollutionWave = Math.sin(((i + 4) / 24) * Math.PI * 2) * 18 + 70 + (Math.random() * 8 - 4);
    
    points.push({
      time: timeStr,
      fireRisk: Math.min(100, Math.max(10, Math.round(fireWave))),
      floodRisk: Math.min(100, Math.max(10, Math.round(floodWave))),
      pollutionRisk: Math.min(100, Math.max(10, Math.round(pollutionWave))),
      temperature: Math.round(28 + Math.sin(i / 3) * 10),
      waterLevel: Math.round(40 + Math.cos(i / 4) * 25),
      pm25: Math.round(80 + Math.sin(i / 2) * 60)
    });
  }
  return points;
}
