'use client';

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { currentPassword, newPassword })
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data)
};

// Analysis API
export const analysisAPI = {
  analyze: (data) => api.post('/analysis/analyze', data),
  getHistory: (params) => api.get('/analysis/history', { params }),
  getAnalysis: (id) => api.get(`/analysis/${id}`),
  deleteAnalysis: (id) => api.delete(`/analysis/${id}`)
};

// Health API
export const healthAPI = {
  getScore: () => api.get('/health/score'),
  getTrends: (period) => api.get('/health/trends', { params: { period } }),
  getStats: () => api.get('/health/stats'),
  getRealtimeScore: () => api.get('/health/realtime-score'),
  getJudgeDashboard: () => api.get('/health/judge-dashboard')
};

// Chat API (Grok AI)
export const chatAPI = {
  sendMessage: (message, language = 'en', context = null) => 
    api.post('/chat', { message, language, context }),
  getHealthTips: (language = 'en') => 
    api.get('/health-tips', { params: { language } })
};

export default api;
