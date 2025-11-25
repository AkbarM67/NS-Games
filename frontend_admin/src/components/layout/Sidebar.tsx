import { 
  LayoutDashboard, 
  Receipt, 
  Package, 
  Users, 
  FileText, 
  Megaphone, 
  Settings,
  Wallet,
  TrendingUp,
  CreditCard
} from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export function Sidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost/NS-topupgames/ns-topup/public/api/settings')
      .then(res => res.json())
      .then(data => {
        console.log('Settings API response:', data);
        if (data.success && data.data && data.data.logo) {
          console.log('Setting logo:', data.data.logo);
          setLogo(data.data.logo);
        } else if (data.general && data.general.logo) {
          console.log('Setting logo from general:', data.general.logo);
          setLogo(data.general.logo);
        }
      })
      .catch(error => {
        console.error('Error fetching settings:', error);
      });
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transaksi", icon: Receipt },
    { id: "products", label: "Produk", icon: Package },
    { id: "users", label: "User/Member", icon: Users },
    { id: "balance-topups", label: "Topup Saldo", icon: CreditCard },
    { id: "announcements", label: "Pengumuman", icon: Megaphone },
    { id: "reports", label: "Laporan", icon: FileText },
    { id: "marketing", label: "Marketing", icon: TrendingUp },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-blue-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
            {logo ? (
              <img 
                src={`http://localhost/NS-topupgames/ns-topup/public${logo}`} 
                alt="Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Logo failed to load:', logo);
                  setLogo(null);
                }}
              />
            ) : (
              <Wallet className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <h1 className="font-bold">NS Games Admin</h1>
            <p className="text-xs text-blue-200">Game & Pulsa</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-white text-blue-600 shadow-lg" 
                  : "text-blue-100 hover:bg-blue-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Saldo Provider */}
      <div className="p-4 border-t border-blue-500">
        <div className="bg-blue-700 rounded-lg p-4">
          <p className="text-xs text-blue-200 mb-1">Saldo Provider</p>
          <p className="text-xl">Rp {new Intl.NumberFormat('id-ID').format(0)}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-300">
            <TrendingUp className="w-3 h-3" />
            <span>Aktif & Normal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
