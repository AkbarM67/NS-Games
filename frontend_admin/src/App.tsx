import { useState, useEffect } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { DashboardOverview } from "./components/DashboardOverview";
import { TransactionManagement } from "./components/TransactionManagement";
import { ProductManagement } from "./components/ProductManagement";
import { UserManagement } from "./components/UserManagement";
import { FinancialReports } from "./components/FinancialReports";
import { MarketingPromo } from "./components/MarketingPromo";
import { SettingsPage } from "./components/SettingsPage";
import { AdminProfile } from "./components/AdminProfile";
import { AnnouncementManagement } from "./components/AnnouncementManagement";
import { BalanceTopups } from "./components/BalanceTopups";
import { useAutoLogout } from "./hooks/useAutoLogout";
import { Toaster } from "sonner";

const LOGIN_URL = 'http://127.0.0.1:8000/login';

export default function App() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [headerRefreshTrigger, setHeaderRefreshTrigger] = useState(0);
  
  // Auto logout after 2 hours of inactivity
  useAutoLogout();

  useEffect(() => {
    // Check URL parameters for token
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const userFromUrl = urlParams.get('user');
    
    if (tokenFromUrl && userFromUrl) {
      try {
        const userData = JSON.parse(decodeURIComponent(userFromUrl));
        
        // Validate user role - only admin can access admin panel
        if (userData.role !== 'admin') {
          alert('Access denied. Admin privileges required.');
          window.location.href = LOGIN_URL;
          return;
        }
        
        localStorage.setItem('token', tokenFromUrl);
        localStorage.setItem('user', userFromUrl);
        setUser(userData);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Error parsing user data:', error);
        window.location.href = LOGIN_URL;
      }
    } else {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          
          // Validate stored user role
          if (user.role !== 'admin') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert('Access denied. Admin privileges required.');
            window.location.href = LOGIN_URL;
            return;
          }
          
          setUser(user);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = LOGIN_URL;
        }
      } else {
        // Redirect to login if no auth
        window.location.href = LOGIN_URL;
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = LOGIN_URL;
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardOverview />;
      case "transactions":
        return <TransactionManagement />;
      case "products":
        return <ProductManagement />;
      case "users":
        return <UserManagement />;
      case "reports":
        return <FinancialReports />;
      case "marketing":
        return <MarketingPromo />;
      case "announcements":
        return <AnnouncementManagement />;
      case "balance-topups":
        return <BalanceTopups />;
      case "settings":
        return <SettingsPage />;
      case "profile":
        return <AdminProfile onProfileUpdate={() => setHeaderRefreshTrigger(prev => prev + 1)} />;
      default:
        return <DashboardOverview />;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex-1 flex flex-col">
        <Header user={user} onLogout={handleLogout} onNavigate={setActiveMenu} refreshTrigger={headerRefreshTrigger} />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
