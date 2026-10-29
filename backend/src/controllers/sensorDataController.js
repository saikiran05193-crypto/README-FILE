let latestSensorReading = null;

/**
 * POST /api/sensor-data
 * Ingest sensor values directly from ESP32 over Wi-Fi HTTP POST.
 */
const receiveSensorData = async (req, res, next) => {
  try {
    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON payload. Body must be a JSON object.'
      });
    }

    const { water, rain, smoke, temperature, humidity, pm25, pm10, flood, fire, airAlert, timestamp } = body;

    // Validate numeric or null fields if present
    if (water !== undefined && water !== null && typeof water !== 'number') {
      return res.status(400).json({ success: false, error: 'Field "water" must be a number or null' });
    }
    if (rain !== undefined && rain !== null && typeof rain !== 'number') {
      return res.status(400).json({ success: false, error: 'Field "rain" must be a number or null' });
    }
    if (smoke !== undefined && smoke !== null && typeof smoke !== 'number') {
      return res.status(400).json({ success: false, error: 'Field "smoke" must be a number or null' });
    }
    if (temperature !== undefined && temperature !== null && typeof temperature !== 'number') {
      return res.status(400).json({ success: false, error: 'Field "temperature" must be a number or null' });
    }
    if (humidity !== undefined && humidity !== null && typeof humidity !== 'number') {
      return res.status(400).json({ success: false, error: 'Field "humidity" must be a number or null' });
    }
    if (pm25 !== undefined && pm25 !== null && typeof pm25 !== 'number') {
      return res.status(400).json({ success: false, error: 'Field "pm25" must be a number or null' });
    }
    if (pm10 !== undefined && pm10 !== null && typeof pm10 !== 'number') {
      return res.status(400).json({ success: false, error: 'Field "pm10" must be a number or null' });
    }

    // Determine flood, fire, and airAlert statuses based on thresholds if not explicitly booleans
    const waterVal = typeof water === 'number' ? water : 0;
    const rainVal = typeof rain === 'number' ? rain : 0;
    const smokeVal = typeof smoke === 'number' ? smoke : 0;
    const pm25Val = typeof pm25 === 'number' ? pm25 : null;

    const floodStatus = typeof flood === 'boolean' ? flood : (waterVal > 2000 || rainVal > 1500);
    const fireStatus = typeof fire === 'boolean' ? fire : (smokeVal > 1800);
    const airAlertStatus = typeof airAlert === 'boolean' ? airAlert : (pm25Val !== null && pm25Val > 35);

    const now = new Date().toISOString();

    latestSensorReading = {
      water: water !== undefined ? water : null,
      rain: rain !== undefined ? rain : null,
      smoke: smoke !== undefined ? smoke : null,
      temperature: temperature !== undefined ? temperature : null,
      humidity: humidity !== undefined ? humidity : null,
      pm25: pm25 !== undefined ? pm25 : null,
      pm10: pm10 !== undefined ? pm10 : null,
      flood: floodStatus,
      fire: fireStatus,
      airAlert: airAlertStatus,
      timestamp: timestamp || now,
      receivedAt: now
    };

    console.log('[API] Sensor data received:', latestSensorReading);

    // Broadcast live telemetry update over Socket.IO to connected web clients
    const io = req.app.get('io');
    if (io) {
      console.log('[Socket.IO] Broadcasting sensorData:', latestSensorReading);
      io.emit('sensorData', latestSensorReading);

      // Also emit compatibility telemetry_update event
      io.emit('telemetry_update', {
        node: {
          id: 1,
          node_code: 'NODE-001',
          name: 'ESP32 Main Station',
          location_name: 'Environmental Monitoring Site'
        },
        reading: {
          temperature: latestSensorReading.temperature,
          humidity: latestSensorReading.humidity,
          water_level: latestSensorReading.water,
          rainfall: latestSensorReading.rain,
          smoke_level: latestSensorReading.smoke,
          flame_detected: latestSensorReading.fire,
          pm25: latestSensorReading.pm25,
          pm10: latestSensorReading.pm10,
          recorded_at: latestSensorReading.timestamp
        },
        sensorData: latestSensorReading
      });
    }

    res.status(200).json({
      success: true,
      message: 'ESP32 sensor data received successfully',
      data: latestSensorReading
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/sensor-data
 * Retrieve latest stored ESP32 sensor reading in memory.
 */
const getLatestSensorData = (req, res) => {
  res.status(200).json({
    success: true,
    data: latestSensorReading || {
      water: null,
      rain: null,
      smoke: null,
      temperature: null,
      humidity: null,
      pm25: null,
      pm10: null,
      flood: false,
      fire: false,
      airAlert: false,
      timestamp: null,
      receivedAt: null
    }
  });
};

module.exports = {
  receiveSensorData,
  getLatestSensorData
};
