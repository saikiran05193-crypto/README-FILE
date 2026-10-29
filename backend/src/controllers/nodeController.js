const { SensorNode, SensorReading, RiskAssessment, Alert, SystemEvent } = require('../models');

const getNodes = async (req, res, next) => {
  try {
    const nodes = await SensorNode.findAll({
      order: [['id', 'ASC']]
    });

    // Attach latest readings and latest risks to each node for rich map/dashboard representation
    const enrichedNodes = await Promise.all(
      nodes.map(async (node) => {
        const nodeData = node.toJSON();
        
        const latestReading = await SensorReading.findOne({
          where: { node_id: node.id },
          order: [['recorded_at', 'DESC']]
        });

        const latestRisk = await RiskAssessment.findOne({
          where: { node_id: node.id },
          order: [['created_at', 'DESC']]
        });

        return {
          ...nodeData,
          latestReading: latestReading ? latestReading.toJSON() : null,
          latestRisk: latestRisk ? latestRisk.toJSON() : null
        };
      })
    );

    res.json({
      success: true,
      count: enrichedNodes.length,
      data: enrichedNodes
    });
  } catch (err) {
    next(err);
  }
};

const getNodeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const node = await SensorNode.findByPk(id);

    if (!node) {
      return res.status(404).json({ success: false, message: 'Sensor node not found' });
    }

    const latestReading = await SensorReading.findOne({
      where: { node_id: node.id },
      order: [['recorded_at', 'DESC']]
    });

    const latestRisk = await RiskAssessment.findOne({
      where: { node_id: node.id },
      order: [['created_at', 'DESC']]
    });

    const activeAlerts = await Alert.findAll({
      where: { node_id: node.id, status: 'ACTIVE' },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        ...node.toJSON(),
        latestReading: latestReading ? latestReading.toJSON() : null,
        latestRisk: latestRisk ? latestRisk.toJSON() : null,
        activeAlertsCount: activeAlerts.length,
        activeAlerts
      }
    });
  } catch (err) {
    next(err);
  }
};

const createNode = async (req, res, next) => {
  try {
    const { node_code, name, location_name, latitude, longitude, status, battery_level } = req.body;

    if (!node_code || !name || !location_name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'node_code, name, location_name, latitude, and longitude are required' });
    }

    const existing = await SensorNode.findOne({ where: { node_code } });
    if (existing) {
      return res.status(400).json({ success: false, message: `Node with code ${node_code} already exists` });
    }

    const node = await SensorNode.create({
      node_code,
      name,
      location_name,
      latitude,
      longitude,
      status: status || 'ONLINE',
      battery_level: battery_level !== undefined ? battery_level : 100,
      last_seen: new Date()
    });

    await SystemEvent.create({
      node_id: node.id,
      event_type: 'NODE_CONNECTED',
      description: `New sensor node ${node.node_code} registered in system.`,
      created_at: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Sensor node created successfully',
      data: node
    });
  } catch (err) {
    next(err);
  }
};

const updateNode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const node = await SensorNode.findByPk(id);

    if (!node) {
      return res.status(404).json({ success: false, message: 'Sensor node not found' });
    }

    const { name, location_name, latitude, longitude, status, battery_level } = req.body;

    if (name !== undefined) node.name = name;
    if (location_name !== undefined) node.location_name = location_name;
    if (latitude !== undefined) node.latitude = latitude;
    if (longitude !== undefined) node.longitude = longitude;
    if (status !== undefined) node.status = status;
    if (battery_level !== undefined) node.battery_level = battery_level;

    node.last_seen = new Date();
    await node.save();

    res.json({
      success: true,
      message: 'Sensor node updated successfully',
      data: node
    });
  } catch (err) {
    next(err);
  }
};

const deleteNode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const node = await SensorNode.findByPk(id);

    if (!node) {
      return res.status(404).json({ success: false, message: 'Sensor node not found' });
    }

    await node.destroy();

    res.json({
      success: true,
      message: 'Sensor node deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

const getNodeReadings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const readings = await SensorReading.findAll({
      where: { node_id: id },
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

const getNodeRisks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const risks = await RiskAssessment.findAll({
      where: { node_id: id },
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

const getNodeAlerts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const alerts = await Alert.findAll({
      where: { node_id: id },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNodes,
  getNodeById,
  createNode,
  updateNode,
  deleteNode,
  getNodeReadings,
  getNodeRisks,
  getNodeAlerts
};
