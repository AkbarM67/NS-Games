import { Bell, User, ChevronDown, LogOut, Settings, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../lib/api";
import { User as UserType, Announcement, ApiResponse, Settings as SettingsType } from "../../types";
import { API_BASE_URL } from "../../utils/constants";
import { formatDate, getAnnouncementColor } from "../../utils/helpers";

interface HeaderProps {
  user?: UserType;
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
  refreshTrigger?: number;
}

export function Header({ user, onLogout, onNavigate, refreshTrigger }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [announcementDropdown, setAnnouncementDropdown] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [adminProfile, setAdminProfile] = useState<UserType | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const loadSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`);
      const data: ApiResponse<SettingsType> = await res.json();
      
      if (data.success && data.data?.logo) {
        setLogo(data.data.logo);
      }
    } catch (err) {
      // Silent fail for logo
    }
  };

  const loadProfile = async () => {
    try {
      const response = await api.get<ApiResponse<UserType>>('/admin/user');
      if (response.data.success && response.data.user) {
        setAdminProfile(response.data.user);
      }
    } catch (err) {
      // Handle error silently
    }
  };

  const loadAnnouncements = async () => {
    try {
      const response = await api.get<ApiResponse<Announcement[]>>('/admin/announcements');
      if (response.data.success && response.data.data) {
        const active = response.data.data.filter(a => a.is_active).slice(0, 5);
        setAnnouncements(active);
      }
    } catch (err) {
      // Handle error silently
    }
  };

  useEffect(() => {
    loadSettings();
    loadProfile();
    loadAnnouncements();
  }, [refreshTrigger]);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden border">
            {logo ? (
              <img 
                src={`${API_BASE_URL}${logo}`} 
                alt="Logo" 
                className="w-full h-full object-contain"
                onError={() => setLogo(null)}
              />
            ) : (
              <Wallet className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div className="p-3">
            <h1 className="text-lg font-semibold text-gray-900">NS Games Admin</h1>
            <p className="text-sm text-gray-500">Game & Pulsa</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setAnnouncementDropdown(!announcementDropdown);
                if (!announcementDropdown) {
                  loadAnnouncements();
                }
              }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {announcements.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs">
                  {announcements.length}
                </span>
              )}
            </button>
            
            {announcementDropdown && (
              <div className="absolute left-0 mt-2 w-[300px] bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Pengumuman Terbaru</h3>
                  </div>
                  
                  {announcements.length > 0 ? (
                    <div className="max-h-72 overflow-y-auto">
                      <div className="p-4">
                        <div className="space-y-3">
                          {announcements.map((announcement) => (
                            <div key={announcement.id} className="p-4 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors">
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getAnnouncementColor(announcement.type)}`}></div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-base text-gray-800 mb-2">{announcement.title}</h4>
                                  <p className="text-sm text-gray-600 leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis">{announcement.content}</p>
                                  <p className="text-xs text-gray-400 mt-2">
                                    {formatDate(announcement.created_at)}
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
                      <p className="text-sm">Tidak ada pengumuman</p>
                    </div>
                  )}
                  
                  <div className="px-4 py-3 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        onNavigate?.('announcements');
                        setAnnouncementDropdown(false);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Lihat Semua Pengumuman →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                {adminProfile?.avatar_url ? (
                  <img 
                    src={`${API_BASE_URL}${adminProfile.avatar_url}`}
                    alt="Admin Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="text-right">
                <p className="text-sm">{adminProfile?.name || user?.name || 'Admin Topup'}</p>
                <p className="text-xs text-gray-500">{adminProfile?.role || user?.role || 'Super Admin'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button 
                    onClick={() => {
                      onNavigate?.('profile');
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                  <button 
                    onClick={() => {
                      onNavigate?.('settings');
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Pengaturan
                  </button>
                  <hr className="my-1" />
                  <button 
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}