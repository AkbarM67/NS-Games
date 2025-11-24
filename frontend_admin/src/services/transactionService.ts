import api from '../lib/api';

export const transactionService = {
  getTransactions: async () => {
    const response = await api.get('/api/transactions');
    return response.data;
  },
  
  createTransaction: async (data: any) => {
    const response = await api.post('/api/transactions', data);
    return response.data;
  },
  
  updateTransaction: async (id: string, data: any) => {
    const response = await api.put(`/api/transactions/${id}`, data);
    return response.data;
  }
};