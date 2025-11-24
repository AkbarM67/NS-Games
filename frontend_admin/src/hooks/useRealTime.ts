import { useEffect, useRef } from 'react';

interface UseRealTimeProps {
  onDashboardUpdate?: (data: any) => void;
  onActivityUpdate?: (data: any) => void;
  onUserUpdate?: (data: any) => void;
}

export const useRealTime = ({ onDashboardUpdate, onActivityUpdate, onUserUpdate }: UseRealTimeProps) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://127.0.0.1:6001');
    
    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.event === 'dashboard.updated' && onDashboardUpdate) {
          onDashboardUpdate(data.data);
        }
        
        if (data.event === 'activity.logged' && onActivityUpdate) {
          onActivityUpdate(data.data);
        }
        
        if (data.event === 'user.updated' && onUserUpdate) {
          onUserUpdate(data.data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [onDashboardUpdate, onActivityUpdate, onUserUpdate]);

  return wsRef.current;
};