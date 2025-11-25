import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useRealTime } from './useRealTime';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useRealTime({
    onOrderUpdate: (data) => {
      // Add new notification for order updates
      const newNotification = {
        id: Date.now(),
        title: 'Order Update',
        message: `Order ${data.orderId} status: ${data.status}`,
        type: 'order',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    },
    onNotificationNew: (data) => {
      // Handle new announcement notifications
      fetchNotifications(); // Refresh notifications from server
    }
  });

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/user/notifications');
      if (response.data.success) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.data.filter((n: any) => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return { notifications, unreadCount, loading, refetch: fetchNotifications };
};