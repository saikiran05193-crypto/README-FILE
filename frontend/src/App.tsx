import React, { useState, useEffect, useCallback, useRef } from 'react';
import { io as socketIO, Socket } from 'socket.io-client';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { RiskOverviewCards } from './components/dashboard/RiskOverviewCards';
import { HazardCards } from './components/dashboard/HazardCards';
import { AIAssessment } from './components/dashboard/AIAssessment';
import { LiveSensorsGrid } from './components/dashboard/LiveSensorsGrid';
import { EnvironmentalMap } from './components/dashboard/EnvironmentalMap';
import { AlertPanel } from './components/dashboard/AlertPanel';
import { RiskCharts } from './components/dashboard/RiskCharts';
import { SystemArchitecture } from './components/dashboard/SystemArchitecture';

// Views
import { FireMonitoringView } from './components/views/FireMonitoringView';
import { FloodMonitoringView } from './components/views/FloodMonitoringView';
import { AirPollutionView } from './components/views/AirPollutionView';
import { RiskMapView } from './components/views/RiskMapView';
import { SensorNodesView } from './components/views/SensorNodesView';
import { AlertsView } from './components/views/AlertsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SystemSettingsView } from './components/views/SystemSettingsView';

// Modals & Auth
import { EmergencyModal } from './components/modals/EmergencyModal';
import { EmergencyAlertModal } from './components/modals/EmergencyAlertModal';
import { NodeDetailModal } from './components/modals/NodeDetailModal';
import { ESP32ConnectModal } from './components/modals/ESP32ConnectModal';
import { NodeManageModal } from './components/modals/NodeManageModal';
import { LoginPage } from './components/auth/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { playEmergencySiren, stopEmergencySiren } from './utils/soundEngine';

import { 
  PageView, 
  SensorTelemetry, 
  SensorNode, 
  AlertItem, 
  HistoricalTrendPoint 
} from './types/telemetry';

import { 
  INITIAL_TELEMETRY, 
  INITIAL_CONFIDENCE,
  calculateEdgeRisks 
} from './services/dataSimulator';

import {
  getNodes,
  getAlerts,
  getAnalyticsOverview,
  getAnalyticsTrends,
  acknowledgeAlert,
  resolveAlert,
  createEmergencyAlert
} from './services/api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

