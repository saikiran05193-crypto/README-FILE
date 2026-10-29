const express = require('express');
const router = express.Router();
const {
  createReading,
  getReadings,
  getLatestReadings,
  getReadingsByNode
} = require('../controllers/readingController');

// Sensor data ingestion endpoint (open to ESP32 nodes and simulator)
router.post('/', createReading);

router.get('/', getReadings);
router.get('/latest', getLatestReadings);
router.get('/:nodeId', getReadingsByNode);

module.exports = router;
