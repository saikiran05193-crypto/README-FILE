# Environmental Intelligence Network
## AI-Powered Multi-Hazard Early Warning & Monitoring System

A full-stack, real-time environmental monitoring and multi-hazard early-warning control center for **Fire / Wildfire**, **Flood**, and **Air Pollution** risks. Built with a React frontend, Node.js/Express REST & Socket.IO backend, normalized SQL database (MySQL / SQLite), and support for ESP32 Edge AI sensor node data streams.

---

## 🏛️ System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     REACT DASHBOARD                      │
│        (Fire | Flood | Air Pollution | Risk Map)         │
└────────────────────────────▲─────────────────────────────┘
                             │
                      REST API / Socket.IO
                             │
┌────────────────────────────▼─────────────────────────────┐
│                 NODE.JS + EXPRESS BACKEND                │
│     (Auth | Risk Engine | Alert Debouncer | Analytics)   │
└───────────────┬──────────────────────────▲───────────────┘
                │                          │
        ┌───────▼───────┐          ┌───────┴───────┐
        │  SQL DATABASE │          │  ESP32 NODE / │
        │ MySQL/SQLite  │          │  SIMULATOR    │
        └───────────────┘          └───────────────┘
```

---

## 📁 Project Folder Structure

```text
environmental-intelligence-network/
│
├── frontend/                     # React + Vite Client Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # Login Page & Quick Role Switchers
│   │   │   ├── dashboard/       # Hazard Cards, Risk Map, AI Assessment, Charts
│   │   │   ├── layout/          # Control Room Header & Sidebar
│   │   │   ├── modals/          # Emergency, Node Detail, ESP32, Node Management
│   │   │   └── views/           # Sub-views (Fire, Flood, Air, Alerts, Analytics)
│   │   ├── context/             # AuthContext (JWT & Role State)
│   │   ├── services/            # Axios API Client (`api.ts`) & Telemetry Sim
│   │   ├── types/               # TypeScript Interfaces (`telemetry.ts`)
│   │   └── App.tsx              # Main Dashboard Logic & Socket.IO Subscription
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # Node.js + Express + Socket.IO Server
│   ├── src/
│   │   ├── config/              # Sequelize DB Configuration (`database.js`)
│   │   ├── controllers/         # Auth, Node, Reading, Risk, Alert, Analytics
│   │   ├── middleware/          # Auth JWT, Role Checker, Error Handler
│   │   ├── models/              # Sequelize ORM (User, Node, Reading, Risk, Alert, Event)
│   │   ├── routes/              # Express API Endpoint Routes
│   │   ├── services/            # Risk Analysis Engine & Alert Debouncer
│   │   ├── scripts/             # DB Seed Script & Standalone Telemetry Simulator
│   │   └── server.js            # Express Server & Socket.IO Listener
│   ├── .env.example
│   ├── .env
│   └── package.json
│
├── database/                     # Raw SQL DDL & Seed Scripts
│   ├── schema.sql               # MySQL DDL with Tables, FKs, and Indexes
│   └── seed.sql                 # MySQL Initial Demo Data
│
├── package.json                  # Root Orchestrator Scripts
└── README.md                     # Complete Documentation & Manual
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, TypeScript, TailwindCSS v4, Recharts, Leaflet / OpenStreetMap, Axios, Socket.IO Client |
| **Backend** | Node.js, Express.js, Socket.IO, JWT Authentication, bcryptjs, Sequelize ORM |
| **Database** | MySQL / SQLite (via `mysql2` and `sqlite3` drivers) |
| **Edge Hardware / API** | ESP32 Wi-Fi Node support, REST HTTP Ingestion, Edge-AI Risk Payload Support |

---

## 🗄️ Database Design (`environmental_network`)

The database consists of 6 normalized tables with foreign key constraints and performance indexes:

1. **`users`**: Store user authentication data (`id`, `name`, `email`, `password_hash`, `role`: `ADMIN` | `OPERATOR` | `VIEWER`).
2. **`sensor_nodes`**: Deployed hardware nodes (`id`, `node_code`, `name`, `location_name`, `latitude`, `longitude`, `status`, `battery_level`, `last_seen`).
3. **`sensor_readings`**: High-frequency telemetry packets (`id`, `node_id`, `temperature`, `humidity`, `water_level`, `rainfall`, `smoke_level`, `flame_detected`, `pm25`, `pm10`, `gas_level`, `recorded_at`).
4. **`risk_assessments`**: Derived hazard scores 0-100% (`id`, `node_id`, `fire_risk`, `flood_risk`, `pollution_risk`, `overall_risk`, `assessment_source`: `EDGE_AI` | `SERVER_ANALYSIS` | `SIMULATION`).
5. **`alerts`**: Triggered warning notifications (`id`, `node_id`, `hazard_type`, `severity`, `title`, `message`, `risk_score`, `status`: `ACTIVE` | `ACKNOWLEDGED` | `RESOLVED`, `acknowledged_by`).
6. **`system_events`**: Audit log of node connections, AI alerts, and operator actions (`id`, `node_id`, `event_type`, `description`).

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **ADMIN** | `admin@environmental.net` | `password123` | Full access, Manage nodes (Add/Edit/Delete), Manage alerts & users |
| **OPERATOR** | `operator@environmental.net` | `password123` | View dashboard, Acknowledge & Resolve alerts, Trigger Emergency Broadcasts |
| **VIEWER** | `viewer@environmental.net` | `password123` | Read-only access to dashboard, maps, and analytics |

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ and **npm** installed on your system.
- *(Optional)* **MySQL** server running on port 3306. *(Note: SQLite is pre-configured as the out-of-the-box zero-setup database dialect in `.env`)*.

