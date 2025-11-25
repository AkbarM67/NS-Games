import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useRealTime } from './useRealTime';

export const useBalance = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useRealTime({
    onBalanceUpdate: (data) => {
      setBalance(data.balance);
    }
  });

  const fetchBalance = async () => {
    try {
      const response = await api.get('/user/balance');
      if (response.data.success) {
        setBalance(response.data.data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchBalance, 60000);
    return () => clearInterval(interval);
  }, []);

  return { balance, loading, refetch: fetchBalance };
};