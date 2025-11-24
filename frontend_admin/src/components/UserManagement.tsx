import { useState, useEffect } from "react";
import api from "../lib/api";
import { Search, Eye, Ban, Gift, User, Crown, Star, TrendingUp, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: "bronze" | "silver" | "gold" | "platinum";
  balance: number;
  totalSpent: number;
  totalTransactions: number;
  joinDate: string;
  lastActive: string;
  status: "active" | "blocked";
  avatar_url?: string | null;
}

export function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/customers');
      if (response.data.success) {
        const userData = response.data.data.map((user: any) => ({
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || '-',
          level: user.level || 'bronze',
          balance: user.balance || 0,
          totalSpent: user.total_spent || 0,
          totalTransactions: user.total_orders || 0,
          joinDate: new Date(user.created_at).toLocaleDateString('id-ID'),
          lastActive: new Date(user.updated_at).toLocaleDateString('id-ID'),
          status: user.is_blocked ? 'blocked' : 'active',
          avatar_url: user.avatar_url
        }));
        setUsers(userData);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId: string, isBlocking: boolean) => {
    try {
      const response = await api.patch(`/admin/customers/${userId}/block`);
      if (response.data.success) {
        fetchUsers(); // Refresh data
      }
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await api.delete(`/admin/customers/${userId}`);
      if (response.data.success) {
        fetchUsers(); // Refresh data
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  // Filter users
  const filteredUsers = users.filter(user => 
    searchQuery === "" || 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
  const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0);

  const getLevelBadge = (level: string) => {
    const configs = {
      bronze: { bg: "bg-orange-100", text: "text-orange-700", icon: User },
      silver: { bg: "bg-gray-100", text: "text-gray-700", icon: Star },
      gold: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Crown },
      platinum: { bg: "bg-purple-100", text: "text-purple-700", icon: Crown }
    };
    
    const config = configs[level as keyof typeof configs];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.bg} ${config.text} hover:${config.bg}`}>
        <Icon className="w-3 h-3 mr-1" />
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl mb-1">Manajemen User & Member</h1>
        <p className="text-gray-600">Kelola user, level member, dan saldo</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total User</p>
              <p className="text-2xl">{totalUsers}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">User Aktif</p>
              <p className="text-2xl">{activeUsers}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Saldo User</p>
              <p className="text-xl">Rp {totalBalance.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xl">Rp {(totalRevenue / 1000000).toFixed(1)}jt</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Level Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {["bronze", "silver", "gold", "platinum"].map((level) => {
          const count = users.filter(u => u.level === level).length;
          return (
            <Card key={level} className="p-6">
              <div className="flex items-center justify-between mb-2">
                {getLevelBadge(level)}
                <span className="text-2xl">{count}</span>
              </div>
              <p className="text-sm text-gray-600">Member {level}</p>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari user berdasarkan nama, email, atau ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm text-gray-600">User</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Kontak</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Level</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Saldo</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Total Belanja</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Transaksi</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white overflow-hidden">
                        {user.avatar_url ? (
                          <img 
                            src={`http://localhost/NS-topupgames/ns-topup/public${user.avatar_url}`}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.phone}</p>
                  </td>
                  <td className="py-4 px-4">
                    {getLevelBadge(user.level)}
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm">Rp {user.balance.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-green-600">Rp {user.totalSpent.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm">{user.totalTransactions}x</p>
                  </td>
                  <td className="py-4 px-4">
                    {user.status === "active" ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Blocked</Badge>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant={user.status === "active" ? "destructive" : "default"}
                        onClick={() => handleBlockUser(user.id, user.status === "active")}
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus user ${user.name}? Tindakan ini tidak dapat dibatalkan.`)) {
                            handleDeleteUser(user.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada user ditemukan</p>
          </div>
        )}
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail User</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Profile */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl overflow-hidden">
                  {selectedUser.avatar_url ? (
                    <img 
                      src={`http://localhost/NS-topupgames/ns-topup/public${selectedUser.avatar_url}`}
                      alt={selectedUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    selectedUser.name.charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-1">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2">
                    {getLevelBadge(selectedUser.level)}
                    {selectedUser.status === "active" ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Blocked</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">User ID</p>
                  <p>{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Terakhir Aktif</p>
                  <p>{selectedUser.lastActive}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Telepon</p>
                  <p>{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tanggal Bergabung</p>
                  <p>{selectedUser.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Transaksi</p>
                  <p>{selectedUser.totalTransactions}x</p>
                </div>
              </div>

              {/* Financial Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-gray-600 mb-1">Saldo Saat Ini</p>
                  <p className="text-2xl text-blue-600">Rp {selectedUser.balance.toLocaleString()}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Belanja</p>
                  <p className="text-2xl text-green-600">Rp {selectedUser.totalSpent.toLocaleString()}</p>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Gift className="w-4 h-4 mr-2" />
                  Tambah Saldo
                </Button>
                <Button 
                  variant={selectedUser.status === "active" ? "destructive" : "default"}
                  className="flex-1"
                  onClick={() => {
                    handleBlockUser(selectedUser.id, selectedUser.status === "active");
                    setSelectedUser(null);
                  }}
                >
                  <Ban className="w-4 h-4 mr-2" />
                  {selectedUser.status === "active" ? "Block User" : "Unblock User"}
                </Button>
              </div>
              
              <div className="pt-3 border-t">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    if (confirm(`Yakin ingin menghapus user ${selectedUser.name}? Tindakan ini tidak dapat dibatalkan.`)) {
                      handleDeleteUser(selectedUser.id);
                      setSelectedUser(null);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
