import { Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import api from "../../lib/api";
import { useRealTime } from "../../hooks/useRealTime";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays < 7) return `${diffDays} hari yang lalu`;
  
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

const getNotificationColor = (type: string) => {
  const colors = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500"
  };
  return colors[type as keyof typeof colors] || "bg-gray-500";
};



export function NotificationBell() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/notifications');
      if (response.data.success && response.data.data) {
        const recent = response.data.data.slice(0, 5);
        setNotifications(recent);
        setUnreadCount(response.data.unread_count || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
      // Fallback to mock data
      const mockNotifications = [
        {
          id: 1,
          title: "Pembayaran Berhasil",
          message: "Pembayaran invoice #INV-2024-001 sebesar Rp 1.500.000 telah berhasil diproses",
          type: "success",
          created_at: "2024-11-25T10:30:00Z",
          read: false
        },
        {
          id: 2,
          title: "Dokumen Menunggu Approval",
          message: "Dokumen Purchase Order #PO-2024-045 memerlukan persetujuan Anda",
          type: "warning",
          created_at: "2024-11-25T09:15:00Z",
          read: false
        },
        {
          id: 3,
          title: "Stok Menipis",
          message: "Produk 'Laptop Dell XPS 15' tersisa 3 unit. Segera lakukan restock",
          type: "error",
          created_at: "2024-11-24T16:45:00Z",
          read: false
        },
        {
          id: 4,
          title: "Laporan Bulanan Tersedia",
          message: "Laporan penjualan bulan Oktober 2024 sudah dapat diunduh",
          type: "info",
          created_at: "2024-11-24T14:20:00Z",
          read: true
        },
        {
          id: 5,
          title: "Update Sistem",
          message: "Sistem akan maintenance pada tanggal 30 November 2024 pukul 01:00 - 03:00 WIB",
          type: "info",
          created_at: "2024-11-23T11:00:00Z",
          read: true
        }
      ];
      setNotifications(mockNotifications.slice(0, 5));
      setUnreadCount(3);
    } finally {
      setLoading(false);
    }
  };

  // Real-time updates
  useRealTime({
    onNotificationUpdate: () => {
      loadNotifications();
    },
    onOrderUpdate: () => {
      loadNotifications();
    }
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    loadNotifications();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleViewAll = () => {
    setShowDropdown(false);
    // TODO: Add navigation to full notifications page
    // Example: window.location.href = '/notifications';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => {
          setShowDropdown(!showDropdown);
          if (!showDropdown) {
            loadNotifications();
          }
        }}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs">
            {unreadCount}
          </span>
        )}
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-[300px] bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Notifikasi Terbaru</h3>
            </div>
            
            {loading ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm mt-2">Memuat notifikasi...</p>
              </div>
            ) : notifications.length > 0 ? (
              <div className="max-h-72 overflow-y-auto">
                <div className="p-4">
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getNotificationColor(notification.type)}`}></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-base text-gray-800 mb-2">{notification.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatDate(notification.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Tidak ada notifikasi</p>
              </div>
            )}
            
            <div className="px-4 py-3 border-t border-gray-100">
              <button 
                onClick={handleViewAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Lihat Semua Notifikasi →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}