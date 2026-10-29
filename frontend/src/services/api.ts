import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token to outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// API Functions

// Auth
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData: { name: string; email: string; password: string; role?: string }) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Nodes
export const getNodes = async () => {
  const response = await api.get('/nodes');
  return response.data;
};

export const getNodeById = async (id: number | string) => {
  const response = await api.get(`/nodes/${id}`);
  return response.data;
};

export const createNode = async (nodeData: any) => {
  const response = await api.post('/nodes', nodeData);
  return response.data;
};

export const updateNode = async (id: number | string, nodeData: any) => {
  const response = await api.put(`/nodes/${id}`, nodeData);
  return response.data;
};

export const deleteNode = async (id: number | string) => {
  const response = await api.delete(`/nodes/${id}`);
  return response.data;
};

// Readings
export const getLatestReadings = async () => {
  const response = await api.get('/readings/latest');
  return response.data;
};

export const postReading = async (readingData: any) => {
  const response = await api.post('/readings', readingData);
  return response.data;
};

// Risks
export const getCurrentRisks = async () => {
  const response = await api.get('/risks/current');
  return response.data;
};

export const postRiskAssessment = async (riskData: any) => {
  const response = await api.post('/risks', riskData);
  return response.data;
};

// Alerts
export const getAlerts = async (params?: any) => {
  const response = await api.get('/alerts', { params });
  return response.data;
};

export const getActiveAlerts = async () => {
  const response = await api.get('/alerts/active');
  return response.data;
};

export const acknowledgeAlert = async (id: number | string) => {
  const response = await api.put(`/alerts/${id}/acknowledge`);
  return response.data;
};

export const resolveAlert = async (id: number | string) => {
  const response = await api.put(`/alerts/${id}/resolve`);
  return response.data;
};

export const deleteAlert = async (id: number | string) => {
  const response = await api.delete(`/alerts/${id}`);
  return response.data;
};

export const createEmergencyAlert = async (alertData: any) => {
  const response = await api.post('/alerts', alertData);
  return response.data;
};

// Analytics
export const getAnalyticsOverview = async () => {
  const response = await api.get('/analytics/overview');
  return response.data;
};

export const getAnalyticsTrends = async () => {
  const response = await api.get('/analytics/trends');
  return response.data;
};

export const getHazardDistribution = async () => {
  const response = await api.get('/analytics/hazard-distribution');
  return response.data;
};

export const getNodeStatus = async () => {
  const response = await api.get('/analytics/node-status');
  return response.data;
};
