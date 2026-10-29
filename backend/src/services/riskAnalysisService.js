/**
 * Risk Analysis Service for Environmental Intelligence Network
 * Calculates Fire, Flood, and Air Pollution risks from raw sensor telemetry.
 */

const getRiskLevel = (score) => {
  if (score >= 81) return 'CRITICAL';
  if (score >= 61) return 'HIGH';
  if (score >= 31) return 'MEDIUM';
  return 'LOW';
};

const calculateFireRisk = (temp = 30, smoke = 10, flame = false, humidity = 50) => {
  let risk = 10;

  // Temperature factor (above 35C increases risk)
  if (temp > 45) risk += 40;
  else if (temp > 40) risk += 30;
  else if (temp > 35) risk += 15;

  // Smoke factor (0-100%)
  if (smoke > 80) risk += 35;
  else if (smoke > 50) risk += 20;
  else if (smoke > 30) risk += 10;

  // Humidity factor (low humidity increases fire spread)
  if (humidity < 25) risk += 15;
  else if (humidity < 40) risk += 8;

  // Direct flame detection -> Override to severe fire risk
  if (flame) {
    risk = Math.max(risk, 88);
  }

  return Math.min(100, Math.max(0, Math.round(risk)));
};

const calculateFloodRisk = (waterLevel = 20, rainfall = 0) => {
  let risk = 10;

  // Water level percentage
  if (waterLevel > 85) risk += 55;
  else if (waterLevel > 70) risk += 38;
  else if (waterLevel > 50) risk += 20;
  else if (waterLevel > 30) risk += 10;

  // Rainfall (mm/hr)
  if (rainfall > 60) risk += 35;
  else if (rainfall > 40) risk += 25;
  else if (rainfall > 20) risk += 12;

  return Math.min(100, Math.max(0, Math.round(risk)));
};

const calculatePollutionRisk = (pm25 = 30, pm10 = 50, gasLevel = 20) => {
  let risk = 10;

  // PM2.5 concentration (ug/m3)
  if (pm25 > 200) risk += 45;
  else if (pm25 > 150) risk += 35;
  else if (pm25 > 90) risk += 22;
  else if (pm25 > 50) risk += 10;

  // PM10 concentration (ug/m3)
  if (pm10 > 300) risk += 30;
  else if (pm10 > 200) risk += 20;
  else if (pm10 > 100) risk += 10;

  // Gas level (ppm or index)
  if (gasLevel > 80) risk += 20;
  else if (gasLevel > 50) risk += 12;

  return Math.min(100, Math.max(0, Math.round(risk)));
};

const analyzeReading = (reading, source = 'SERVER_ANALYSIS') => {
  const fireRisk = calculateFireRisk(
    reading.temperature,
    reading.smoke_level,
    reading.flame_detected,
    reading.humidity
  );

  const floodRisk = calculateFloodRisk(
    reading.water_level,
    reading.rainfall
  );

  const pollutionRisk = calculatePollutionRisk(
    reading.pm25,
    reading.pm10,
    reading.gas_level
  );

  const overallRisk = Math.max(fireRisk, floodRisk, pollutionRisk);

  return {
    fire_risk: fireRisk,
    flood_risk: floodRisk,
    pollution_risk: pollutionRisk,
    overall_risk: overallRisk,
    fire_confidence: 94,
    flood_confidence: 96,
    pollution_confidence: 92,
    fire_level: getRiskLevel(fireRisk),
    flood_level: getRiskLevel(floodRisk),
    pollution_level: getRiskLevel(pollutionRisk),
    overall_level: getRiskLevel(overallRisk),
    assessment_source: source
  };
};

module.exports = {
  getRiskLevel,
  calculateFireRisk,
  calculateFloodRisk,
  calculatePollutionRisk,
  analyzeReading
};
