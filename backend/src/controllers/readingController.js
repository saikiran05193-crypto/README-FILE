const { SensorNode, SensorReading, RiskAssessment, SystemEvent } = require('../models');
const { analyzeReading } = require('../services/riskAnalysisService');
const { evaluateAndTriggerAlerts } = require('../services/alertEngine');

const createReading = async (req, res, next) => {
  try {
    const {
      nodeCode,
      nodeId,
      temperature,
      humidity,
      waterLevel,
      rainfall,
      smokeLevel,
      flameDetected,
      pm25,
      pm10,
      gasLevel,
      dataSource,
      syncStatus
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

    // Update node status and last seen
    node.status = 'ONLINE';
    node.last_seen = new Date();
    await node.save();

    // Create Sensor Reading record
    const reading = await SensorReading.create({
      node_id: node.id,
      temperature: temperature !== undefined ? temperature : null,
      humidity: humidity !== undefined ? humidity : null,
      water_level: waterLevel !== undefined ? waterLevel : null,
      rainfall: rainfall !== undefined ? rainfall : null,
      smoke_level: smokeLevel !== undefined ? smokeLevel : null,
      flame_detected: flameDetected !== undefined ? Boolean(flameDetected) : false,
      pm25: pm25 !== undefined ? pm25 : null,
      pm10: pm10 !== undefined ? pm10 : null,
      gas_level: gasLevel !== undefined ? gasLevel : null,
      data_source: dataSource || 'EDGE',
      sync_status: syncStatus || 'SYNCED',
      recorded_at: new Date()
    });

    // Run Server-side Risk Analysis
    const source = dataSource === 'SIMULATION' ? 'SIMULATION' : 'SERVER_ANALYSIS';
    const riskData = analyzeReading({
      temperature: reading.temperature,
      humidity: reading.humidity,
      water_level: reading.water_level,
      rainfall: reading.rainfall,
      smoke_level: reading.smoke_level,
      flame_detected: reading.flame_detected,
      pm25: reading.pm25,
      pm10: reading.pm10,
      gas_level: reading.gas_level
    }, source);

    const riskAssessment = await RiskAssessment.create({
      node_id: node.id,
      fire_risk: riskData.fire_risk,
      flood_risk: riskData.flood_risk,
      pollution_risk: riskData.pollution_risk,
      overall_risk: riskData.overall_risk,
      fire_confidence: riskData.fire_confidence,
      flood_confidence: riskData.flood_confidence,
      pollution_confidence: riskData.pollution_confidence,
      assessment_source: riskData.assessment_source,
      created_at: new Date()
    });

    // Check & trigger alerts
    const io = req.app.get('io');
    const alertsTriggered = await evaluateAndTriggerAlerts(node.id, riskData, io);

    // Emit live Socket.IO telemetry update
    if (io) {
      io.emit('telemetry_update', {
        node: {
          id: node.id,
          node_code: node.node_code,
          name: node.name,
          location_name: node.location_name
        },
        reading: reading.toJSON(),
        risk: riskAssessment.toJSON()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Sensor reading recorded and analyzed',
      data: {
        reading,
        risk: riskAssessment,
        alertsTriggered: alertsTriggered.length
      }
    });
  } catch (err) {
    next(err);
  }
};

const getReadings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const readings = await SensorReading.findAll({
      include: [{ model: SensorNode, as: 'node', attributes: ['node_code', 'name', 'location_name'] }],
      order: [['recorded_at', 'DESC']],
      limit
    });

    res.json({
      success: true,
      count: readings.length,
      data: readings
    });
  } catch (err) {
    next(err);
  }
};

const getLatestReadings = async (req, res, next) => {
  try {
    const nodes = await SensorNode.findAll();
    const latestReadings = await Promise.all(
      nodes.map(async (node) => {
        const reading = await SensorReading.findOne({
          where: { node_id: node.id },
          order: [['recorded_at', 'DESC']]
        });
        return {
          node: {
            id: node.id,
            node_code: node.node_code,
            name: node.name,
            location_name: node.location_name
          },
          reading: reading ? reading.toJSON() : null
        };
      })
    );

    res.json({
      success: true,
      data: latestReadings
    });
  } catch (err) {
    next(err);
  }
};

const getReadingsByNode = async (req, res, next) => {
  try {
    const { nodeId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const readings = await SensorReading.findAll({
      where: { node_id: nodeId },
      order: [['recorded_at', 'DESC']],
      limit
    });

    res.json({
      success: true,
      count: readings.length,
      data: readings
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReading,
  getReadings,
  getLatestReadings,
  getReadingsByNode
};
