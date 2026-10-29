const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  node_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  hazard_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  risk_score: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  confidence: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 90
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'),
    allowNull: false,
    defaultValue: 'ACTIVE'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  acknowledged_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  acknowledged_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'alerts',
  timestamps: false
});

module.exports = Alert;
