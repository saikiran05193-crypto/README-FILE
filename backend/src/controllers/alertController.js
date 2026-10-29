const { Alert, SensorNode, User, SystemEvent } = require('../models');

const getAlerts = async (req, res, next) => {
  try {
    const { hazard, severity, status, nodeId, limit } = req.query;
    const where = {};

    if (hazard && hazard !== 'ALL') where.hazard_type = hazard;
    if (severity) where.severity = severity;
    if (status) where.status = status;
    if (nodeId) where.node_id = nodeId;

    const queryLimit = parseInt(limit) || 100;

    const alerts = await Alert.findAll({
      where,
      include: [
        { model: SensorNode, as: 'node', attributes: ['node_code', 'name', 'location_name'] },
        { model: User, as: 'acknowledged_user', attributes: ['id', 'name', 'email'] }
      ],
      order: [['created_at', 'DESC']],
      limit: queryLimit
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

const getActiveAlerts = async (req, res, next) => {
  try {
    const activeAlerts = await Alert.findAll({
      where: { status: 'ACTIVE' },
      include: [
        { model: SensorNode, as: 'node', attributes: ['node_code', 'name', 'location_name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: activeAlerts.length,
      data: activeAlerts
    });
  } catch (err) {
    next(err);
  }
};

const createAlert = async (req, res, next) => {
  try {
    const { node_id, hazard_type, severity, title, message, risk_score, confidence } = req.body;

    const validNodeId = node_id || 1;
    const hazard = hazard_type || 'GENERAL';
    const alertSeverity = severity || 'CRITICAL';
    const alertTitle = title || '🚨 EMERGENCY ALERT';

    const alert = await Alert.create({
      node_id: validNodeId,
      hazard_type: hazard,
      severity: alertSeverity,
      title: alertTitle,
      message: message || alertTitle,
      risk_score: risk_score || 95,
      confidence: confidence || 98,
      status: 'ACTIVE',
      created_at: new Date()
    });

    await SystemEvent.create({
      node_id: validNodeId,
      event_type: 'ADMIN_EMERGENCY_BROADCAST',
      description: `Admin emergency alert broadcasted: ${alertTitle}. Message: ${alert.message}`,
      created_at: new Date()
    });

    const alertPayload = {
      type: 'EMERGENCY',
      severity: alertSeverity,
      hazard: hazard,
      title: alertTitle,
      message: alert.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      sender: req.user ? req.user.role : 'ADMIN',
      alert
    };

    const io = req.app.get('io');
    if (io) {
      // Emit emergency-alert (hyphenated per spec) & emergency_alert for maximum client compatibility
      io.emit('emergency-alert', alertPayload);
      io.emit('emergency_alert', alertPayload);
      io.emit('new_alert', {
        alert,
        node: { node_code: 'NODE-001', location_name: 'Control Center Broadcast' }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Emergency alert created and broadcasted successfully',
      data: alert
    });
  } catch (err) {
    next(err);
  }
};

const acknowledgeAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findByPk(id);

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    alert.status = 'ACKNOWLEDGED';
    alert.acknowledged_at = new Date();
    alert.acknowledged_by = req.user ? req.user.id : null;
    await alert.save();

    await SystemEvent.create({
      node_id: alert.node_id,
      event_type: 'ALERT_ACKNOWLEDGED',
      description: `Alert ID ${alert.id} (${alert.title}) acknowledged by user ${req.user ? req.user.name : 'Operator/Viewer'}.`,
      created_at: new Date()
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('alert_updated', { alert });
    }

    res.json({
      success: true,
      message: 'Alert acknowledged',
      data: alert
    });
  } catch (err) {
    next(err);
  }
};

const resolveAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findByPk(id);

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    alert.status = 'RESOLVED';
    await alert.save();

    await SystemEvent.create({
      node_id: alert.node_id,
      event_type: 'ALERT_RESOLVED',
      description: `Alert ID ${alert.id} (${alert.title}) resolved by user ${req.user ? req.user.name : 'Operator/Admin'}.`,
      created_at: new Date()
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('alert_updated', { alert });
    }

    res.json({
      success: true,
      message: 'Alert resolved',
      data: alert
    });
  } catch (err) {
    next(err);
  }
};

const deleteAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findByPk(id);

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    await alert.destroy();

    res.json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAlerts,
  getActiveAlerts,
  createAlert,
  acknowledgeAlert,
  resolveAlert,
  deleteAlert
};
