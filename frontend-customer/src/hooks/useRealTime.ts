import { useEffect, useRef } from 'react';

interface UseRealTimeProps {
  onProductUpdate?: (data: any) => void;
  onOrderUpdate?: (data: any) => void;
  onProfileUpdate?: (data: any) => void;
  onBalanceUpdate?: (data: any) => void;
  onNotificationNew?: (data: any) => void;
}

export const useRealTime = ({ 
  onProductUpdate, 
  onOrderUpdate, 
  onProfileUpdate, 
  onBalanceUpdate,
  onNotificationNew
}: UseRealTimeProps) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    wsRef.current = new WebSocket('ws://127.0.0.1:6001');
    
    wsRef.current.onopen = () => {
      console.log('Customer WebSocket connected');
    };
    
    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle different event types
        if (data.event === 'product.updated' && onProductUpdate) {
          onProductUpdate(data.data);
        }
        
        if (data.event === 'order.updated' && onOrderUpdate) {
          onOrderUpdate(data.data);
        }
        
        if (data.event === 'profile.updated' && onProfileUpdate) {
          onProfileUpdate(data.data);
        }
        
        if (data.event === 'balance.updated' && onBalanceUpdate) {
          onBalanceUpdate(data.data);
        }
        
        if (data.event === 'notification.new' && onNotificationNew) {
          onNotificationNew(data.data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = () => {
      console.log('Customer WebSocket disconnected');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [onProductUpdate, onOrderUpdate, onProfileUpdate, onBalanceUpdate, onNotificationNew]);

  return wsRef.current;
};