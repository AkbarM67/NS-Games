import { useState, useEffect } from "react";
import { UserHeader } from "./components/user/UserHeader";
import { UserHomepage } from "./components/user/UserHomepage";
import { ProductCatalog } from "./components/user/ProductCatalog";
import { OrderPage } from "./components/user/OrderPage";
import { TransactionHistory } from "./components/user/TransactionHistory";
import { UserProfile } from "./components/user/UserProfile";
import { RealTimeIndicator } from "./components/RealTimeIndicator";
import { useAutoLogout } from "./hooks/useAutoLogout";


export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Auto logout after 2 hours of inactivity
  useAutoLogout();

  useEffect(() => {
    console.log('Frontend-Customer: Starting auth check...');
    
    // Check for token in URL parameters
    // Handle HTML entities in URL
    const urlString = window.location.search.replace(/&amp;/g, '&');
    const urlParams = new URLSearchParams(urlString);
    const tokenFromUrl = urlParams.get('token');
    const userFromUrl = urlParams.get('user');
    
    console.log('Frontend-Customer: Token from URL:', tokenFromUrl ? 'Present' : 'Not found');
    console.log('Frontend-Customer: User from URL:', userFromUrl ? 'Present' : 'Not found');
    
    if (tokenFromUrl && userFromUrl) {
      try {
        const userData = JSON.parse(decodeURIComponent(userFromUrl));
        console.log('Frontend-Customer: Received user data:', userData);
        console.log('Frontend-Customer: User role:', userData.role);
        
        // Temporarily disable role validation for debugging
        console.log('Frontend-Customer: Allowing access regardless of role for debugging');
        console.log('Frontend-Customer: User role is:', userData.role);
        
        setToken(tokenFromUrl);
        setUser(userData);
        setIsLoggedIn(true);
        
        // Store in localStorage
        localStorage.setItem('token', tokenFromUrl);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        console.log('Frontend-Customer: Login successful from URL params');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      console.log('Frontend-Customer: No URL params, checking localStorage...');
      // Check localStorage
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('Frontend-Customer: Stored user data:', userData);
          console.log('Frontend-Customer: Stored user role:', userData.role);
          
          // Temporarily disable role validation for debugging
          console.log('Frontend-Customer: Allowing stored user access regardless of role for debugging');
          console.log('Frontend-Customer: Stored user role is:', userData.role);
          
          setToken(storedToken);
          setUser(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        console.log('Frontend-Customer: No stored auth data found');
      }
    }
    
    setLoading(false);
    console.log('Frontend-Customer: Auth check completed');
  }, []);

  const handleLogout = () => {
    // Clear local state
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setActivePage('home');
    
    // Redirect to Laravel login page
    window.location.href = 'http://127.0.0.1:8000/login';
  };

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <UserHomepage setActivePage={setActivePage} />;
      case "catalog":
        return <ProductCatalog setActivePage={setActivePage} />;
      case "order":
        return <OrderPage />;
      case "history":
        return <TransactionHistory />;
      case "profile":
        return <UserProfile />;
      default:
        return <UserHomepage setActivePage={setActivePage} />;
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to Laravel login if not authenticated
  if (!isLoggedIn) {
    console.log('Frontend-Customer: Not logged in, redirecting to login...');
    window.location.href = 'http://127.0.0.1:8000/login';
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader 
        activePage={activePage} 
        setActivePage={setActivePage}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="pb-8">
        {renderPage()}
      </main>
      
      {/* Real-time Connection Indicator */}
      <RealTimeIndicator />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="mb-4">NS Games Store</h3>
              <p className="text-sm text-gray-400">
                Platform topup game, pulsa, dan e-wallet terpercaya dan termurah di Indonesia.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Mobile Legends</li>
                <li>Free Fire</li>
                <li>PUBG Mobile</li>
                <li>Pulsa & Data</li>
                <li>E-Wallet</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Bantuan</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Cara Order</li>
                <li>FAQ</li>
                <li>Syarat & Ketentuan</li>
                <li>Kebijakan Privasi</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Hubungi Kami</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>WhatsApp: 0812-3456-7890</li>
                <li>Email: cs@topupstore.com</li>
                <li>Instagram: @topupstore</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 NS Games Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
