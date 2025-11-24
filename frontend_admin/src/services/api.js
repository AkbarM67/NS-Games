import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getUser: () => api.get('/user'),
};

export const gamesAPI = {
  getAll: () => api.get('/games'),
  getProducts: (gameId) => api.get(`/games/${gameId}/products`),
};

export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: () => api.get('/orders'),
};

export const dashboardAPI = {
  getData: () => api.get('/dashboard'),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getOrders: () => api.get('/admin/orders'),
};

export const digiflazzAPI = {
  testConnection: () => api.post('/digiflazz/test'),
  getBalance: () => api.get('/digiflazz/balance'),
  getPriceList: () => api.get('/digiflazz/price-list'),
};

export default api;