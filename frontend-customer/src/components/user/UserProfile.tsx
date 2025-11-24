import { useState, useEffect } from "react";
import api from "../../lib/api";
import { 
  User, 
  Wallet, 
  Gift, 
  Share2, 
  Settings, 
  LogOut,
  CreditCard,
  Star,
  TrendingUp,
  Copy,
  Plus,
  History,
  Camera
} from "lucide-react";
import { Card } from "../SimpleUI";
import { Badge } from "../SimpleUI";
import { Button } from "../SimpleUI";
import { Input } from "../SimpleUI";
import { Label } from "../SimpleUI";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../SimpleUI";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../SimpleUI";

export function UserProfile() {
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    level: "bronze",
    balance: 0,
    points: 0,
    totalSpent: 0,
    totalTransactions: 0,
    joinDate: "",
    referralCode: "USER2024",
    referralCount: 0,
    avatar_url: null
  });
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({ name: "", phone: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/customer/profile');
      if (response.data.success) {
        const data = response.data.data;
        const profileData = {
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          level: data.level || "bronze",
          balance: data.balance || 0,
          points: Math.floor((data.total_spent || 0) / 1000),
          totalSpent: data.total_spent || 0,
          totalTransactions: data.total_orders || 0,
          joinDate: data.join_date || "",
          referralCode: `USER${data.id}2024`,
          referralCount: 0,
          avatar_url: data.avatar_url
        };
        setUserData(profileData);
        setEditData({ name: profileData.name, phone: profileData.phone });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('phone', editData.phone);
      if (selectedFile) {
        formData.append('avatar', selectedFile);
      }

      formData.append('_method', 'PUT');
      
      const response = await api.post('/customer/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setShowEditProfile(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchUserProfile();
        // Refresh header data
        if (window.refreshUserProfile) {
          window.refreshUserProfile();
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const quickTopUpAmounts = [50000, 100000, 200000, 500000];

  const recentActivities = [
    { type: "topup", desc: "Top up saldo Rp 100.000", date: "2 jam lalu" },
    { type: "transaction", desc: "Beli Mobile Legends 275 Diamonds", date: "5 jam lalu" },
    { type: "referral", desc: "Bonus referral dari Ahmad", date: "1 hari lalu" },
    { type: "transaction", desc: "Beli Pulsa Telkomsel 50.000", date: "2 hari lalu" },
  ];

  const getLevelBadge = (level: string) => {
    const configs = {
      bronze: { label: "Bronze", bg: "bg-orange-100", text: "text-orange-700" },
      silver: { label: "Silver", bg: "bg-gray-100", text: "text-gray-700" },
      gold: { label: "Gold", bg: "bg-yellow-100", text: "text-yellow-700" },
      platinum: { label: "Platinum", bg: "bg-purple-100", text: "text-purple-700" }
    };
    
    const config = configs[level as keyof typeof configs];
    
    return (
      <Badge className={`${config.bg} ${config.text} hover:${config.bg}`}>
        <Star className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(userData.referralCode);
    // Show toast notification in real app
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Profil Saya</h1>
        <p className="text-gray-600">Kelola informasi akun dan preferensi kamu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl overflow-hidden">
                  {userData.avatar_url ? (
                    <img 
                      src={`http://localhost/NS-topupgames/ns-topup/public${userData.avatar_url}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userData.name.charAt(0)
                  )}
                </div>
                <div>
                  <h2 className="text-2xl mb-2">{userData.name}</h2>
                  <div className="flex items-center gap-2">
                    {getLevelBadge(userData.level)}
                    <span className="text-sm text-gray-600">• Member sejak {userData.joinDate}</span>
                  </div>
                </div>
              </div>
              <Button onClick={() => setShowEditProfile(true)} variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p>{userData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Telepon</p>
                <p>{userData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Transaksi</p>
                <p className="text-xl">{userData.totalTransactions}x</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Belanja</p>
                <p className="text-xl text-green-600">Rp {(userData.totalSpent / 1000000).toFixed(1)}jt</p>
              </div>
            </div>
          </Card>

          {/* Balance Card */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-blue-100 mb-1">Saldo Saya</p>
                  <p className="text-4xl">Rp {userData.balance.toLocaleString()}</p>
                </div>
                <Wallet className="w-12 h-12 text-white/30" />
              </div>
              <Button 
                onClick={() => setShowTopUpDialog(true)}
                className="w-full bg-white text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Top Up Saldo
              </Button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Poin Rewards</p>
                  <p className="text-2xl text-purple-600">{userData.points} poin</p>
                </div>
                <Button variant="outline">
                  <Gift className="w-4 h-4 mr-2" />
                  Tukar Poin
                </Button>
              </div>
            </div>
          </Card>

          {/* Level Benefits */}
          <Card className="p-6">
            <h3 className="mb-4">Keuntungan Level {userData.level.charAt(0).toUpperCase() + userData.level.slice(1)}</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Diskon 5% Semua Produk</p>
                  <p className="text-sm text-gray-600">Hemat lebih banyak disetiap transaksi</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Bonus Poin 2x Lipat</p>
                  <p className="text-sm text-gray-600">Kumpulkan poin lebih cepat</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Akses Promo Eksklusif</p>
                  <p className="text-sm text-gray-600">Dapatkan promo khusus member Gold</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progress ke Platinum</span>
                <span className="text-sm">Rp {((15000000 - userData.totalSpent) / 1000000).toFixed(1)}jt lagi</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${(userData.totalSpent / 15000000) * 100}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Recent Activities */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3>Aktivitas Terakhir</h3>
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                Lihat Semua
              </Button>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === "topup" ? "bg-blue-100" :
                    activity.type === "transaction" ? "bg-green-100" :
                    "bg-purple-100"
                  }`}>
                    {activity.type === "topup" ? <Wallet className="w-5 h-5 text-blue-600" /> :
                     activity.type === "transaction" ? <CreditCard className="w-5 h-5 text-green-600" /> :
                     <Gift className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">{activity.desc}</p>
                    <p className="text-sm text-gray-600">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Referral Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3>Program Referral</h3>
                <p className="text-sm text-gray-600">Ajak teman, dapat bonus!</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Kode Referral Kamu</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white border-2 border-dashed border-orange-300 rounded-lg px-4 py-3 text-lg font-mono">
                  {userData.referralCode}
                </code>
                <Button size="icon" variant="outline" onClick={copyReferralCode}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Teman yang kamu ajak</span>
                <span className="font-medium">{userData.referralCount} orang</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Bonus yang didapat</span>
                <span className="font-medium text-green-600">Rp {(userData.referralCount * 10000).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 mb-2">
                <strong>Cara Kerja:</strong>
              </p>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Bagikan kode referral kamu</li>
                <li>Teman daftar pakai kode kamu</li>
                <li>Kamu dapat Rp 10.000!</li>
                <li>Teman dapat Rp 5.000!</li>
              </ol>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="mb-4">Aksi Cepat</h3>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Wallet className="w-4 h-4 mr-3" />
                Riwayat Saldo
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Gift className="w-4 h-4 mr-3" />
                Voucher Saya
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-3" />
                Pengaturan
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-600">
                <LogOut className="w-4 h-4 mr-3" />
                Keluar
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Top Up Dialog */}
      <Dialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Up Saldo</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Nominal Top Up</Label>
              <Input 
                type="number"
                placeholder="Masukkan nominal"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
              />
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-3">Atau pilih nominal:</p>
              <div className="grid grid-cols-2 gap-3">
                {quickTopUpAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => setTopUpAmount(amount.toString())}
                    className="h-auto py-4"
                  >
                    Rp {amount.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Metode Pembayaran</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih metode..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qris">QRIS</SelectItem>
                  <SelectItem value="bca">Virtual Account BCA</SelectItem>
                  <SelectItem value="gopay">GoPay</SelectItem>
                  <SelectItem value="ovo">OVO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {topUpAmount && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Nominal Top Up</span>
                  <span>Rp {Number(topUpAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Biaya Admin</span>
                  <span>Rp {Math.round(Number(topUpAmount) * 0.007).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Total</span>
                  <span className="text-xl text-blue-600">
                    Rp {(Number(topUpAmount) + Math.round(Number(topUpAmount) * 0.007)).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowTopUpDialog(false)}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!topUpAmount}
              >
                Lanjutkan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profil</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : userData.avatar_url ? (
                    <img 
                      src={`http://localhost/NS-topupgames/ns-topup/public${userData.avatar_url}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userData.name.charAt(0)
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                  <Camera className="w-4 h-4" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-2">Klik ikon kamera untuk mengubah foto</p>
            </div>

            <div>
              <Label>Nama Lengkap</Label>
              <Input 
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" value={userData.email} disabled />
            </div>

            <div>
              <Label>Nomor Telepon</Label>
              <Input 
                value={editData.phone}
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowEditProfile(false)}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleUpdateProfile}
              >
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
