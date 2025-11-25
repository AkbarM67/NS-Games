import { useState, useEffect } from "react";
import api from "../lib/api";
import { useRealTime } from "../hooks/useRealTime";
import { Plus, Ticket, Gift, Percent, Users, Eye, Edit, Trash2, Copy } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";

interface Promo {
  id: string;
  name: string;
  code: string;
  type: "discount" | "cashback" | "bonus";
  value: number;
  valueType: "percentage" | "fixed";
  minTransaction: number;
  maxDiscount?: number;
  quota: number;
  used: number;
  validFrom: string;
  validUntil: string;
  status: "active" | "inactive" | "expired";
  targetUsers: "all" | "new" | "specific";
}

export function MarketingPromo() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  useRealTime({
    onDashboardUpdate: () => {
      loadPromos();
    }
  });

  useEffect(() => {
    loadPromos();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadPromos, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadPromos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/promos');
      console.log('Load promos response:', response.data);
      if (response.data.success) {
        setPromos(response.data.data);
        console.log('Promos set:', response.data.data);
      }
    } catch (error) {
      console.error('Error loading promos:', error);
      // No fallback data - show empty state
    } finally {
      setLoading(false);
    }
  };

  const getPromoTypeBadge = (type: string) => {
    switch (type) {
      case "discount":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Diskon</Badge>;
      case "cashback":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Cashback</Badge>;
      case "bonus":
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Bonus</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Nonaktif</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Expired</Badge>;
      default:
        return null;
    }
  };

  // Statistics
  const activePromos = promos.filter(p => p.status === "active").length;
  const totalQuota = promos.reduce((sum, p) => sum + (p.quota || 0), 0);
  const totalUsed = promos.reduce((sum, p) => sum + (p.used || 0), 0);
  const usageRate = totalQuota > 0 ? ((totalUsed / totalQuota) * 100).toFixed(1) : '0';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In real app, show toast notification
  };

  const handleEdit = (promo: Promo) => {
    setSelectedPromo(promo);
    setShowAddDialog(true);
  };

  const handleToggle = async (id: string) => {
    try {
      await api.patch(`/admin/promos/${id}/toggle`);
      loadPromos();
    } catch (error) {
      console.error('Error toggling promo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus promo ini?')) {
      // Optimistically remove from UI first
      setPromos(prev => prev.filter(promo => promo.id !== id));
      
      try {
        await api.delete(`/admin/promos/${id}`);
        // Success - data already removed from UI
      } catch (error) {
        console.error('Error deleting promo:', error);
        // If API fails, reload to restore data
        loadPromos();
      }
    }
  };

  const handleSave = async (formData: any) => {
    console.log('Saving promo:', formData);
    try {
      let response;
      if (selectedPromo) {
        response = await api.put(`/admin/promos/${selectedPromo.id}`, formData);
      } else {
        response = await api.post('/admin/promos', formData);
      }
      console.log('Save response:', response.data);
      loadPromos();
      setShowAddDialog(false);
      setSelectedPromo(null);
    } catch (error) {
      console.error('Error saving promo:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Marketing & Promo</h1>
          <p className="text-gray-600">Kelola voucher, diskon, cashback, dan program marketing</p>
        </div>
        <Button onClick={() => {
          setSelectedPromo(null);
          setShowAddDialog(true);
        }} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Buat Promo
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Ticket className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Promo</p>
          <p className="text-3xl">{promos.length}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Promo Aktif</p>
          <p className="text-3xl text-green-600">{activePromos}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Digunakan</p>
          <p className="text-3xl text-purple-600">{(totalUsed || 0).toLocaleString()}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Percent className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Tingkat Penggunaan</p>
          <p className="text-3xl text-orange-600">{usageRate}%</p>
        </Card>
      </div>

      {/* Promo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))
        ) : (
          promos.map((promo) => {
          const usagePercentage = ((promo.used || 0) / (promo.quota || 1)) * 100;
          
          return (
            <Card key={promo.id} className="overflow-hidden">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  {getPromoTypeBadge(promo.type)}
                  {getStatusBadge(promo.status)}
                </div>

                {/* Promo Name */}
                <h3 className="mb-2">{promo.name}</h3>

                {/* Promo Code */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-lg px-4 py-2 font-mono">
                    {promo.code}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(promo.code)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                {/* Promo Value */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Nilai Promo</p>
                  <p className="text-xl">
                    {(promo.value_type || promo.valueType) === "percentage" 
                      ? `${promo.value || 0}%` 
                      : `Rp ${(promo.value || 0).toLocaleString()}`
                    }
                  </p>
                  {(promo.minTransaction || 0) > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Min. transaksi: Rp {(promo.minTransaction || 0).toLocaleString()}
                    </p>
                  )}
                  {promo.maxDiscount && (
                    <p className="text-xs text-gray-500">
                      Max. diskon: Rp {(promo.maxDiscount || 0).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Usage Stats */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Kuota</span>
                    <span>{promo.used || 0} / {promo.quota || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        usagePercentage >= 90 ? "bg-red-600" :
                        usagePercentage >= 70 ? "bg-yellow-600" :
                        "bg-green-600"
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Validity */}
                <div className="mb-4 text-sm text-gray-600">
                  <p>Berlaku: {promo.validFrom} s/d {promo.validUntil}</p>
                  <p>Target: {promo.targetUsers === "all" ? "Semua User" : promo.targetUsers === "new" ? "User Baru" : "User Khusus"}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedPromo(promo)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Detail
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleEdit(promo)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleToggle(promo.id)}
                    className={promo.status === 'active' ? 'text-green-600' : 'text-gray-600'}
                  >
                    {promo.status === 'active' ? '✓' : '✗'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDelete(promo.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })
        )}
      </div>

      {/* Referral Program Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="mb-2">Program Referral</h3>
            <p className="text-sm text-gray-600">Ajak teman dan dapatkan bonus untuk setiap transaksi mereka</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Gift className="w-4 h-4 mr-2" />
            Kelola Referral
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Bonus Per Referral</p>
            <p className="text-2xl text-purple-600">Rp 10.000</p>
            <p className="text-xs text-gray-500 mt-2">untuk pemberi referral</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Bonus User Baru</p>
            <p className="text-2xl text-green-600">Rp 5.000</p>
            <p className="text-xs text-gray-500 mt-2">untuk user yang daftar</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Referral Bulan Ini</p>
            <p className="text-2xl text-blue-600">342</p>
            <p className="text-xs text-gray-500 mt-2">user baru bergabung</p>
          </div>
        </div>
      </Card>

      {/* Create Promo Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPromo ? 'Edit Promo' : 'Buat Promo Baru'}</DialogTitle>
            <DialogDescription>
              {selectedPromo ? 'Edit informasi promo yang sudah ada' : 'Buat promo baru untuk pelanggan'}
            </DialogDescription>
          </DialogHeader>
          
          <form className="space-y-4">
            <div>
              <Label>Nama Promo</Label>
              <Input name="name" placeholder="Contoh: Flash Sale 20%" defaultValue={selectedPromo?.name || ''} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kode Promo</Label>
                <Input name="code" placeholder="FLASH20" defaultValue={selectedPromo?.code || ''} />
              </div>
              <div>
                <Label>Tipe Promo</Label>
                <select name="type" className="w-full p-2 border rounded" defaultValue={selectedPromo?.type || 'discount'} key={selectedPromo?.id || 'new'}>
                  <option value="discount">Diskon</option>
                  <option value="cashback">Cashback</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nilai</Label>
                <Input name="value" type="number" min="0" placeholder="10" defaultValue={selectedPromo?.value || ''} key={selectedPromo?.id || 'new'} />
              </div>
              <div>
                <Label>Tipe Nilai</Label>
                <select name="valueType" className="w-full p-2 border rounded" defaultValue={selectedPromo?.value_type || 'percentage'} key={selectedPromo?.id || 'new'}>
                  <option value="percentage">Persentase (%)</option>
                  <option value="fixed">Nominal (Rp)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min. Transaksi (Rp)</Label>
                <Input name="minTransaction" type="number" min="0" placeholder="50000" defaultValue={selectedPromo?.min_transaction || ''} key={selectedPromo?.id || 'new'} />
              </div>
              <div>
                <Label>Max. Diskon (Rp)</Label>
                <Input name="maxDiscount" type="number" min="0" placeholder="20000" defaultValue={selectedPromo?.max_discount || ''} key={selectedPromo?.id || 'new'} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kuota</Label>
                <Input name="quota" type="number" min="1" placeholder="1000" defaultValue={selectedPromo?.quota || ''} key={selectedPromo?.id || 'new'} />
              </div>
              <div>
                <Label>Target User</Label>
                <select name="targetUsers" className="w-full p-2 border rounded" defaultValue={selectedPromo?.target_users || 'all'} key={selectedPromo?.id || 'new'}>
                  <option value="all">Semua User</option>
                  <option value="new">User Baru</option>
                  <option value="existing">User Existing</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Berlaku Dari</Label>
                <Input name="validFrom" type="date" defaultValue={selectedPromo?.valid_from ? new Date(selectedPromo.valid_from).toISOString().split('T')[0] : ''} />
              </div>
              <div>
                <Label>Berlaku Sampai</Label>
                <Input name="validUntil" type="date" defaultValue={selectedPromo?.valid_until ? new Date(selectedPromo.valid_until).toISOString().split('T')[0] : ''} />
              </div>
            </div>

            <div>
              <Label>Deskripsi</Label>
              <Input name="description" placeholder="Deskripsi promo" defaultValue={selectedPromo?.description || ''} />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => setShowAddDialog(false)}
                variant="outline" 
                className="flex-1"
              >
                Batal
              </Button>
              <Button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget.closest('form') as HTMLFormElement;
                  if (form) {
                    const formData = new FormData(form);
                    const data = {
                      name: formData.get('name'),
                      code: formData.get('code'),
                      type: formData.get('type'),
                      value: Number(formData.get('value')),
                      valueType: formData.get('valueType'),
                      minTransaction: Number(formData.get('minTransaction')) || 0,
                      maxDiscount: Number(formData.get('maxDiscount')) || null,
                      quota: Number(formData.get('quota')),
                      validFrom: formData.get('validFrom'),
                      validUntil: formData.get('validUntil'),
                      targetUsers: formData.get('targetUsers'),
                      description: formData.get('description')
                    };
                    console.log('Form data:', data);
                    handleSave(data);
                  }
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {selectedPromo ? 'Update Promo' : 'Buat Promo'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Promo Detail Dialog */}
      <Dialog open={!!selectedPromo && !showAddDialog} onOpenChange={() => setSelectedPromo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Promo</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang promo yang dipilih
            </DialogDescription>
          </DialogHeader>
          
          {selectedPromo && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl">{selectedPromo.name}</h3>
                <div className="flex gap-2">
                  {getPromoTypeBadge(selectedPromo.type)}
                  {getStatusBadge(selectedPromo.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kode Promo</p>
                  <p className="font-mono text-lg">{selectedPromo.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nilai Promo</p>
                  <p className="text-lg">
                    {(selectedPromo.value_type || selectedPromo.valueType) === "percentage" 
                      ? `${selectedPromo.value || 0}%` 
                      : `Rp ${(selectedPromo.value || 0).toLocaleString()}`
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Min. Transaksi</p>
                  <p>Rp {(selectedPromo.min_transaction || selectedPromo.minTransaction || 0).toLocaleString()}</p>
                </div>
                {selectedPromo.maxDiscount && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Max. Diskon</p>
                    <p>Rp {(selectedPromo.max_discount || selectedPromo.maxDiscount || 0).toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kuota</p>
                  <p>{(selectedPromo.quota || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Telah Digunakan</p>
                  <p>{(selectedPromo.used || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Berlaku Dari</p>
                  <p>{selectedPromo.validFrom}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Berlaku Sampai</p>
                  <p>{selectedPromo.validUntil}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Progress Kuota</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ width: `${((selectedPromo.used || 0) / (selectedPromo.quota || 1)) * 100}%` }}
                  >
                    {(((selectedPromo.used || 0) / (selectedPromo.quota || 1)) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
