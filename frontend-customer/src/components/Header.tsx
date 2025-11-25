import { Search, Bell, User, ChevronDown, Wallet } from "lucide-react";
import { Button } from "./SimpleUI";
import { useBalance } from "../hooks/useBalance";
import { useNotifications } from "../hooks/useNotifications";
import { useUser } from "../hooks/useUser";

export function Header() {
  const { balance, loading: balanceLoading } = useBalance();
  const displayBalance = balanceLoading ? 0 : (balance || 150000);
  const { unreadCount, loading: notificationsLoading } = useNotifications();
  const { user, loading: userLoading } = useUser();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari transaksi, produk, atau user..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-6">
          {/* Balance */}
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
            <Wallet className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              {balanceLoading ? 'Loading...' : `Rp ${displayBalance.toLocaleString()}`}
            </span>
          </div>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {!notificationsLoading && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs font-medium">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
          {/* User Profile */}
          <Button variant="ghost" className="flex items-center gap-3 pl-4 border-l border-gray-200 h-auto">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
              {user.avatar_url ? (
                <img 
                  src={`http://127.0.0.1:8000${user.avatar_url}`}
                  alt={user.name}
                  className="w-10 h-10 object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="text-right">
              <p className="text-sm">{userLoading ? 'Loading...' : user.name || 'Customer'}</p>
              <p className="text-xs text-gray-500 capitalize">{user.level || 'Member'}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </div>
    </header>
  );
}
