import { useState, useEffect } from "react";
import api from "../../lib/api";
import { useRealTime } from "../../hooks/useRealTime";
import { User, Mail, Phone, Wallet, Edit, Save, X, Upload } from "lucide-react";
import { Card, Button, Input, Label } from "../SimpleUI";
import { TopupBalance } from "./TopupBalance";

export function UserProfile() {
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    balance: 0,
    avatar_url: '',
    level: 'bronze',
    total_spent: 0,
    total_orders: 0,
    created_at: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showTopup, setShowTopup] = useState(false);

  // Real-time WebSocket connection
  useRealTime({
    onProfileUpdate: (updatedProfile) => {
      console.log('Profile updated:', updatedProfile);
      setProfile(prev => ({ ...prev, ...updatedProfile }));
    },
    onBalanceUpdate: (balanceData) => {
      console.log('Balance updated:', balanceData);
      setProfile(prev => ({ ...prev, balance: balanceData.balance }));
    }
  });

  useEffect(() => {
    fetchProfile();
    
    // Auto-refresh profile every 60 seconds
    const interval = setInterval(fetchProfile, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      console.log('UserProfile API response:', response.data);
      if (response.data.success) {
        setProfile(response.data.data);
        setEditData({
          name: response.data.data.name,
          phone: response.data.data.phone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Gagal memuat profil. Pastikan backend Laravel jalan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      console.log('Updating profile with data:', editData);
      
      const response = await api.put('/user/profile', editData);
      console.log('Profile update response:', response.data);
      
      if (response.data.success) {
        setProfile(prev => ({ ...prev, ...editData }));
        setIsEditing(false);
        alert('Profil berhasil diupdate!');
      } else {
        throw new Error(response.data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      alert('Gagal mengupdate profil. Pastikan backend Laravel jalan.');
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await api.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setProfile(prev => ({ ...prev, avatar_url: response.data.data.avatar_url }));
        alert('Avatar berhasil diupload!');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Gagal mengupload avatar');
    } finally {
      setUploading(false);
    }
  };

  const getLevelBadge = (level: string) => {
    const configs = {
      bronze: { bg: "bg-orange-100", text: "text-orange-700", name: "Bronze" },
      silver: { bg: "bg-gray-100", text: "text-gray-700", name: "Silver" },
      gold: { bg: "bg-yellow-100", text: "text-yellow-700", name: "Gold" },
      platinum: { bg: "bg-purple-100", text: "text-purple-700", name: "Platinum" }
    };
    
    const config = configs[level as keyof typeof configs] || configs.bronze;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${config.bg} ${config.text}`}>
        {config.name}
      </span>
    );
  };

  const handleTopupSuccess = () => {
    setShowTopup(false);
    fetchProfile(); // Refresh profile to get updated balance
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (showTopup) {
    return (
      <TopupBalance 
        onBack={() => setShowTopup(false)}
        onSuccess={handleTopupSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
              <div className="w-48 h-48 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-6xl overflow-hidden border-4 border-white/30 shadow-xl hover:shadow-2xl transition-shadow">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url.startsWith('http') ? profile.avatar_url : `http://127.0.0.1:8000${profile.avatar_url}`}
                    alt={profile.name}
                    className="w-48 h-48 object-cover rounded-full hover:opacity-90 transition-opacity"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center rounded-full hover:from-blue-500 hover:to-purple-600 transition-colors">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
                disabled={uploading}
              />
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-4xl mb-2">{profile.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                {getLevelBadge(profile.level)}
                <span className="text-blue-100">
                  Member sejak {new Date(profile.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <p className="text-3xl mb-1">Rp {(profile.balance / 1000).toFixed(0)}k</p>
                  <p className="text-sm text-blue-100">Saldo</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl mb-1">{profile.total_orders}</p>
                  <p className="text-sm text-blue-100">Transaksi</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl mb-1">Rp {(profile.total_spent / 1000).toFixed(0)}k</p>
                  <p className="text-sm text-blue-100">Total Belanja</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl">Informasi Profil</h3>
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({
                          name: profile.name,
                          phone: profile.phone
                        });
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Batal
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan
                    </Button>
                  </div>
                )}
              </div>

            {/* Profile Form */}
            <div className="space-y-4">
              <div>
                <Label>Nama Lengkap</Label>
                {isEditing ? (
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-600" />
                    <span>{profile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <Label>Email</Label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <span>{profile.email}</span>
                  <span className="text-xs text-gray-500 ml-auto">Tidak dapat diubah</span>
                </div>
              </div>

              <div>
                <Label>Nomor Telepon</Label>
                {isEditing ? (
                  <Input
                    value={editData.phone}
                    onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Masukkan nomor telepon"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <span>{profile.phone || 'Belum diisi'}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h4 className="mb-4">Aksi Cepat</h4>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => setShowTopup(true)}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Top Up Saldo
                </Button>
                <Button variant="outline" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Riwayat Transaksi
                </Button>
              </div>
            </Card>

            {/* Level Progress */}
            <Card className="p-6">
              <h4 className="mb-4">Progress Level</h4>
              
              <div className="text-center mb-4">
                <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                  {profile.level === 'bronze' ? '🥉' : profile.level === 'silver' ? '🥈' : profile.level === 'gold' ? '🥇' : '💎'}
                </div>
                {getLevelBadge(profile.level)}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progress ke {profile.level === 'bronze' ? 'Silver' : profile.level === 'silver' ? 'Gold' : 'Platinum'}</span>
                  <span className="font-medium">
                    {profile.level === 'bronze' ? '75%' : profile.level === 'silver' ? '60%' : '90%'}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: profile.level === 'bronze' ? '75%' : profile.level === 'silver' ? '60%' : '90%'
                    }}
                  ></div>
                </div>
                
                <p className="text-xs text-gray-600 text-center">
                  {profile.level === 'bronze' 
                    ? 'Belanja Rp 250k lagi untuk naik ke Silver'
                    : profile.level === 'silver'
                    ? 'Belanja Rp 2.5jt lagi untuk naik ke Gold'
                    : 'Belanja Rp 10jt lagi untuk naik ke Platinum'
                  }
                </p>
              </div>
            </Card>

            {/* Achievement */}
            <Card className="p-6">
              <h4 className="mb-4">Pencapaian</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <p className="text-sm font-medium">Member Aktif</p>
                    <p className="text-xs text-gray-600">Transaksi 10+ kali</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl">💎</div>
                  <div>
                    <p className="text-sm font-medium">Big Spender</p>
                    <p className="text-xs text-gray-600">Belanja Rp 1jt+</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}