### 2. Installation
Run from the root project directory:

```bash
# Install frontend and backend dependencies
npm run install:all
```

Or install independently:
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 3. Database Initialization & Seeding
```bash
# Seed default users, nodes, historical readings, and initial alerts
npm run seed
```

### 4. Running the Full Stack Application

#### Option A: Run Both Concurrently (Recommended)
```bash
npm run dev
```

#### Option B: Run Backend & Frontend Separately
```bash
# Terminal 1 - Backend Server (Port 5000)
npm run dev:backend

# Terminal 2 - Frontend Vite Dashboard (Port 5173)
npm run dev:frontend
```

### 5. Running Sensor Telemetry Simulation Mode
In a separate terminal window, launch the standalone node simulator:
```bash
npm run simulate
```

---

## 🔌 REST API Endpoints

### 🔑 Authentication (`/api/auth`)
- `POST /api/auth/register` - Create user account (`name`, `email`, `password`, `role`)
- `POST /api/auth/login` - Authenticate and return JWT token
- `GET /api/auth/me` - Get current authenticated user session

### 📡 Sensor Nodes (`/api/nodes`)
- `GET /api/nodes` - List all deployed sensor nodes with latest readings and risk levels
- `GET /api/nodes/:id` - Get single node details, active alerts, and recent telemetry
- `POST /api/nodes` - *(Admin)* Register a new sensor node
- `PUT /api/nodes/:id` - *(Admin/Operator)* Update node metadata or status
- `DELETE /api/nodes/:id` - *(Admin)* Remove sensor node

### 📊 Sensor Data Ingestion (`/api/readings`)
- `POST /api/readings` - Ingest raw telemetry packet (from ESP32 or Simulator)
- `GET /api/readings` - Get historical readings list
- `GET /api/readings/latest` - Get most recent reading per node

Example ESP32 Reading Payload:
```json
POST /api/readings
{
  "nodeCode": "NODE-001",
  "temperature": 38.5,
  "humidity": 45.0,
  "waterLevel": 72.0,
  "rainfall": 35.0,
  "smokeLevel": 20.0,
  "flameDetected": false,
  "pm25": 85.0,
  "pm10": 120.0,
  "gasLevel": 30.0
}
```

### 🧠 Risk Assessments (`/api/risks`)
- `POST /api/risks` - Ingest Edge AI risk computation payload
- `GET /api/risks/current` - Get latest risk score per node
- `GET /api/risks/history` - Get risk calculation history log

Example Edge AI Risk Payload:
```json
POST /api/risks
{
  "nodeCode": "NODE-001",
  "fireRisk": 20,
  "floodRisk": 75,
  "pollutionRisk": 61,
  "overallRisk": 75,
  "fireConfidence": 91,
  "floodConfidence": 94,
  "pollutionConfidence": 89,
  "assessmentSource": "EDGE_AI"
}
```

### 🚨 Alert Management (`/api/alerts`)
- `GET /api/alerts` - List alerts (Supports query filters `hazard`, `severity`, `status`, `nodeId`)
- `GET /api/alerts/active` - Get active unacknowledged alerts
- `POST /api/alerts` - *(Operator/Admin)* Create manual or emergency broadcast alert
- `PUT /api/alerts/:id/acknowledge` - *(Operator/Admin)* Mark alert as acknowledged
- `PUT /api/alerts/:id/resolve` - *(Operator/Admin)* Resolve active alert

### 📈 Database Analytics (`/api/analytics`)
- `GET /api/analytics/overview` - SQL aggregated KPIs (Max temp, water level, avg PM2.5, node count)
- `GET /api/analytics/trends` - 24-hour historical risk trend series
- `GET /api/analytics/hazard-distribution` - Frequency count per hazard type

---

## 🛰️ ESP32 Edge Hardware Integration Guide

To connect an ESP32 micro-controller to stream data directly into the system:

1. Flash the ESP32 with Wi-Fi and HTTP Client libraries (`WiFi.h`, `HTTPClient.h`).
2. Read sensor pins (DHT22 for temp/humidity, MQ-2 for smoke/flame, Ultrasonic for water level, SDS011 for PM2.5/PM10).
3. Post JSON packet every 5–10 seconds to `http://<SERVER_IP>:5000/api/readings`.

Example ESP32 C++ Code Snippet:
```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://192.168.1.100:5000/api/readings";

void sendTelemetry() {
  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["nodeCode"] = "NODE-001";
    doc["temperature"] = 36.5;
    doc["humidity"] = 48.0;
    doc["waterLevel"] = 72.0;
    doc["rainfall"] = 25.0;
    doc["smokeLevel"] = 15.0;
    doc["flameDetected"] = false;
    doc["pm25"] = 65.0;

    String jsonString;
    serializeJson(doc, jsonString);

    int httpResponseCode = http.POST(jsonString);
    http.end();
  }
}
```

---

## 🧪 Verification & Test Results

- **Database Synchronization**: SQLite and MySQL schema tables, foreign key constraints, and seed records verified.
- **REST API Endpoints**: Auth JWT generation, Node CRUD, Sensor Reading ingestion, Risk Analysis calculations, Alert creation/acknowledgement, and Analytics queries tested.
- **Real-time Engine**: Socket.IO events (`telemetry_update`, `new_alert`, `alert_updated`) verified broadcasting live updates to dashboard UI without requiring page reloads.
- **Frontend Build**: React 19 + TypeScript + Vite build clean with 0 compilation errors.
