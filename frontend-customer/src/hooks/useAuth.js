import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlString = window.location.search.replace(/&amp;/g, '&');
    const urlParams = new URLSearchParams(urlString);
    const tokenFromUrl = urlParams.get('token');
    const userFromUrl = urlParams.get('user');
    
    if (tokenFromUrl && userFromUrl) {
      try {
        const userData = JSON.parse(decodeURIComponent(userFromUrl));
        
        setToken(tokenFromUrl);
        setUser(userData);
        setIsLoggedIn(true);
        
        localStorage.setItem('token', tokenFromUrl);
        localStorage.setItem('user', JSON.stringify(userData));
        
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
    
    setLoading(false);
  }, []);

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'http://localhost/NS-topupgames/ns-topup/public/login';
  };

  return { isLoggedIn, user, token, loading, logout };
};