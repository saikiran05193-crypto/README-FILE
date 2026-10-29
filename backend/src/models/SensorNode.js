const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SensorNode = sequelize.define('SensorNode', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  node_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('ONLINE', 'OFFLINE', 'WARNING'),
    allowNull: false,
    defaultValue: 'ONLINE'
  },
  battery_level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  last_seen: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'sensor_nodes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = SensorNode;
