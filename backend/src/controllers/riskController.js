const { SensorNode, RiskAssessment, SystemEvent } = require('../models');
const { evaluateAndTriggerAlerts } = require('../services/alertEngine');

const createRiskAssessment = async (req, res, next) => {
  try {
    const {
      nodeCode,
      nodeId,
      fireRisk,
      floodRisk,
      pollutionRisk,
      overallRisk,
      fireConfidence,
      floodConfidence,
      pollutionConfidence,
      assessmentSource
    } = req.body;

    let node;
    if (nodeCode) {
      node = await SensorNode.findOne({ where: { node_code: nodeCode } });
    } else if (nodeId) {
      node = await SensorNode.findByPk(nodeId);
    }

    if (!node) {
      return res.status(404).json({
        success: false,
        message: `Sensor node not found for code: ${nodeCode || nodeId}`
      });
    }

    const calculatedOverall = overallRisk !== undefined 
      ? overallRisk 
      : Math.max(fireRisk || 0, floodRisk || 0, pollutionRisk || 0);

    const riskAssessment = await RiskAssessment.create({
      node_id: node.id,
      fire_risk: fireRisk || 0,
      flood_risk: floodRisk || 0,
      pollution_risk: pollutionRisk || 0,
      overall_risk: calculatedOverall,
      fire_confidence: fireConfidence || 90,
      flood_confidence: floodConfidence || 90,
      pollution_confidence: pollutionConfidence || 90,
      assessment_source: assessmentSource || 'EDGE_AI',
      created_at: new Date()
    });

    await SystemEvent.create({
      node_id: node.id,
      event_type: 'AI_ASSESSMENT_RECEIVED',
      description: `Risk assessment received from source ${assessmentSource || 'EDGE_AI'} for node ${node.node_code}. Overall Risk: ${calculatedOverall}%`,
      created_at: new Date()
    });

    // Check & trigger alerts
    const io = req.app.get('io');
    const alertsTriggered = await evaluateAndTriggerAlerts(node.id, {
      fire_risk: riskAssessment.fire_risk,
      flood_risk: riskAssessment.flood_risk,
      pollution_risk: riskAssessment.pollution_risk,
      fire_confidence: riskAssessment.fire_confidence,
      flood_confidence: riskAssessment.flood_confidence,
      pollution_confidence: riskAssessment.pollution_confidence,
      assessment_source: riskAssessment.assessment_source
    }, io);

    // Socket.IO real-time emission
    if (io) {
      io.emit('risk_update', {
        node: {
          id: node.id,
          node_code: node.node_code,
          name: node.name
        },
        risk: riskAssessment.toJSON()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Risk assessment stored successfully',
      data: {
        risk: riskAssessment,
        alertsTriggered: alertsTriggered.length
      }
    });
  } catch (err) {
    next(err);
  }
};

const getCurrentRisks = async (req, res, next) => {
  try {
    const nodes = await SensorNode.findAll();
    const currentRisks = await Promise.all(
      nodes.map(async (node) => {
        const latestRisk = await RiskAssessment.findOne({
          where: { node_id: node.id },
          order: [['created_at', 'DESC']]
        });
        return {
          node: {
            id: node.id,
            node_code: node.node_code,
            name: node.name,
            location_name: node.location_name
          },
          risk: latestRisk ? latestRisk.toJSON() : null
        };
      })
    );

    res.json({
      success: true,
      data: currentRisks
    });
  } catch (err) {
    next(err);
  }
};

const getRiskHistory = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const history = await RiskAssessment.findAll({
      include: [{ model: SensorNode, as: 'node', attributes: ['node_code', 'name', 'location_name'] }],
      order: [['created_at', 'DESC']],
      limit
    });

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (err) {
    next(err);
  }
};

const getRisksByNode = async (req, res, next) => {
  try {
    const { nodeId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const risks = await RiskAssessment.findAll({
      where: { node_id: nodeId },
      order: [['created_at', 'DESC']],
      limit
    });

    res.json({
      success: true,
      count: risks.length,
      data: risks
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRiskAssessment,
  getCurrentRisks,
  getRiskHistory,
  getRisksByNode
};
