const { sequelize, User, SensorNode, SensorReading, RiskAssessment, Alert, SystemEvent } = require('../models');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    console.log('[Seed Script] Connecting and syncing database schema...');
    await sequelize.sync({ force: true });
    console.log('[Seed Script] Schema synchronized.');

    // 1. Create Default Users
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('password123', salt);

    const users = await User.bulkCreate([
      {
        id: 1,
        name: 'System Administrator',
        email: 'admin@environmental.net',
        password_hash: defaultPasswordHash,
        role: 'ADMIN'
      },
      {
        id: 2,
        name: 'Chief Operator',
        email: 'operator@environmental.net',
        password_hash: defaultPasswordHash,
        role: 'OPERATOR'
      },
      {
        id: 3,
        name: 'Environmental Viewer',
        email: 'viewer@environmental.net',
        password_hash: defaultPasswordHash,
        role: 'VIEWER'
      }
    ]);
    console.log(`[Seed Script] Seeded ${users.length} users (Default password: password123)`);

    // 2. Create Sensor Nodes
    const nodes = await SensorNode.bulkCreate([
      {
        id: 1,
        node_code: 'NODE-001',
        name: 'River Basin Flood Station',
        location_name: 'Hussain Sagar Inlet, Hyderabad',
        latitude: 17.423900,
        longitude: 78.473800,
        status: 'ONLINE',
        battery_level: 94,
        last_seen: new Date()
      },
      {
        id: 2,
        node_code: 'NODE-002',
        name: 'Forest Fire Edge Watcher',
        location_name: 'KBR National Park, Jubilee Hills',
        latitude: 17.417200,
        longitude: 78.412400,
        status: 'ONLINE',
        battery_level: 88,
        last_seen: new Date()
      },
      {
        id: 3,
        node_code: 'NODE-003',
        name: 'Industrial Pollution Monitor',
        location_name: 'Balanagar Industrial Zone',
        latitude: 17.461200,
        longitude: 78.441900,
        status: 'WARNING',
        battery_level: 62,
        last_seen: new Date()
      },
      {
        id: 4,
        node_code: 'NODE-004',
        name: 'Urban Drainage Early Warning',
        location_name: 'Begumpet Storm Canal',
        latitude: 17.444800,
        longitude: 78.466100,
        status: 'ONLINE',
        battery_level: 91,
        last_seen: new Date()
      },
      {
        id: 5,
        node_code: 'NODE-005',
        name: 'Ridge Forest Thermal Canopy',
        location_name: 'Gachibowli Bio-Park',
        latitude: 17.440100,
        longitude: 78.348900,
        status: 'ONLINE',
        battery_level: 98,
        last_seen: new Date()
      }
    ]);
    console.log(`[Seed Script] Seeded ${nodes.length} sensor nodes.`);

    // 3. Create Sensor Readings
    const now = Date.now();
    const readingsData = [];
    
    // Generate 25 realistic historical readings across 5 nodes
    const sampleProfiles = [
      { temp: 33, hum: 72, water: 82, rain: 65, smoke: 15, flame: false, pm25: 48, pm10: 76, gas: 28 },
      { temp: 44, hum: 22, water: 10, rain: 0, smoke: 94, flame: true, pm25: 220, pm10: 310, gas: 92 },
      { temp: 38, hum: 43, water: 30, rain: 5, smoke: 64, flame: false, pm25: 215, pm10: 360, gas: 118 },
      { temp: 32, hum: 82, water: 74, rain: 55, smoke: 21, flame: false, pm25: 46, pm10: 74, gas: 24 },
      { temp: 35, hum: 42, water: 20, rain: 0, smoke: 30, flame: false, pm25: 64, pm10: 102, gas: 35 }
    ];

    for (let i = 0; i < 5; i++) {
      const profile = sampleProfiles[i];
      const nodeId = nodes[i].id;
      for (let h = 4; h >= 0; h--) {
        readingsData.push({
          node_id: nodeId,
          temperature: Math.round((profile.temp + (Math.random() * 2 - 1)) * 10) / 10,
          humidity: Math.round((profile.hum + (Math.random() * 4 - 2)) * 10) / 10,
          water_level: Math.round((profile.water + (Math.random() * 3 - 1.5)) * 10) / 10,
          rainfall: Math.round((profile.rain + (Math.random() * 5 - 2.5)) * 10) / 10,
          smoke_level: Math.round((profile.smoke + (Math.random() * 3 - 1.5)) * 10) / 10,
          flame_detected: profile.flame,
          pm25: Math.round(profile.pm25 + (Math.random() * 10 - 5)),
          pm10: Math.round(profile.pm10 + (Math.random() * 15 - 7.5)),
          gas_level: Math.round(profile.gas + (Math.random() * 4 - 2)),
          data_source: 'EDGE',
          sync_status: 'SYNCED',
          recorded_at: new Date(now - h * 3600 * 1000)
        });
      }
    }

    const readings = await SensorReading.bulkCreate(readingsData);
    console.log(`[Seed Script] Seeded ${readings.length} sensor readings.`);

    // 4. Create Risk Assessments
    const risks = await RiskAssessment.bulkCreate([
      {
        node_id: 1,
        fire_risk: 15,
        flood_risk: 84.5,
        pollution_risk: 32,
        overall_risk: 84.5,
        fire_confidence: 94,
        flood_confidence: 96.5,
        pollution_confidence: 91,
        assessment_source: 'EDGE_AI',
        created_at: new Date(now - 30 * 60 * 1000)
      },
      {
        node_id: 2,
        fire_risk: 92.5,
        flood_risk: 12,
        pollution_risk: 78,
        overall_risk: 92.5,
        fire_confidence: 98,
        flood_confidence: 95,
        pollution_confidence: 93,
        assessment_source: 'EDGE_AI',
        created_at: new Date(now - 20 * 60 * 1000)
      },
      {
        node_id: 3,
        fire_risk: 38,
        flood_risk: 25,
        pollution_risk: 88,
        overall_risk: 88,
        fire_confidence: 90,
        flood_confidence: 92,
        pollution_confidence: 97,
        assessment_source: 'EDGE_AI',
        created_at: new Date(now - 15 * 60 * 1000)
      },
      {
        node_id: 4,
        fire_risk: 22,
        flood_risk: 71,
        pollution_risk: 35,
        overall_risk: 71,
        fire_confidence: 92,
        flood_confidence: 94,
        pollution_confidence: 89,
        assessment_source: 'SERVER_ANALYSIS',
        created_at: new Date(now - 10 * 60 * 1000)
      },
      {
        node_id: 5,
        fire_risk: 28,
        flood_risk: 18,
        pollution_risk: 42,
        overall_risk: 42,
        fire_confidence: 91,
        flood_confidence: 93,
        pollution_confidence: 90,
        assessment_source: 'SERVER_ANALYSIS',
        created_at: new Date(now - 5 * 60 * 1000)
      }
    ]);
    console.log(`[Seed Script] Seeded ${risks.length} risk assessments.`);

    // 5. Create Alerts
    const alerts = await Alert.bulkCreate([
      {
        id: 1,
        node_id: 2,
        hazard_type: 'FIRE',
        severity: 'CRITICAL',
        title: 'Wildfire Ignition Detected',
        message: 'Thermal sensors at KBR National Park registered a fire risk score of 92.5/100 with active flame trigger.',
        risk_score: 92.5,
        confidence: 98.0,
        status: 'ACTIVE',
        created_at: new Date(now - 45 * 60 * 1000)
      },
      {
        id: 2,
        node_id: 3,
        hazard_type: 'AIR_POLLUTION',
        severity: 'CRITICAL',
        title: 'Hazardous Air Quality Threshold Exceeded',
        message: 'PM2.5 concentration reached 215 ug/m3 and toxic gas level spikes in Balanagar Industrial Zone.',
        risk_score: 88.0,
        confidence: 97.0,
        status: 'ACTIVE',
        created_at: new Date(now - 30 * 60 * 1000)
      },
      {
        id: 3,
        node_id: 1,
        hazard_type: 'FLOOD',
        severity: 'CRITICAL',
        title: 'River Overflow & High Inflow Alert',
        message: 'Water level at Hussain Sagar Inlet rose to 89.2% with active rainfall of 71.5 mm/hr.',
        risk_score: 84.5,
        confidence: 96.5,
        status: 'ACKNOWLEDGED',
        created_at: new Date(now - 90 * 60 * 1000),
        acknowledged_at: new Date(now - 60 * 60 * 1000),
        acknowledged_by: 2
      },
      {
        id: 4,
        node_id: 4,
        hazard_type: 'FLOOD',
        severity: 'HIGH',
        title: 'Urban Drainage Capacity Warning',
        message: 'Storm canal water level reached 74.0%. Low-lying inundation warning emitted for Begumpet sector.',
        risk_score: 71.0,
        confidence: 94.0,
        status: 'ACTIVE',
        created_at: new Date(now - 20 * 60 * 1000)
      }
    ]);
    console.log(`[Seed Script] Seeded ${alerts.length} initial alerts.`);

    // 6. Create System Events
    const events = await SystemEvent.bulkCreate([
      {
        node_id: 1,
        event_type: 'NODE_CONNECTED',
        description: 'Sensor Node NODE-001 connected to environmental network REST API.',
        created_at: new Date(now - 5 * 3600 * 1000)
      },
      {
        node_id: 2,
        event_type: 'AI_ALERT',
        description: 'Edge AI triggered CRITICAL FIRE ALERT on NODE-002.',
        created_at: new Date(now - 45 * 60 * 1000)
      },
      {
        node_id: 3,
        event_type: 'SYSTEM_WARNING',
        description: 'Air Quality Index degraded to HAZARDOUS on NODE-003.',
        created_at: new Date(now - 30 * 60 * 1000)
      },
      {
        node_id: 1,
        event_type: 'DATA_RECEIVED',
        description: 'Telemetry packet received via Wi-Fi from NODE-001.',
        created_at: new Date(now - 5 * 60 * 1000)
      }
    ]);
    console.log(`[Seed Script] Seeded ${events.length} system events.`);

    console.log('\n==================================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(' Demo Login Credentials:');
    console.log(' - ADMIN:    admin@environmental.net    / password123');
    console.log(' - OPERATOR: operator@environmental.net / password123');
    console.log(' - VIEWER:   viewer@environmental.net   / password123');
    console.log('==================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seed();
