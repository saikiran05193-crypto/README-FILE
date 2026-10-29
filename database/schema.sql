-- ==================================================
-- Environmental Intelligence Network - SQL Database Schema
-- Database: environmental_network
-- ==================================================

CREATE DATABASE IF NOT EXISTS environmental_network;
USE environmental_network;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'OPERATOR', 'VIEWER') NOT NULL DEFAULT 'OPERATOR',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. SENSOR NODES TABLE
CREATE TABLE IF NOT EXISTS sensor_nodes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  node_code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  location_name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 6) NOT NULL,
  longitude DECIMAL(10, 6) NOT NULL,
  status ENUM('ONLINE', 'OFFLINE', 'WARNING') NOT NULL DEFAULT 'ONLINE',
  battery_level INT NOT NULL DEFAULT 100,
  last_seen DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sensor_nodes_code (node_code),
  INDEX idx_sensor_nodes_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. SENSOR READINGS TABLE
CREATE TABLE IF NOT EXISTS sensor_readings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  node_id INT NOT NULL,
  temperature FLOAT NULL,
  humidity FLOAT NULL,
  water_level FLOAT NULL,
  rainfall FLOAT NULL,
  smoke_level FLOAT NULL,
  flame_detected BOOLEAN DEFAULT FALSE,
  pm25 FLOAT NULL,
  pm10 FLOAT NULL,
  gas_level FLOAT NULL,
  data_source ENUM('EDGE', 'CLOUD', 'SIMULATION') DEFAULT 'EDGE',
  sync_status ENUM('SYNCED', 'PENDING', 'FAILED') DEFAULT 'SYNCED',
  recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (node_id) REFERENCES sensor_nodes(id) ON DELETE CASCADE,
  INDEX idx_readings_node_id (node_id),
  INDEX idx_readings_recorded_at (recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. RISK ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS risk_assessments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  node_id INT NOT NULL,
  fire_risk FLOAT NOT NULL DEFAULT 0,
  flood_risk FLOAT NOT NULL DEFAULT 0,
  pollution_risk FLOAT NOT NULL DEFAULT 0,
  overall_risk FLOAT NOT NULL DEFAULT 0,
  fire_confidence FLOAT NOT NULL DEFAULT 90,
  flood_confidence FLOAT NOT NULL DEFAULT 90,
  pollution_confidence FLOAT NOT NULL DEFAULT 90,
  assessment_source ENUM('EDGE_AI', 'SERVER_ANALYSIS', 'SIMULATION') NOT NULL DEFAULT 'SERVER_ANALYSIS',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (node_id) REFERENCES sensor_nodes(id) ON DELETE CASCADE,
  INDEX idx_risks_node_id (node_id),
  INDEX idx_risks_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. ALERTS TABLE
CREATE TABLE IF NOT EXISTS alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  node_id INT NOT NULL,
  hazard_type ENUM('FIRE', 'FLOOD', 'AIR_POLLUTION') NOT NULL,
  severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  risk_score FLOAT NOT NULL,
  confidence FLOAT NOT NULL DEFAULT 90,
  status ENUM('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  acknowledged_at DATETIME NULL,
  acknowledged_by INT NULL,
  FOREIGN KEY (node_id) REFERENCES sensor_nodes(id) ON DELETE CASCADE,
  FOREIGN KEY (acknowledged_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_alerts_node_id (node_id),
  INDEX idx_alerts_hazard_type (hazard_type),
  INDEX idx_alerts_severity (severity),
  INDEX idx_alerts_status (status),
  INDEX idx_alerts_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. SYSTEM EVENTS TABLE
CREATE TABLE IF NOT EXISTS system_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  node_id INT NULL,
  event_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (node_id) REFERENCES sensor_nodes(id) ON DELETE CASCADE,
  INDEX idx_events_node_id (node_id),
  INDEX idx_events_type (event_type),
  INDEX idx_events_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