function DashboardContent() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<PageView>('dashboard');
  const [telemetry, setTelemetry] = useState<SensorTelemetry>(INITIAL_TELEMETRY);
  const [nodes, setNodes] = useState<SensorNode[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalTrendPoint[]>([]);
  
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(true);
  const [useLiveEsp32, setUseLiveEsp32] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  
  const lastEsp32PacketTimeRef = useRef<number | null>(null);
  
  // Modals
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [activeEmergencyAlert, setActiveEmergencyAlert] = useState<AlertItem | null>(null);
  const [isESP32ModalOpen, setIsESP32ModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isNodeModalOpen, setIsNodeModalOpen] = useState<boolean>(false);
  const [nodeToEdit, setNodeToEdit] = useState<any | null>(null);
  const [selectedNode, setSelectedNode] = useState<SensorNode | null>(null);

  // Load all initial data from REST API backend
  const loadBackendData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [nodesRes, alertsRes, trendsRes] = await Promise.all([
        getNodes(),
        getAlerts(),
        getAnalyticsTrends()
      ]);

      if (nodesRes?.success && nodesRes.data) {
        const formattedNodes: SensorNode[] = nodesRes.data.map((n: any) => {
          const reading = n.latestReading || {};
          const risk = n.latestRisk || {};
          
          return {
            id: n.node_code || `NODE-${n.id}`,
            name: n.name,
            location: n.location_name,
            status: n.status || 'ONLINE',
            batteryLevel: n.battery_level || 100,
            primaryRiskScore: Math.round(risk.overall_risk || 20),
            riskLevel: (risk.overall_risk >= 81 ? 'CRITICAL' : risk.overall_risk >= 61 ? 'HIGH' : risk.overall_risk >= 31 ? 'MEDIUM' : 'LOW') as any,
            coordinates: [parseFloat(n.latitude) || 17.4, parseFloat(n.longitude) || 78.4],
            lastUpdated: n.last_seen ? new Date(n.last_seen).toLocaleTimeString() : 'Just now',
            telemetry: {
              temperature: reading.temperature ?? 34.0,
              humidity: reading.humidity ?? 65.0,
              waterLevel: reading.water_level ?? 45.0,
              rainfall: reading.rainfall ?? 12.0,
              waterRiseRate: 5.0,
              smoke: reading.smoke_level ?? 20.0,
              flameDetected: Boolean(reading.flame_detected),
              pm25: reading.pm25 ?? 45.0,
              pm10: reading.pm10 ?? 75.0,
              co2: 450,
              voc: 120,
              windSpeed: 15,
              gasLevel: reading.gas_level ?? 25.0
            }
          };
        });

        setNodes(formattedNodes);

        if (formattedNodes.length > 0 && formattedNodes[0].telemetry) {
          setTelemetry(formattedNodes[0].telemetry);
        }
      }

      if (alertsRes?.success && alertsRes.data) {
        const formattedAlerts: AlertItem[] = alertsRes.data.map((a: any) => ({
          id: `ALT-${a.id}`,
          severity: a.severity,
          hazard: a.hazard_type,
          title: a.title,
          nodeId: a.node ? a.node.node_code : `NODE-${a.node_id}`,
          location: a.node ? a.node.location_name : 'Monitoring Zone',
          details: a.message,
          riskScore: Math.round(a.risk_score),
          timestamp: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          acknowledged: a.status === 'ACKNOWLEDGED' || a.status === 'RESOLVED'
        }));
        setAlerts(formattedAlerts);
      }

      if (trendsRes?.success && trendsRes.data) {
        setHistoricalData(trendsRes.data);
      }

      setIsBackendConnected(true);
    } catch (err) {
      console.warn('[Backend Warning] Failed to reach backend API. Using local cache/state.');
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBackendData();
  }, [loadBackendData]);

  // Connect Socket.IO for real-time streaming updates
  useEffect(() => {
    let socket: Socket | null = null;
    try {
      socket = socketIO(SOCKET_URL, {
        transports: ['polling', 'websocket'],
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 10000
      });

      socket.on('connect', () => {
        console.log('[Socket.IO] Connected to environmental backend stream.');
        setIsBackendConnected(true);
      });

      socket.on('disconnect', (reason) => {
        console.warn('[Socket.IO] Disconnected from backend stream:', reason);
        setIsBackendConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.error('[Socket.IO] Connection error:', error.message);
      });

      socket.io.on('reconnect_attempt', (attempt) => {
        console.log('[Socket.IO] Reconnect attempt #', attempt);
      });

      socket.io.on('reconnect', (attempt) => {
        console.log('[Socket.IO] Successfully reconnected after', attempt, 'attempts');
        setIsBackendConnected(true);
      });

      socket.io.on('reconnect_error', (error) => {
        console.error('[Socket.IO] Reconnect error:', error.message);
      });

      // Dedicated ESP32 Real-Time Sensor Data Listener
      socket.on('sensorData', (data: any) => {
        if (!data) return;
        console.log('[Socket.IO] Sensor data received:', data);
        lastEsp32PacketTimeRef.current = Date.now();

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const pm25Val = data.pm25 !== undefined ? data.pm25 : null;
        const pm10Val = data.pm10 !== undefined ? data.pm10 : null;

        const updatedTelemetry: SensorTelemetry = {
          water: data.water !== undefined ? data.water : null,
          rain: data.rain !== undefined ? data.rain : null,
          smoke: data.smoke !== undefined ? data.smoke : null,
          temperature: data.temperature !== undefined ? data.temperature : null,
          humidity: data.humidity !== undefined ? data.humidity : null,
          pm25: pm25Val,
          pm10: pm10Val,
          waterLevel: data.water !== undefined && data.water !== null ? data.water : 0,
          rainfall: data.rain !== undefined && data.rain !== null ? data.rain : 0,
          waterRiseRate: 0,
          flameDetected: Boolean(data.fire),
          flood: Boolean(data.flood),
          fire: Boolean(data.fire),
          airAlert: typeof data.airAlert === 'boolean' ? data.airAlert : (pm25Val !== null && pm25Val > 35),
          timestamp: data.timestamp || new Date().toISOString(),
          deviceStatus: 'ONLINE',
          lastUpdatedText: timeStr
        };

        setTelemetry(updatedTelemetry);
        setUseLiveEsp32(true);

        // Update node 0 or NODE-001 in node list
        setNodes((prevNodes) => {
          if (prevNodes.length === 0) return prevNodes;
          return prevNodes.map((n, idx) => {
            if (idx === 0 || n.id === 'NODE-001') {
              return {
                ...n,
                status: 'ONLINE',
                lastUpdated: 'Just now',
                telemetry: updatedTelemetry
              };
            }
            return n;
          });
        });
      });

      socket.on('telemetry_update', (data: any) => {
        if (!data || !data.node || !data.reading) return;

        const updatedNodeCode = data.node.node_code;
        const newReading = data.reading;
        const newRisk = data.risk || {};

        setNodes((prevNodes) =>
          prevNodes.map((n) => {
            if (n.id === updatedNodeCode || n.name === data.node.name) {
              const updatedTelemetry: SensorTelemetry = {
                ...n.telemetry,
                temperature: newReading.temperature ?? n.telemetry.temperature,
                humidity: newReading.humidity ?? n.telemetry.humidity,
                waterLevel: newReading.water_level ?? n.telemetry.waterLevel,
                rainfall: newReading.rainfall ?? n.telemetry.rainfall,
                smoke: newReading.smoke_level ?? n.telemetry.smoke,
                flameDetected: newReading.flame_detected !== undefined ? Boolean(newReading.flame_detected) : n.telemetry.flameDetected,
                pm25: newReading.pm25 ?? n.telemetry.pm25,
                pm10: newReading.pm10 ?? n.telemetry.pm10,
                gasLevel: newReading.gas_level ?? n.telemetry.gasLevel
              };

              return {
                ...n,
                primaryRiskScore: Math.round(newRisk.overall_risk || n.primaryRiskScore),
                riskLevel: (newRisk.overall_risk >= 81 ? 'CRITICAL' : newRisk.overall_risk >= 61 ? 'HIGH' : newRisk.overall_risk >= 31 ? 'MEDIUM' : 'LOW') as any,
                telemetry: updatedTelemetry,
                lastUpdated: 'Just now'
              };
            }
            return n;
          })
        );

        if (!updatedNodeCode || updatedNodeCode === 'NODE-001') {
          setTelemetry((prev) => ({
            ...prev,
            temperature: newReading.temperature ?? prev.temperature,
            humidity: newReading.humidity ?? prev.humidity,
            waterLevel: newReading.water_level ?? prev.waterLevel,
            rainfall: newReading.rainfall ?? prev.rainfall,
            smoke: newReading.smoke_level ?? prev.smoke,
            flameDetected: newReading.flame_detected !== undefined ? Boolean(newReading.flame_detected) : prev.flameDetected,
            pm25: newReading.pm25 ?? prev.pm25,
            pm10: newReading.pm10 ?? prev.pm10,
            gasLevel: newReading.gas_level ?? prev.gasLevel
          }));
        }
      });

      socket.on('new_alert', (data: any) => {
        if (!data || !data.alert) return;
        const a = data.alert;
        const newAlertItem: AlertItem = {
          id: `ALT-${a.id}`,
          severity: a.severity,
          hazard: a.hazard_type,
          title: a.title,
          nodeId: data.node ? data.node.node_code : `NODE-${a.node_id}`,
          location: data.node ? data.node.location_name : 'Monitoring Zone',
          details: a.message,
          riskScore: Math.round(a.risk_score),
          timestamp: 'Just now',
          acknowledged: false
        };

        setAlerts((prev) => [newAlertItem, ...prev.filter((item) => item.id !== newAlertItem.id)]);
      });

      const handleEmergencyBroadcast = (data: any) => {
        if (!data) return;

        const emergencyItem: AlertItem = {
          id: `ALT-${data.alert ? data.alert.id : Math.floor(Math.random() * 9000 + 1000)}`,
          severity: (data.severity || 'CRITICAL') as any,
          hazard: (data.hazard || 'GENERAL') as any,
          title: data.title || '🚨 EMERGENCY ALERT',
          nodeId: 'NODE-001',
          location: 'Control Center Broadcast',
          details: data.message || 'Emergency situation detected. Please take immediate action.',
          riskScore: 98,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          acknowledged: false
        };

        setAlerts((prev) => [emergencyItem, ...prev.filter((item) => item.id !== emergencyItem.id)]);

        // Display Viewer Emergency Alert Modal and Play compulsory Siren Sound
        setActiveEmergencyAlert(emergencyItem);
        playEmergencySiren();
      };

      // Dedicated Admin Emergency Alert Broadcast Listeners
      socket.on('emergency-alert', handleEmergencyBroadcast);
      socket.on('emergency_alert', handleEmergencyBroadcast);

      socket.on('alert_updated', (data: any) => {
        if (!data || !data.alert) return;
        const updated = data.alert;
        setAlerts((prev) =>
          prev.map((a) =>
            a.id === `ALT-${updated.id}`
              ? { ...a, acknowledged: updated.status === 'ACKNOWLEDGED' || updated.status === 'RESOLVED' }
              : a
          )
        );
      });

    } catch (err) {
      console.warn('[Socket.IO Setup Error]', err);
    }

    return () => {
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
    };
  }, []);

  // Periodic REST refresh interval (every 8 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      loadBackendData();
    }, 8000);
    return () => clearInterval(interval);
  }, [loadBackendData]);

  // 10-Second Watchdog Timer for ESP32 Offline Detection
  useEffect(() => {
    const watchdogInterval = setInterval(() => {
      if (lastEsp32PacketTimeRef.current) {
        const elapsedMs = Date.now() - lastEsp32PacketTimeRef.current;
        if (elapsedMs > 10000) {
          setTelemetry((prev) => {
            if (prev.deviceStatus === 'OFFLINE') return prev;
            return {
              ...prev,
              deviceStatus: 'OFFLINE',
              lastUpdatedText: prev.lastUpdatedText ? `${prev.lastUpdatedText} (OFFLINE)` : 'Stale (>10s)'
            };
          });

          setNodes((prevNodes) =>
            prevNodes.map((n, idx) => {
              if (idx === 0 || n.id === 'NODE-001') {
                return { ...n, status: 'OFFLINE' };
              }
              return n;
            })
          );
        }
      }
    }, 1000);

    return () => clearInterval(watchdogInterval);
  }, []);

  // Compute edge risks dynamically
  const risks = calculateEdgeRisks(telemetry);

  const handleAcknowledgeAlert = async (id: string) => {
    stopEmergencySiren();
    const numericId = id.replace('ALT-', '');
    try {
      await acknowledgeAlert(numericId);
    } catch (err) {
      console.warn('[Alert Error] Failed to acknowledge alert on backend');
    }
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleSelectNodeById = (nodeId: string) => {
    const found = nodes.find((n) => n.id === nodeId || n.name.includes(nodeId));
    if (found) {
      setSelectedNode(found);
    }
  };

  const handleTriggerEmergencyAlert = async (hazard: string, severity: string, message?: string, title?: string) => {
    const payload = {
      node_id: 1,
      hazard_type: hazard || 'GENERAL',
      severity: severity || 'CRITICAL',
      title: title || `EMERGENCY ALERT: ${hazard} Sector Warning`,
      message: message || `Emergency situation detected. Please take immediate action.`,
      risk_score: 98,
      confidence: 98
    };

    try {
      await createEmergencyAlert(payload);
    } catch (err) {
      console.warn('[Emergency Alert Error] Could not post to backend API, generating locally.');
    }
  };

  const onlineNodesCount = nodes.filter((n) => n.status === 'ONLINE').length;
  const criticalAlertsCount = alerts.filter((a) => a.severity === 'CRITICAL' && !a.acknowledged).length;
  const warningAlertsCount = alerts.filter((a) => (a.severity === 'HIGH' || a.severity === 'WARNING') && !a.acknowledged).length;

  return (
    <div className="min-h-screen control-room-bg text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Header */}
      <Header
        onlineNodesCount={onlineNodesCount}
        totalNodesCount={nodes.length || 5}
        alerts={alerts}
        isSimulationActive={isSimulationActive}
        isBackendConnected={isBackendConnected}
        onToggleSimulation={() => setIsSimulationActive(!isSimulationActive)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenESP32Modal={() => setIsESP32ModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenAddNodeModal={() => {
          setNodeToEdit(null);
          setIsNodeModalOpen(true);
        }}
        useLiveEsp32={useLiveEsp32}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Left Sidebar */}
        <Sidebar
          activeView={activeView}
          onSelectView={setActiveView}
          unacknowledgedCount={alerts.filter((a) => !a.acknowledged).length}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-[1600px] mx-auto w-full">
          
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* 4 Summary KPI Cards */}
              <RiskOverviewCards
                risks={risks}
                activeAlertsCount={alerts.filter((a) => !a.acknowledged).length}
                criticalAlertsCount={criticalAlertsCount}
                warningAlertsCount={warningAlertsCount}
                onlineNodesCount={onlineNodesCount}
                totalNodesCount={nodes.length || 5}
              />

              {/* 3 Main Hazard Cards (Fire, Flood, Air Pollution) */}
              <HazardCards
                telemetry={telemetry}
                risks={risks}
                onSelectView={setActiveView}
              />

              {/* Edge AI Risk Assessment Section */}
              <AIAssessment
                risks={risks}
                confidence={INITIAL_CONFIDENCE}
              />

              {/* Live Environmental Sensors Grid */}
              <LiveSensorsGrid telemetry={telemetry} />

              {/* Real-time Environmental Risk Map */}
              <EnvironmentalMap
                nodes={nodes}
                onSelectNode={(node) => setSelectedNode(node)}
              />

              {/* Active Alerts Panel */}
              <AlertPanel
                alerts={alerts}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onSelectNodeById={handleSelectNodeById}
              />

              {/* Risk Line Trends & Donut Distribution Charts */}
              <RiskCharts
                historicalData={historicalData}
                risks={risks}
              />

              {/* System Architecture Indicator */}
              <SystemArchitecture />
            </div>
          )}

          {/* Module Sub-Views */}
          {activeView === 'fire' && <FireMonitoringView telemetry={telemetry} risks={risks} />}
          {activeView === 'flood' && <FloodMonitoringView telemetry={telemetry} risks={risks} />}
          {activeView === 'pollution' && <AirPollutionView telemetry={telemetry} risks={risks} />}
          {activeView === 'map' && <RiskMapView nodes={nodes} onSelectNode={setSelectedNode} />}
          {activeView === 'nodes' && (
            <SensorNodesView 
              nodes={nodes} 
              onSelectNode={setSelectedNode} 
            />
          )}
          {activeView === 'alerts' && <AlertsView alerts={alerts} onAcknowledgeAlert={handleAcknowledgeAlert} onSelectNodeById={handleSelectNodeById} />}
          {activeView === 'analytics' && <AnalyticsView risks={risks} historicalData={historicalData} />}
          {activeView === 'settings' && (
            <SystemSettingsView
              isSimulationActive={isSimulationActive}
              onToggleSimulation={() => setIsSimulationActive(!isSimulationActive)}
              onOpenESP32Modal={() => setIsESP32ModalOpen(true)}
            />
          )}

        </main>

      </div>

      {/* Modals */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onTriggerAlert={handleTriggerEmergencyAlert}
      />

      <EmergencyAlertModal
        alert={activeEmergencyAlert}
        onAcknowledge={handleAcknowledgeAlert}
        onClose={() => {
          stopEmergencySiren();
          setActiveEmergencyAlert(null);
        }}
      />

      <NodeDetailModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />

      <ESP32ConnectModal
        isOpen={isESP32ModalOpen}
        onClose={() => setIsESP32ModalOpen(false)}
        useLiveEsp32={useLiveEsp32}
        onToggleLiveEsp32={setUseLiveEsp32}
      />

      {isLoginModalOpen && (
        <LoginPage onClose={() => setIsLoginModalOpen(false)} />
      )}

      <NodeManageModal
        isOpen={isNodeModalOpen}
        nodeToEdit={nodeToEdit}
        onClose={() => setIsNodeModalOpen(false)}
        onSuccess={loadBackendData}
      />

    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}

export default App;
