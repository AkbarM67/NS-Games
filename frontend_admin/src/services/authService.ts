import api from '../lib/api';

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/api/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/api/logout');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/api/user');
    return response.data;
  }
};