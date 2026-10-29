import React, { useState } from 'react';
import { Cpu, X, Copy, Check, Code2, Server, Terminal, Radio } from 'lucide-react';

interface ESP32ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  useLiveEsp32: boolean;
  onToggleLiveEsp32: (enabled: boolean) => void;
}

export const ESP32ConnectModal: React.FC<ESP32ConnectModalProps> = ({
  isOpen,
  onClose,
  useLiveEsp32,
  onToggleLiveEsp32
}) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'cpp' | 'config'>('schema');
  const [copied, setCopied] = useState<boolean>(false);
  const [endpointUrl, setEndpointUrl] = useState<string>('http://192.168.1.100:5000/api/sensor-data');

  if (!isOpen) return null;

  const jsonSchema = `{
  "water": 1234,
  "rain": 567,
  "smoke": 890,
  "temperature": 28.4,
  "humidity": 65.2,
  "pm25": null,
  "pm10": null,
  "flood": false,
  "fire": false,
  "airAlert": false,
  "timestamp": "2026-10-01T12:00:00"
}`;

  const esp32CppCode = `/* 
 * ESP32 Environmental / Disaster Monitoring System
 * Sends Live Sensor Data over Wi-Fi HTTP POST to Website Backend
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// Wi-Fi Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Server URL - Replace with computer's LAN IP address & port 5000
const char* serverURL = "${endpointUrl}";

// Sensor Pin Definitions
#define DHTPIN 4
#define DHTTYPE DHT11
#define WATER_PIN 34
#define RAIN_PIN 35
#define SMOKE_PIN 32

// Output Pin Definitions
#define BLUE_LED 25
#define RED_LED 27
#define GREEN_LED 13

#define FLOOD_BUZZER 2
#define FIRE_BUZZER 21
#define AIR_BUZZER 22

// Thresholds
const int waterThreshold = 2000;
const int rainThreshold = 1500;
const int smokeThreshold = 1800;

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  
  // Pin modes
  pinMode(BLUE_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  
  pinMode(FLOOD_BUZZER, OUTPUT);
  pinMode(FIRE_BUZZER, OUTPUT);
  pinMode(AIR_BUZZER, OUTPUT);
  
  dht.begin();

  // Connect Wi-Fi
  Serial.println("WiFi connecting...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Read Sensors
  int water = analogRead(WATER_PIN);
  int rain = analogRead(RAIN_PIN);
  int smoke = analogRead(SMOKE_PIN);
  
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  if (isnan(temp)) temp = 0.0;
  if (isnan(hum)) hum = 0.0;

  // Determine Hazard Conditions
  bool flood = (water > waterThreshold) || (rain > rainThreshold);
  bool fire = (smoke > smokeThreshold);

  // Output Alerts
  digitalWrite(RED_LED, (flood || fire) ? HIGH : LOW);
  digitalWrite(GREEN_LED, (!flood && !fire) ? HIGH : LOW);
  digitalWrite(BLUE_LED, flood ? HIGH : LOW);
  
  digitalWrite(FLOOD_BUZZER, flood ? HIGH : LOW);
  digitalWrite(FIRE_BUZZER, fire ? HIGH : LOW);

  // Send Data via HTTP POST
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<350> doc;
    doc["water"] = water;
    doc["rain"] = rain;
    doc["smoke"] = smoke;
    doc["temperature"] = temp;
    doc["humidity"] = hum;
    doc["pm25"] = nullptr; // null when PM sensor offline
    doc["pm10"] = nullptr; // null when PM sensor offline
    doc["flood"] = flood;
    doc["fire"] = fire;
    doc["airAlert"] = false;
    doc["timestamp"] = "2026-10-01T12:00:00";

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    Serial.println("\\nSending sensor data...");
    int httpCode = http.POST(jsonPayload);
    
    Serial.print("HTTP Response: ");
    Serial.println(httpCode);
    
    Serial.print("Water: "); Serial.println(water);
    Serial.print("Rain: "); Serial.println(rain);
    Serial.print("Smoke: "); Serial.println(smoke);
    Serial.print("Temperature: "); Serial.println(temp);
    Serial.print("Humidity: "); Serial.println(hum);

    http.end();
  } else {
    Serial.println("WiFi Disconnected!");
  }

  delay(2500); // Send data every 2.5 seconds
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-cyan-500/50 bg-slate-900/95 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                ESP32 HARDWARE INTEGRATION
              </h3>
              <p className="text-xs text-cyan-300">
                Connect DHT22, Water Level, Smoke & PM2.5 sensors
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-2 rounded-t-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'schema' ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>JSON Payload Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('cpp')}
            className={`px-3 py-2 rounded-t-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'cpp' ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>ESP32 Arduino Code</span>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-2 rounded-t-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'config' ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Backend API Endpoint</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          
          {activeTab === 'schema' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-300 font-semibold">
                  Required REST POST Payload Structure:
                </span>
                <button
                  onClick={() => copyToClipboard(jsonSchema)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 font-mono"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy Schema'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                {jsonSchema}
              </pre>
            </div>
          )}

          {activeTab === 'cpp' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-300 font-semibold">
                  Ready-to-Flash ESP32 C++ Sketch:
                </span>
                <button
                  onClick={() => copyToClipboard(esp32CppCode)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 font-mono"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy Sketch'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 max-h-64 overflow-y-auto">
                {esp32CppCode}
              </pre>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Target REST API Endpoint URL:
                </label>
                <input
                  type="text"
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-cyan-300">Live Hardware Ingestion Mode</h4>
                  <p className="text-[11px] text-slate-400">Switch from internal simulator to real ESP32 HTTP POST stream</p>
                </div>
                <button
                  onClick={() => onToggleLiveEsp32(!useLiveEsp32)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    useLiveEsp32 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {useLiveEsp32 ? 'ESP32 Live Mode ACTIVE' : 'Simulator Mode Active'}
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
