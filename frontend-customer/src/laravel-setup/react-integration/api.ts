// src/lib/api.ts - React API Client

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for Laravel Sanctum
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or clear token
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    const response = await api.post('/register', data);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    await api.post('/logout');
    localStorage.removeItem('auth_token');
  },

  getUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (params?: {
    category?: string;
    search?: string;
    page?: number;
  }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getPopular: async () => {
    const response = await api.get('/products/popular');
    return response.data;
  },

  getByCategory: async (category: string) => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },
};

// Transactions API
export const transactionsAPI = {
  getAll: async (params?: {
    status?: string;
    search?: string;
    page?: number;
  }) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: {
    product_id: number;
    target_account: string;
    server_id?: string;
    payment_method: string;
    promo_code?: string;
  }) => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/transactions/statistics');
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data: {
    name?: string;
    email?: string;
    phone?: string;
  }) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  topup: async (data: {
    amount: number;
    payment_method: string;
  }) => {
    const response = await api.post('/user/topup', data);
    return response.data;
  },

  getBalance: async () => {
    const response = await api.get('/user/balance');
    return response.data;
  },

  getReferral: async () => {
    const response = await api.get('/user/referral');
    return response.data;
  },
};

// Promos API
export const promosAPI = {
  getAll: async () => {
    const response = await api.get('/promos');
    return response.data;
  },

  getActive: async () => {
    const response = await api.get('/promos/active');
    return response.data;
  },

  validate: async (code: string) => {
    const response = await api.post('/promos/validate', { code });
    return response.data;
  },
};

export default api;
