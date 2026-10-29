-- ==================================================
-- Environmental Intelligence Network - Seed Data
-- Database: environmental_network
-- Default Password for all seed users: password123
-- ==================================================

USE environmental_network;

-- Disable Foreign Key checks for clean insertion
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE system_events;
TRUNCATE TABLE alerts;
TRUNCATE TABLE risk_assessments;
TRUNCATE TABLE sensor_readings;
TRUNCATE TABLE sensor_nodes;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. SEED USERS
-- Default Password: password123
-- Bcrypt Hash: $2b$10$wT8fH2p5A2y2/gJgXQ0Ue.yR4z.0/zV.N/V1v3p1N1o1r1s1t1u1v (or generated at seed time)
INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES
(1, 'System Administrator', 'admin@environmental.net', '$2a$10$wP2J3/N5bE6rN4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H', 'ADMIN', NOW()),
(2, 'Chief Operator', 'operator@environmental.net', '$2a$10$wP2J3/N5bE6rN4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H', 'OPERATOR', NOW()),
(3, 'Environmental Viewer', 'viewer@environmental.net', '$2a$10$wP2J3/N5bE6rN4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H', 'VIEWER', NOW());

-- 2. SEED SENSOR NODES
INSERT INTO sensor_nodes (id, node_code, name, location_name, latitude, longitude, status, battery_level, last_seen, created_at) VALUES
(1, 'NODE-001', 'River Basin Flood Station', 'Hussain Sagar Inlet, Hyderabad', 17.423900, 78.473800, 'ONLINE', 94, NOW(), NOW()),
(2, 'NODE-002', 'Forest Fire Edge Watcher', 'KBR National Park, Jubilee Hills', 17.417200, 78.412400, 'ONLINE', 88, NOW(), NOW()),
(3, 'NODE-003', 'Industrial Pollution Monitor', 'Balanagar Industrial Zone', 17.461200, 78.441900, 'WARNING', 62, NOW(), NOW()),
(4, 'NODE-004', 'Urban Drainage Early Warning', 'Begumpet Storm Canal', 17.444800, 78.466100, 'ONLINE', 91, NOW(), NOW()),
(5, 'NODE-005', 'Ridge Forest Thermal Canopy', 'Gachibowli Bio-Park', 17.440100, 78.348900, 'ONLINE', 98, NOW(), NOW());

