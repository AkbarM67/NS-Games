import { useEffect, useRef, useCallback } from 'react';

const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before logout
const LOGIN_URL = 'http://127.0.0.1:8000/login';

export function useAutoLogout() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = LOGIN_URL;
  }, []);

  const showWarning = useCallback(() => {
    const remainingTime = Math.ceil(WARNING_TIME / 1000 / 60); // minutes
    const shouldLogout = confirm(
      `Sesi Anda akan berakhir dalam ${remainingTime} menit karena tidak ada aktivitas.\n\nKlik OK untuk tetap login, atau Cancel untuk logout sekarang.`
    );
    
    if (!shouldLogout) {
      logout();
    } else {
      // Reset timer if user chooses to stay
      resetTimer();
    }
  }, [logout]);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Set warning timer (5 minutes before logout)
    warningTimeoutRef.current = setTimeout(() => {
      showWarning();
    }, INACTIVITY_TIMEOUT - WARNING_TIME);

    // Set logout timer (2 hours)
    timeoutRef.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT);
  }, [showWarning, logout]);

  const handleActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    
    // Only reset if it's been more than 1 minute since last reset
    if (timeSinceLastActivity > 60000) {
      resetTimer();
    }
  }, [resetTimer]);

  useEffect(() => {
    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start the timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [handleActivity, resetTimer]);

  return { resetTimer };
}