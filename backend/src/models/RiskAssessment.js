const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RiskAssessment = sequelize.define('RiskAssessment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  node_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fire_risk: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  flood_risk: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  pollution_risk: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  overall_risk: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  fire_confidence: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 90
  },
  flood_confidence: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 90
  },
  pollution_confidence: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 90
  },
  assessment_source: {
    type: DataTypes.ENUM('EDGE_AI', 'SERVER_ANALYSIS', 'SIMULATION'),
    allowNull: false,
    defaultValue: 'SERVER_ANALYSIS'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'risk_assessments',
  timestamps: false
});

module.exports = RiskAssessment;
