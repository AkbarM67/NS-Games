import { Search, Bell, User, ChevronDown } from "lucide-react";
import { Button } from "./SimpleUI";

export function Header() {
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
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs">
              12
            </span>
          </Button>

          {/* User Profile */}
          <Button variant="ghost" className="flex items-center gap-3 pl-4 border-l border-gray-200 h-auto">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-sm">Customer</p>
              <p className="text-xs text-gray-500">Member</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </div>
    </header>
  );
}
