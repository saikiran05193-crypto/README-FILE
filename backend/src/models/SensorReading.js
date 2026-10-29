const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SensorReading = sequelize.define('SensorReading', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  node_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  humidity: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  water_level: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  rainfall: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  smoke_level: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  flame_detected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  pm25: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  pm10: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  gas_level: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  data_source: {
    type: DataTypes.ENUM('EDGE', 'CLOUD', 'SIMULATION'),
    defaultValue: 'EDGE'
  },
  sync_status: {
    type: DataTypes.ENUM('SYNCED', 'PENDING', 'FAILED'),
    defaultValue: 'SYNCED'
  },
  recorded_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'sensor_readings',
  timestamps: false
});

module.exports = SensorReading;