-- 3. SEED SENSOR READINGS
INSERT INTO sensor_readings (node_id, temperature, humidity, water_level, rainfall, smoke_level, flame_detected, pm25, pm10, gas_level, data_source, sync_status, recorded_at) VALUES
(1, 32.5, 68.0, 78.4, 45.2, 12.0, FALSE, 42.0, 68.0, 22.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(1, 33.1, 71.2, 82.1, 52.0, 14.2, FALSE, 45.0, 72.0, 25.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(1, 33.8, 74.5, 86.5, 64.8, 15.0, FALSE, 48.0, 76.0, 28.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(1, 34.2, 78.0, 89.2, 71.5, 16.5, FALSE, 52.0, 81.0, 31.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 1 HOUR)),

(2, 39.5, 31.0, 15.0, 0.0, 65.4, TRUE, 115.0, 180.0, 48.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(2, 41.2, 28.4, 14.2, 0.0, 78.9, TRUE, 142.0, 210.0, 62.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(2, 42.8, 25.1, 12.0, 0.0, 88.5, TRUE, 185.0, 260.0, 78.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 44.1, 22.0, 10.5, 0.0, 94.2, TRUE, 220.0, 310.0, 92.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 1 HOUR)),

(3, 36.4, 52.0, 35.0, 12.0, 45.0, FALSE, 148.0, 240.0, 85.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(3, 37.1, 49.0, 34.0, 10.0, 52.0, FALSE, 172.0, 285.0, 94.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(3, 37.8, 46.5, 32.5, 8.0, 58.0, FALSE, 195.0, 320.0, 105.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(3, 38.5, 43.0, 30.0, 5.0, 64.0, FALSE, 215.0, 360.0, 118.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 1 HOUR)),

(4, 31.2, 75.0, 62.0, 38.0, 18.0, FALSE, 38.0, 62.0, 20.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(4, 31.8, 79.5, 68.4, 46.5, 19.5, FALSE, 42.0, 68.0, 22.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(4, 32.4, 82.0, 74.0, 55.0, 21.0, FALSE, 46.0, 74.0, 24.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 1 HOUR)),

(5, 34.0, 48.0, 22.0, 5.0, 25.0, FALSE, 55.0, 88.0, 30.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(5, 34.8, 45.0, 21.0, 2.0, 28.0, FALSE, 60.0, 95.0, 33.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(5, 35.5, 42.0, 20.0, 0.0, 30.0, FALSE, 64.0, 102.0, 35.0, 'EDGE', 'SYNCED', DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- 4. SEED RISK ASSESSMENTS
INSERT INTO risk_assessments (node_id, fire_risk, flood_risk, pollution_risk, overall_risk, fire_confidence, flood_confidence, pollution_confidence, assessment_source, created_at) VALUES
(1, 15.0, 84.5, 32.0, 84.5, 94.0, 96.5, 91.0, 'EDGE_AI', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(2, 92.5, 12.0, 78.0, 92.5, 98.0, 95.0, 93.0, 'EDGE_AI', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(3, 38.0, 25.0, 88.0, 88.0, 90.0, 92.0, 97.0, 'EDGE_AI', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(4, 22.0, 71.0, 35.0, 71.0, 92.0, 94.0, 89.0, 'SERVER_ANALYSIS', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(5, 28.0, 18.0, 42.0, 42.0, 91.0, 93.0, 90.0, 'SERVER_ANALYSIS', DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- 5. SEED ALERTS
INSERT INTO alerts (id, node_id, hazard_type, severity, title, message, risk_score, confidence, status, created_at, acknowledged_at, acknowledged_by) VALUES
(1, 2, 'FIRE', 'CRITICAL', 'Wildfire Ignition Detected', 'Flame detected on optical sensor array with temperature reaching 44.1C and smoke level 94.2%. Immediate fire service dispatch recommended.', 92.5, 98.0, 'ACTIVE', DATE_SUB(NOW(), INTERVAL 45 MINUTE), NULL, NULL),
(2, 3, 'AIR_POLLUTION', 'CRITICAL', 'Hazardous Air Quality Threshold Exceeded', 'PM2.5 concentration reached 215 ug/m3 and toxic gas level spikes in Balanagar Industrial Zone.', 88.0, 97.0, 'ACTIVE', DATE_SUB(NOW(), INTERVAL 30 MINUTE), NULL, NULL),
(3, 1, 'FLOOD', 'CRITICAL', 'River Overflow & High Inflow Alert', 'Water level at Hussain Sagar Inlet rose to 89.2% with active rainfall of 71.5 mm/hr. Flood barrier activation advised.', 84.5, 96.5, 'ACKNOWLEDGED', DATE_SUB(NOW(), INTERVAL 90 MINUTE), DATE_SUB(NOW(), INTERVAL 60 MINUTE), 2),
(4, 4, 'FLOOD', 'HIGH', 'Urban Drainage Capacity Warning', 'Storm canal water level reached 74.0%. Low-lying inundation warning emitted for Begumpet sector.', 71.0, 94.0, 'ACTIVE', DATE_SUB(NOW(), INTERVAL 20 MINUTE), NULL, NULL);

-- 6. SEED SYSTEM EVENTS
INSERT INTO system_events (node_id, event_type, description, created_at) VALUES
(1, 'NODE_CONNECTED', 'Sensor Node NODE-001 connected to environmental network REST API.', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(2, 'AI_ALERT', 'Edge AI triggered CRITICAL FIRE ALERT on NODE-002.', DATE_SUB(NOW(), INTERVAL 45 MINUTE)),
(3, 'SYSTEM_WARNING', 'Air Quality Index degraded to HAZARDOUS on NODE-003.', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
(1, 'DATA_RECEIVED', 'Telemetry packet received via Wi-Fi from NODE-001.', DATE_SUB(NOW(), INTERVAL 5 MINUTE));
