import { ShoppingCart, User, Menu, X, Wallet, Clock, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge, Button } from "../SimpleUI";

interface UserHeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isLoggedIn: boolean;
  user?: any;
  onLogout?: () => void;
  onRefreshProfile?: () => void;
}

export function UserHeader({ activePage, setActivePage, isLoggedIn, user, onLogout, onRefreshProfile }: UserHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    fetch('http://localhost/NS-topupgames/ns-topup/public/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.logo) {
          setLogo(data.data.logo);
        } else if (data.general && data.general.logo) {
          setLogo(data.general.logo);
        }
      })
      .catch(error => {
        console.error('Error fetching settings:', error);
      });

    if (isLoggedIn && user) {
      const token = localStorage.getItem('token');
      if (token) {
        fetch('http://localhost:8000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setBalance(data.data.balance || 0);
            setUserName(data.data.name || "");
          }
        })
        .catch(error => {
          console.error('Error fetching balance:', error);
        });
      }
    }
  }, [isLoggedIn, user]);

  // Expose refresh function to parent
  useEffect(() => {
    if (onRefreshProfile) {
      window.refreshUserProfile = fetchUserProfile;
    }
  }, [onRefreshProfile]);

  const fetchUserProfile = () => {
    if (isLoggedIn && user) {
      const token = localStorage.getItem('token');
      if (token) {
        fetch('http://localhost:8000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setBalance(data.data.balance || 0);
            setUserName(data.data.name || "");
          }
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
        });
      }
    }
  };

  const menuItems = [
    { id: "home", label: "Beranda" },
    { id: "catalog", label: "Produk" },
    { id: "history", label: "Pesanan" },
    { id: "profile", label: "Profil" },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActivePage("home")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border">
              {logo ? (
                <img 
                  src={`http://localhost/NS-topupgames/ns-topup/public${logo}`} 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                  onError={() => setLogo(null)}
                />
              ) : (
                <Wallet className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <h1 className="font-bold text-lg">NS Games Store</h1>
              <p className="text-xs text-gray-500">Cepat, Murah, Terpercaya</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`transition-colors ${
                  activePage === item.id
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Saldo */}
                <div className="hidden md:block bg-blue-50 px-4 py-2 rounded-lg">
                  <p className="text-xs text-gray-600">Saldo</p>
                  <p className="text-sm">Rp {balance.toLocaleString()}</p>
                </div>

                {/* Profile */}
                <div className="relative">
                  <button 
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                      {(userName || user?.name)?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:block text-sm">{userName || user?.name || 'User'}</span>
                  </button>
                  
                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setActivePage("profile");
                            setProfileDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Profil
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            onLogout?.();
                            setProfileDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button className="bg-blue-600 hover:bg-blue-700">
                <LogIn className="w-4 h-4 mr-2" />
                Masuk
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2 rounded-lg transition-colors ${
                    activePage === item.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {isLoggedIn && (
                <div className="mt-4 px-4 py-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600">Saldo Anda</p>
                  <p className="text-lg">Rp {balance.toLocaleString()}</p>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
