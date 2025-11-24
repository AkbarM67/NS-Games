import { useState, useEffect } from "react";
import api from "../lib/api";
import { useRealTime } from "../hooks/useRealTime";
import { 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  Smartphone,
  Mail,
  Globe,
  Database,
  Key,
  Save,
  Plus,
  User,
  Clock,
  Trash2
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { Badge } from "./ui/badge";

// Admin Users Component
function AdminUsersList() {
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      if (response.data.success) {
        setAdminUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      setAdminUsers([currentUser]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    try {
      const response = await api.post('/admin/users', formData);
      if (response.data.success) {
        alert('Admin berhasil ditambahkan!');
        fetchAdminUsers();
        setShowAddModal(false);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to add admin'));
    }
  };

  const handleEditAdmin = async () => {
    try {
      const response = await api.put(`/admin/users/${selectedAdmin.id}`, {
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password })
      });
      if (response.data.success) {
        alert('Admin berhasil diupdate!');
        fetchAdminUsers();
        setShowEditModal(false);
        setSelectedAdmin(null);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to update admin'));
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!confirm('Yakin ingin menghapus admin ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }
    
    try {
      const response = await api.delete(`/admin/users/${adminId}`);
      if (response.data.success) {
        alert('Admin berhasil dihapus!');
        fetchAdminUsers();
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to delete admin'));
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({ name: admin.name, email: admin.email, password: '' });
    setShowEditModal(true);
  };

  if (loading) {
    return <div className="text-center py-4">Loading admin users...</div>;
  }

  return (
    <div className="border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-gray-600" />
          <h4>Pengguna Admin</h4>
        </div>
        <Button variant="outline" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Admin
        </Button>
      </div>
      
      <div className="space-y-3 pl-8">
        {adminUsers.map((admin, index) => (
          <div key={admin.id || index} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white overflow-hidden">
                  {admin.avatar_url ? (
                    <img 
                      src={`http://localhost/NS-topupgames/ns-topup/public${admin.avatar_url}`}
                      alt={admin.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{admin.name || 'Admin User'}</p>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                  <p className="text-xs text-gray-500">Last login: {new Date(admin.updated_at || Date.now()).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge>{admin.role === 'admin' ? 'Admin' : 'Super Admin'}</Badge>
                <Button size="sm" variant="outline" onClick={() => openEditModal(admin)}>Edit</Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleDeleteAdmin(admin.id)}
                  disabled={adminUsers.length <= 1}
                >
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Tambah Admin Baru</h3>
            <div className="space-y-4">
              <div>
                <Label>Nama Lengkap</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Masukkan email"
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Masukkan password"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                Batal
              </Button>
              <Button className="flex-1" onClick={handleAddAdmin}>
                Tambah Admin
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Admin</h3>
            <div className="space-y-4">
              <div>
                <Label>Nama Lengkap</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Masukkan email"
                />
              </div>
              <div>
                <Label>Password Baru (kosongkan jika tidak diubah)</Label>
                <Input 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Masukkan password baru"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>
                Batal
              </Button>
              <Button className="flex-1" onClick={handleEditAdmin}>
                Update Admin
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Activity Logs Component
function ActivityLogsList() {
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivityLogs = async () => {
    try {
      const response = await api.get('/admin/activity-logs');
      if (response.data.success) {
        setActivityLogs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      // Fallback to sample data
      setActivityLogs([
        {
          id: 1,
          action: 'login',
          description: 'Admin melakukan login',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          action: 'profile_update',
          description: 'Admin mengupdate profil',
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          action: 'settings_update',
          description: 'Pengaturan sistem diubah',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Real-time WebSocket connection
  useRealTime({
    onActivityUpdate: (newActivity) => {
      setActivityLogs(prev => [newActivity, ...prev].slice(0, 10)); // Keep latest 10
    }
  });

  useEffect(() => {
    fetchActivityLogs();
    
    // Polling fallback setiap 30 detik jika WebSocket tidak tersedia
    const interval = setInterval(fetchActivityLogs, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    return `${Math.floor(diffInHours / 24)} hari lalu`;
  };

  if (loading) {
    return <div className="text-center py-4">Loading activity logs...</div>;
  }

  return (
    <div className="border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-600" />
          <h4>Riwayat Aktivitas</h4>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Real-time</span>
        </div>
      </div>
      
      <div className="space-y-2 pl-8">
        {activityLogs.slice(0, 5).map((log) => (
          <div key={log.id} className="text-sm p-3 bg-gray-50 rounded flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-800">{log.description}</p>
              <p className="text-gray-500 text-xs">{getTimeAgo(log.created_at)}</p>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full mt-3">
          Lihat Semua Riwayat
        </Button>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(true);
  const [autoRefund, setAutoRefund] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [providers, setProviders] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [generalSettings, setGeneralSettings] = useState({
    app_name: '',
    domain: '',
    support_email: '',
    whatsapp_cs: '',
    logo: ''
  });
  const [businessSettings, setBusinessSettings] = useState({
    default_margin: 0,
    reseller_commission: 0,
    min_deposit: 0
  });
  const [paymentSettings, setPaymentSettings] = useState({
    qris_enabled: true,
    qris_provider: 'midtrans',
    qris_fee: 0,
    va_enabled: true,
    va_provider: 'midtrans',
    va_fee: 0,
    ewallet_enabled: true,
    ewallet_provider: 'midtrans',
    ewallet_fee: 0
  });
  const [ipInfo] = useState({
    public_ip: '203.0.113.45',
    server_ip: '192.168.1.100', 
    client_ip: '192.168.1.50',
    local_ip: '127.0.0.1'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data.success) {
          setGeneralSettings(response.data.data);
          if (response.data.business) {
            setBusinessSettings(response.data.business);
          }
          if (response.data.payment) {
            setPaymentSettings(response.data.payment);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    
    const fetchProviders = async () => {
      try {
        const response = await api.get('/providers');
        const providersData = response.data.providers || [];
        setProviders(providersData);
        
        // Initialize input values with loaded data
        const initialInputs = {};
        providersData.forEach(provider => {
          initialInputs[`${provider.name}_username`] = provider.username || provider.api_id || '';
          initialInputs[`${provider.name}_apikey`] = provider.api_key || '';
        });
        setInputValues(initialInputs);
      } catch (error) {
        console.error('Error fetching providers:', error);
        // Fallback data if API fails
        const fallbackProviders = [
          { name: 'Digiflazz', status: 'inactive', balance: 0, username: '', api_key: '' },
          { name: 'VIP Reseller', status: 'inactive', balance: 0, api_id: '', api_key: '' },
          { name: 'Apigames', status: 'inactive', balance: 0, api_key: '' }
        ];
        setProviders(fallbackProviders);
        
        // Initialize input values for fallback data
        const initialInputs = {};
        fallbackProviders.forEach(provider => {
          initialInputs[`${provider.name}_username`] = provider.username || provider.api_id || '';
          initialInputs[`${provider.name}_apikey`] = provider.api_key || '';
        });
        setInputValues(initialInputs);
      }
    };
    
    fetchSettings();
    fetchProviders();
  }, []);

  const testProvider = async (providerName: string) => {
    if (providerName === 'Digiflazz') {
      try {
        const response = await api.post('/digiflazz/test');
        alert(response.data.success ? 'Koneksi berhasil!' : 'Koneksi gagal: ' + response.data.message);
      } catch (error: any) {
        console.error('Test connection error:', error);
        alert('Error: ' + (error.response?.data?.message || error.message || 'Connection failed'));
      }
    } else {
      alert('Test koneksi untuk ' + providerName + ' belum tersedia');
    }
  };

  const toggleProvider = (index: number, isActive: boolean) => {
    const updatedProviders = [...providers];
    updatedProviders[index] = {
      ...updatedProviders[index],
      status: isActive ? 'active' : 'inactive'
    };
    setProviders(updatedProviders);
  };

  const saveGeneralSettings = async (section: string) => {
    try {
      let dataToSave;
      if (section === 'business') {
        dataToSave = { business: businessSettings };
      } else if (section === 'payment') {
        dataToSave = { payment: paymentSettings };
      } else {
        dataToSave = { general: generalSettings };
      }
        
      const response = await api.post('/settings/save', dataToSave);
      
      if (response.data.success) {
        const sectionName = section === 'business' ? 'bisnis' : section === 'payment' ? 'payment' : 'umum';
        alert(`Pengaturan ${sectionName} berhasil disimpan!`);
      }
    } catch (error: any) {
      alert('Error: ' + (error.response?.data?.message || 'Save failed'));
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await api.post('/settings/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setGeneralSettings(prev => ({ ...prev, logo: response.data.logo_url }));
        alert('Logo berhasil diupload!');
      }
    } catch (error: any) {
      alert('Error: ' + (error.response?.data?.message || 'Upload failed'));
    }
  };

  const saveProviders = async () => {
    // Merge input values with provider data
    const updatedProviders = providers.map(provider => {
      const usernameKey = `${provider.name}_username`;
      const apikeyKey = `${provider.name}_apikey`;
      
      return {
        ...provider,
        username: inputValues[usernameKey] || provider.username || '',
        api_id: inputValues[usernameKey] || provider.api_id || '',
        api_key: inputValues[apikeyKey] || provider.api_key || ''
      };
    });
    
    console.log('Saving providers:', updatedProviders);
    
    try {
      const response = await api.post('/providers/save', {
        providers: updatedProviders
      });
      
      console.log('Save response:', response.data);
      
      if (response.data.success) {
        alert(`Provider settings berhasil disimpan! (${response.data.received_count} providers)`);
        // Update local state with saved data
        setProviders(updatedProviders);
      } else {
        alert('Gagal menyimpan settings');
      }
    } catch (error: any) {
      console.error('Save providers error:', error);
      alert('Error: ' + (error.response?.data?.message || error.message || 'Save failed'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl mb-1">Pengaturan Sistem</h1>
        <p className="text-gray-600">Konfigurasi aplikasi, payment gateway, dan sistem</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notification">Notifikasi</TabsTrigger>
          <TabsTrigger value="provider">Provider</TabsTrigger>
          <TabsTrigger value="security">Keamanan</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3>Pengaturan Umum</h3>
                <p className="text-sm text-gray-600">Konfigurasi dasar aplikasi</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nama Aplikasi</Label>
                  <Input 
                    value={generalSettings.app_name}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, app_name: e.target.value }))}
                    placeholder="Masukkan nama aplikasi" 
                  />
                </div>
                <div>
                  <Label>Domain Website</Label>
                  <Input 
                    value={generalSettings.domain}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, domain: e.target.value }))}
                    placeholder="Masukkan domain website" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email Support</Label>
                  <Input 
                    value={generalSettings.support_email}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, support_email: e.target.value }))}
                    placeholder="Masukkan email support" 
                  />
                </div>
                <div>
                  <Label>WhatsApp CS</Label>
                  <Input 
                    value={generalSettings.whatsapp_cs}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, whatsapp_cs: e.target.value }))}
                    placeholder="Masukkan nomor WhatsApp" 
                  />
                </div>
              </div>

              <div>
                <Label>Logo Aplikasi</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {generalSettings.logo ? (
                      <img src={generalSettings.logo} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-gray-400 text-xs">Logo</span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Mode Maintenance</p>
                  <p className="text-sm text-gray-600">Nonaktifkan aplikasi untuk maintenance</p>
                </div>
                <Switch 
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Refund</p>
                  <p className="text-sm text-gray-600">Otomatis refund jika transaksi gagal</p>
                </div>
                <Switch 
                  checked={autoRefund}
                  onCheckedChange={setAutoRefund}
                />
              </div>
            </div>

            <div className="pt-6">
              <Button 
                onClick={() => saveGeneralSettings('general')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </Button>
            </div>
          </Card>

          {/* Business Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3>Pengaturan Bisnis</h3>
                <p className="text-sm text-gray-600">Margin, komisi, dan pricing</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Margin Default (%)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={businessSettings.default_margin}
                    onChange={(e) => setBusinessSettings(prev => ({ 
                      ...prev, 
                      default_margin: Math.max(0, Number(e.target.value)) 
                    }))}
                  />
                </div>
                <div>
                  <Label>Komisi Reseller (%)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={businessSettings.reseller_commission}
                    onChange={(e) => setBusinessSettings(prev => ({ 
                      ...prev, 
                      reseller_commission: Math.max(0, Number(e.target.value)) 
                    }))}
                  />
                </div>
                <div>
                  <Label>Min. Deposit (Rp)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={businessSettings.min_deposit}
                    onChange={(e) => setBusinessSettings(prev => ({ 
                      ...prev, 
                      min_deposit: Math.max(0, Number(e.target.value)) 
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label>Harga Level Member</Label>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Bronze</p>
                    <p className="text-lg">{businessSettings.default_margin}%</p>
                    <p className="text-xs text-gray-500">margin default</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Silver</p>
                    <p className="text-lg">{Math.max(0, businessSettings.default_margin - 1)}%</p>
                    <p className="text-xs text-gray-500">margin -1%</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Gold</p>
                    <p className="text-lg">{Math.max(0, businessSettings.default_margin - 2)}%</p>
                    <p className="text-xs text-gray-500">margin -2%</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Platinum</p>
                    <p className="text-lg">{Math.max(0, businessSettings.default_margin - 3)}%</p>
                    <p className="text-xs text-gray-500">margin -3%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                onClick={() => saveGeneralSettings('business')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Pengaturan
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3>Payment Gateway</h3>
                <p className="text-sm text-gray-600">Konfigurasi metode pembayaran</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* QRIS */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">QRIS</p>
                      <p className="text-sm text-gray-600">Payment via QRIS</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Provider</Label>
                    <Select defaultValue="midtrans">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="midtrans">Midtrans</SelectItem>
                        <SelectItem value="xendit">Xendit</SelectItem>
                        <SelectItem value="duitku">Duitku</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Biaya Admin (%)</Label>
                    <Input 
                      type="number" 
                      min="0"
                      value={paymentSettings.qris_fee}
                      onChange={(e) => setPaymentSettings(prev => ({ 
                        ...prev, 
                        qris_fee: Math.max(0, Number(e.target.value)) 
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* Virtual Account */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Virtual Account</p>
                      <p className="text-sm text-gray-600">BCA, BNI, Mandiri, dll</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Provider</Label>
                    <Select defaultValue="midtrans">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="midtrans">Midtrans</SelectItem>
                        <SelectItem value="xendit">Xendit</SelectItem>
                        <SelectItem value="duitku">Duitku</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Biaya Admin (Rp)</Label>
                    <Input 
                      type="number" 
                      min="0"
                      value={paymentSettings.va_fee}
                      onChange={(e) => setPaymentSettings(prev => ({ 
                        ...prev, 
                        va_fee: Math.max(0, Number(e.target.value)) 
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* E-Wallet */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">E-Wallet</p>
                      <p className="text-sm text-gray-600">GoPay, OVO, DANA, ShopeePay</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Provider</Label>
                    <Select defaultValue="midtrans">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="midtrans">Midtrans</SelectItem>
                        <SelectItem value="xendit">Xendit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Biaya Admin (%)</Label>
                    <Input 
                      type="number" 
                      min="0"
                      value={paymentSettings.ewallet_fee}
                      onChange={(e) => setPaymentSettings(prev => ({ 
                        ...prev, 
                        ewallet_fee: Math.max(0, Number(e.target.value)) 
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                onClick={() => saveGeneralSettings('payment')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Konfigurasi
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notification" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3>Pengaturan Notifikasi</h3>
                <p className="text-sm text-gray-600">Konfigurasi email dan WhatsApp notification</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Email Settings */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <h4>Email Notification</h4>
                </div>
                
                <div className="space-y-4 pl-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Aktifkan Email</p>
                      <p className="text-sm text-gray-600">Kirim notifikasi via email</p>
                    </div>
                    <Switch 
                      checked={emailNotif}
                      onCheckedChange={setEmailNotif}
                    />
                  </div>

                  {emailNotif && (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>SMTP Host</Label>
                          <Input defaultValue="" placeholder="smtp.gmail.com" />
                        </div>
                        <div>
                          <Label>SMTP Port</Label>
                          <Input defaultValue="" placeholder="587" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>SMTP Username</Label>
                          <Input defaultValue="" placeholder="username@domain.com" />
                        </div>
                        <div>
                          <Label>SMTP Password</Label>
                          <Input type="password" defaultValue="" placeholder="Password SMTP" />
                        </div>
                      </div>
                      <div>
                        <Label>From Email</Label>
                        <Input defaultValue="" placeholder="Nama <email@domain.com>" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp Settings */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <h4>WhatsApp Notification</h4>
                </div>
                
                <div className="space-y-4 pl-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Aktifkan WhatsApp</p>
                      <p className="text-sm text-gray-600">Kirim notifikasi via WhatsApp</p>
                    </div>
                    <Switch 
                      checked={whatsappNotif}
                      onCheckedChange={setWhatsappNotif}
                    />
                  </div>

                  {whatsappNotif && (
                    <div className="space-y-3 pt-2">
                      <div>
                        <Label>WhatsApp API Provider</Label>
                        <Select defaultValue="fonnte">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fonnte">Fonnte</SelectItem>
                            <SelectItem value="wablas">Wablas</SelectItem>
                            <SelectItem value="woowa">Woowa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>API Key</Label>
                        <Input type="password" defaultValue="" placeholder="API Key WhatsApp" />
                      </div>
                      <div>
                        <Label>Nomor Pengirim</Label>
                        <Input defaultValue="" placeholder="+62812-xxxx-xxxx" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                onClick={() => saveGeneralSettings('notification')}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Notifikasi
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Provider Settings */}
        <TabsContent value="provider" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3>Konfigurasi Provider</h3>
                <p className="text-sm text-gray-600">Setting API provider topup</p>
              </div>
            </div>

            <div className="space-y-4">
              {providers.map((provider, index) => (
                <div key={index} className={`p-4 border rounded-lg ${provider.status === 'inactive' ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-sm text-gray-600">
                        {provider.name === 'Digiflazz' ? 'Provider topup game dan pulsa' :
                         provider.name === 'VIP Reseller' ? 'Provider topup game' :
                         'Provider topup game'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${
                        provider.status === 'active' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        ● {provider.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                      <Switch 
                        checked={provider.status === 'active'} 
                        onCheckedChange={(checked) => toggleProvider(index, checked)}
                      />
                    </div>
                  </div>
                  
                  {provider.status === 'active' ? (
                    <div className="space-y-3">
                      <div>
                        <Label>{provider.name === 'VIP Reseller' ? 'API ID' : 'Username'}</Label>
                        <Input 
                          value={inputValues[`${provider.name}_username`] || provider.username || provider.api_id || ''}
                          onChange={(e) => setInputValues(prev => ({
                            ...prev,
                            [`${provider.name}_username`]: e.target.value
                          }))}
                        />
                      </div>
                      <div>
                        <Label>API Key</Label>
                        <Input 
                          type="password" 
                          value={inputValues[`${provider.name}_apikey`] || provider.api_key || ''}
                          onChange={(e) => setInputValues(prev => ({
                            ...prev,
                            [`${provider.name}_apikey`]: e.target.value
                          }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Saldo</Label>
                          <p className="text-lg">Rp {provider.balance?.toLocaleString() || 0}</p>
                        </div>
                        <div>
                          <Label>Status</Label>
                          <p className="text-lg text-gray-600">
                            {provider.balance > 0 ? 'Normal' : 'Belum diisi'}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => testProvider(provider.name)}
                      >
                        Test Koneksi
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Provider belum dikonfigurasi</p>
                  )}
                </div>
              ))}
            </div>

            {/* IP Information */}
            {ipInfo && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Informasi IP Server</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>IP Public</Label>
                    <p className="font-mono">{ipInfo.public_ip}</p>
                  </div>
                  <div>
                    <Label>IP Server</Label>
                    <p className="font-mono">{ipInfo.server_ip}</p>
                  </div>
                  <div>
                    <Label>IP Client</Label>
                    <p className="font-mono">{ipInfo.client_ip}</p>
                  </div>
                  <div>
                    <Label>IP Local</Label>
                    <p className="font-mono">{ipInfo.local_ip}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  * Daftarkan IP Public ke provider untuk whitelist
                </p>
              </div>
            )}

            <div className="pt-6">
              <Button 
                onClick={saveProviders}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Provider
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3>Keamanan & Admin</h3>
                <p className="text-sm text-gray-600">Kelola akses dan keamanan sistem</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Change Password */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-5 h-5 text-gray-600" />
                  <h4>Ubah Password</h4>
                </div>
                
                <div className="space-y-3 pl-8">
                  <div>
                    <Label>Password Lama</Label>
                    <Input type="password" />
                  </div>
                  <div>
                    <Label>Password Baru</Label>
                    <Input type="password" />
                  </div>
                  <div>
                    <Label>Konfirmasi Password Baru</Label>
                    <Input type="password" />
                  </div>
                  <Button>Ubah Password</Button>
                </div>
              </div>

              {/* Admin Users */}
              <AdminUsersList />

              {/* Activity Log */}
              <ActivityLogsList />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
