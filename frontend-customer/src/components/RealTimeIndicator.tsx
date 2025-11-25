import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export function RealTimeIndicator() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // Check WebSocket connection status
    const checkConnection = () => {
      try {
        const ws = new WebSocket('ws://127.0.0.1:6001');
        
        ws.onopen = () => {
          setIsConnected(true);
          setLastUpdate(new Date());
          ws.close();
        };
        
        ws.onerror = () => {
          setIsConnected(false);
        };
        
        ws.onclose = () => {
          if (!isConnected) {
            setIsConnected(false);
          }
        };
      } catch (error) {
        setIsConnected(false);
      }
    };

    // Check connection immediately
    checkConnection();
    
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, [isConnected]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${
        isConnected 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {isConnected ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>Real-time</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Offline</span>
          </>
        )}
      </div>
      
      {lastUpdate && (
        <div className="text-xs text-gray-500 text-center mt-1">
          Last: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}