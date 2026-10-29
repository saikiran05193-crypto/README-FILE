const express = require('express');
const router = express.Router();
const {
  receiveSensorData,
  getLatestSensorData
} = require('../controllers/sensorDataController');

// POST /api/sensor-data (ESP32 ingestion endpoint)
router.post('/', receiveSensorData);

// GET /api/sensor-data (Latest ESP32 reading fetch endpoint)
router.get('/', getLatestSensorData);

module.exports = router;
