const sequelize = require('../config/database');
const User = require('./User');
const SensorNode = require('./SensorNode');
const SensorReading = require('./SensorReading');
const RiskAssessment = require('./RiskAssessment');
const Alert = require('./Alert');
const SystemEvent = require('./SystemEvent');

// Define Relationships

// Sensor Node -> Sensor Readings
SensorNode.hasMany(SensorReading, { foreignKey: 'node_id', as: 'readings' });
SensorReading.belongsTo(SensorNode, { foreignKey: 'node_id', as: 'node' });

// Sensor Node -> Risk Assessments
SensorNode.hasMany(RiskAssessment, { foreignKey: 'node_id', as: 'risks' });
RiskAssessment.belongsTo(SensorNode, { foreignKey: 'node_id', as: 'node' });

// Sensor Node -> Alerts
SensorNode.hasMany(Alert, { foreignKey: 'node_id', as: 'alerts' });
Alert.belongsTo(SensorNode, { foreignKey: 'node_id', as: 'node' });

// Sensor Node -> System Events
SensorNode.hasMany(SystemEvent, { foreignKey: 'node_id', as: 'events' });
SystemEvent.belongsTo(SensorNode, { foreignKey: 'node_id', as: 'node' });

// User -> Alert Acknowledgements
User.hasMany(Alert, { foreignKey: 'acknowledged_by', as: 'acknowledged_alerts' });
Alert.belongsTo(User, { foreignKey: 'acknowledged_by', as: 'acknowledged_user' });

module.exports = {
  sequelize,
  User,
  SensorNode,
  SensorReading,
  RiskAssessment,
  Alert,
  SystemEvent
};
