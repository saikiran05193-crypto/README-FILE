const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SystemEvent = sequelize.define('SystemEvent', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  node_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  event_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'system_events',
  timestamps: false
});

module.exports = SystemEvent;
