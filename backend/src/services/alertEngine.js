const { Alert, SensorNode, SystemEvent } = require('../models');
const { getRiskLevel } = require('./riskAnalysisService');

// Map to track last alert timestamp per node and hazard type to prevent duplicate alerts
const recentAlertsCache = new Map();
const DEBOUNCE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const evaluateAndTriggerAlerts = async (nodeId, riskData, io = null) => {
  const node = await SensorNode.findByPk(nodeId);
  if (!node) return [];

  const hazards = [
    { type: 'FIRE', score: riskData.fire_risk, confidence: riskData.fire_confidence || 94 },
    { type: 'FLOOD', score: riskData.flood_risk, confidence: riskData.flood_confidence || 96 },
    { type: 'AIR_POLLUTION', score: riskData.pollution_risk, confidence: riskData.pollution_confidence || 92 }
  ];

  const generatedAlerts = [];

  for (const hazard of hazards) {
    if (hazard.score >= 61) { // HIGH (61-80) or CRITICAL (81-100)
      const severity = getRiskLevel(hazard.score);
      const cacheKey = `${nodeId}_${hazard.type}`;
      const lastTrigger = recentAlertsCache.get(cacheKey);
      const now = Date.now();

      if (lastTrigger && (now - lastTrigger) < DEBOUNCE_INTERVAL_MS) {
        continue; // Skip duplicate alert within debounce window
      }

      recentAlertsCache.set(cacheKey, now);

      let title = '';
      let message = '';

      if (hazard.type === 'FIRE') {
        title = `${severity} Fire Risk Alert - ${node.name}`;
        message = `Thermal sensors at ${node.location_name} registered a fire risk score of ${hazard.score}/100. Source: ${riskData.assessment_source || 'SERVER_ANALYSIS'}.`;
      } else if (hazard.type === 'FLOOD') {
        title = `${severity} Flood Risk Alert - ${node.name}`;
        message = `Water level and rainfall monitoring at ${node.location_name} reached flood risk score of ${hazard.score}/100. Source: ${riskData.assessment_source || 'SERVER_ANALYSIS'}.`;
      } else if (hazard.type === 'AIR_POLLUTION') {
        title = `${severity} Air Pollution Alert - ${node.name}`;
        message = `Particulate matter (PM2.5/PM10) and toxic gas at ${node.location_name} reached pollution risk score of ${hazard.score}/100. Source: ${riskData.assessment_source || 'SERVER_ANALYSIS'}.`;
      }

      const alert = await Alert.create({
        node_id: nodeId,
        hazard_type: hazard.type,
        severity: severity,
        title: title,
        message: message,
        risk_score: hazard.score,
        confidence: hazard.confidence,
        status: 'ACTIVE',
        created_at: new Date()
      });

      // Log system event
      await SystemEvent.create({
        node_id: nodeId,
        event_type: 'AI_ALERT',
        description: `Triggered ${severity} ${hazard.type} alert for node ${node.node_code} (${node.location_name}). Score: ${hazard.score}`,
        created_at: new Date()
      });

      generatedAlerts.push(alert);

      // Socket.IO real-time emission
      if (io) {
        io.emit('new_alert', {
          alert,
          node: {
            id: node.id,
            node_code: node.node_code,
            name: node.name,
            location_name: node.location_name
          }
        });
      }
    }
  }

  return generatedAlerts;
};

module.exports = {
  evaluateAndTriggerAlerts
};
