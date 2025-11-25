import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useRealTime } from './useRealTime';

export const useUser = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar_url: '',
    level: 'bronze'
  });
  const [loading, setLoading] = useState(true);

  useRealTime({
    onProfileUpdate: (data) => {
      setUser(prev => ({ ...prev, ...data }));
    }
  });

  const fetchUser = async () => {
    try {
      const response = await api.get('/user/profile');
      console.log('useUser API response:', response.data);
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      console.log('Backend tidak tersedia, data kosong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchUser, 300000);
    return () => clearInterval(interval);
  }, []);

  return { user, loading, refetch: fetchUser };
};