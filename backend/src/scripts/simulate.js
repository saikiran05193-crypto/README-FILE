/**
 * Standalone Simulation Script for Environmental Intelligence Network
 * Periodically posts realistic telemetry packets for NODE-001 through NODE-005 to the REST API.
 */

const http = require('http');

const API_HOST = process.env.API_HOST || 'localhost';
const API_PORT = process.env.PORT || 5000;

const nodesState = {
  'NODE-001': { // Flood scenario
    temp: 33.0,
    humidity: 75.0,
    waterLevel: 75.0,
    rainfall: 45.0,
    smokeLevel: 14.0,
    flameDetected: false,
    pm25: 45,
    pm10: 72,
    gasLevel: 25
  },
  'NODE-002': { // Fire scenario
    temp: 41.5,
    humidity: 24.0,
    waterLevel: 12.0,
    rainfall: 0.0,
    smokeLevel: 82.0,
    flameDetected: true,
    pm25: 180,
    pm10: 270,
    gasLevel: 85
  },
  'NODE-003': { // Pollution scenario
    temp: 37.5,
    humidity: 46.0,
    waterLevel: 32.0,
    rainfall: 8.0,
    smokeLevel: 55.0,
    flameDetected: false,
    pm25: 195,
    pm10: 320,
    gasLevel: 105
  },
  'NODE-004': { // Moderate Urban
    temp: 32.0,
    humidity: 78.0,
    waterLevel: 65.0,
    rainfall: 38.0,
    smokeLevel: 20.0,
    flameDetected: false,
    pm25: 42,
    pm10: 68,
    gasLevel: 22
  },
  'NODE-005': { // Forest Normal
    temp: 34.5,
    humidity: 44.0,
    waterLevel: 21.0,
    rainfall: 2.0,
    smokeLevel: 28.0,
    flameDetected: false,
    pm25: 60,
    pm10: 95,
    gasLevel: 33
  }
};

const postReading = (payload) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: API_HOST,
      port: API_PORT,
      path: '/api/readings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`API responded with status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', err => reject(err));
    req.write(data);
    req.end();
  });
};

const stepSimulation = async () => {
  const codes = Object.keys(nodesState);
  // Pick random node to update in each tick
  const nodeCode = codes[Math.floor(Math.random() * codes.length)];
  const state = nodesState[nodeCode];

  // Apply logical delta shifts based on scenario
  if (nodeCode === 'NODE-001') {
    state.rainfall = Math.min(95, Math.max(10, Math.round((state.rainfall + (Math.random() * 4 - 1.5)) * 10) / 10));
    state.waterLevel = Math.min(98, Math.max(20, Math.round((state.waterLevel + (Math.random() * 2 - 0.5)) * 10) / 10));
  } else if (nodeCode === 'NODE-002') {
    state.temp = Math.min(48, Math.max(35, Math.round((state.temp + (Math.random() * 0.8 - 0.3)) * 10) / 10));
    state.humidity = Math.max(12, Math.min(40, Math.round((state.humidity - (Math.random() * 0.6)) * 10) / 10));
    state.smokeLevel = Math.min(100, Math.max(30, Math.round((state.smokeLevel + (Math.random() * 2.5 - 1)) * 10) / 10));
  } else if (nodeCode === 'NODE-003') {
    state.pm25 = Math.min(300, Math.max(50, Math.round(state.pm25 + (Math.random() * 8 - 3))));
    state.pm10 = Math.min(450, Math.max(80, Math.round(state.pm10 + (Math.random() * 12 - 4))));
    state.gasLevel = Math.min(150, Math.max(30, Math.round(state.gasLevel + (Math.random() * 4 - 1.5))));
  } else {
    state.temp = Math.min(40, Math.max(25, Math.round((state.temp + (Math.random() * 0.6 - 0.3)) * 10) / 10));
  }

  const payload = {
    nodeCode,
    temperature: state.temp,
    humidity: state.humidity,
    waterLevel: state.waterLevel,
    rainfall: state.rainfall,
    smokeLevel: state.smokeLevel,
    flameDetected: state.flameDetected,
    pm25: state.pm25,
    pm10: state.pm10,
    gasLevel: state.gasLevel,
    dataSource: 'SIMULATION'
  };

  try {
    const res = await postReading(payload);
    console.log(`[Simulator] Posted telemetry for ${nodeCode}: Temp=${state.temp}C, Water=${state.waterLevel}%, PM2.5=${state.pm25} -> Risk Server Analyzed (${res.data?.risk?.overall_risk}%)`);
  } catch (err) {
    console.error(`[Simulator Error] Failed to post telemetry for ${nodeCode}:`, err.message);
  }
};

console.log(`[Simulator] Starting Environmental Intelligence Network telemetry simulation...`);
console.log(`[Simulator] Target API: http://${API_HOST}:${API_PORT}/api/readings`);

setInterval(stepSimulation, 3000);
