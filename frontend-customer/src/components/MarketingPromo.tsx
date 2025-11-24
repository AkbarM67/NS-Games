import { useState } from "react";
import { Plus, Ticket, Gift, Percent, Users, Eye, Edit, Trash2, Copy } from "lucide-react";
import { Card } from "./SimpleUI";
import { Badge } from "./SimpleUI";
import { Button } from "./SimpleUI";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./SimpleUI";
import { Input } from "./SimpleUI";
import { Label } from "./SimpleUI";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./SimpleUI";

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

  // Mock data promo
  const promos: Promo[] = [
    {
      id: "PROMO001",
      name: "Diskon 10% All Products",
      code: "TOPUP10",
      type: "discount",
      value: 10,
      valueType: "percentage",
      minTransaction: 50000,
      maxDiscount: 20000,
      quota: 1000,
      used: 450,
      validFrom: "2025-01-01",
      validUntil: "2025-01-31",
      status: "active",
      targetUsers: "all"
    },
    {
      id: "PROMO002",
      name: "Cashback Rp 5.000",
      code: "CASHBACK5K",
      type: "cashback",
      value: 5000,
      valueType: "fixed",
      minTransaction: 100000,
      quota: 500,
      used: 320,
      validFrom: "2025-01-15",
      validUntil: "2025-02-15",
      status: "active",
      targetUsers: "all"
    },
    {
      id: "PROMO003",
      name: "Welcome Bonus New Member",
      code: "WELCOME2025",
      type: "bonus",
      value: 10000,
      valueType: "fixed",
      minTransaction: 0,
      quota: 10000,
      used: 3250,
      validFrom: "2025-01-01",
      validUntil: "2025-12-31",
      status: "active",
      targetUsers: "new"
    },
    {
      id: "PROMO004",
      name: "Flash Sale 20%",
      code: "FLASH20",
      type: "discount",
      value: 20,
      valueType: "percentage",
      minTransaction: 200000,
      maxDiscount: 50000,
      quota: 100,
      used: 100,
      validFrom: "2025-01-10",
      validUntil: "2025-01-11",
      status: "expired",
      targetUsers: "all"
    },
    {
      id: "PROMO005",
      name: "Diskon 15% Mobile Legends",
      code: "ML15",
      type: "discount",
      value: 15,
      valueType: "percentage",
      minTransaction: 75000,
      maxDiscount: 30000,
      quota: 750,
      used: 580,
      validFrom: "2025-01-01",
      validUntil: "2025-01-31",
      status: "active",
      targetUsers: "all"
    },
    {
      id: "PROMO006",
      name: "Cashback Weekend",
      code: "WEEKEND10K",
      type: "cashback",
      value: 10000,
      valueType: "fixed",
      minTransaction: 150000,
      quota: 200,
      used: 95,
      validFrom: "2025-01-25",
      validUntil: "2025-01-26",
      status: "active",
      targetUsers: "all"
    }
  ];

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
  const totalQuota = promos.reduce((sum, p) => sum + p.quota, 0);
  const totalUsed = promos.reduce((sum, p) => sum + p.used, 0);
  const usageRate = ((totalUsed / totalQuota) * 100).toFixed(1);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In real app, show toast notification
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Marketing & Promo</h1>
          <p className="text-gray-600">Kelola voucher, diskon, cashback, dan program marketing</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
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
          <p className="text-3xl text-purple-600">{totalUsed.toLocaleString()}</p>
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
        {promos.map((promo) => {
          const usagePercentage = (promo.used / promo.quota) * 100;
          
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
                    {promo.valueType === "percentage" 
                      ? `${promo.value}%` 
                      : `Rp ${promo.value.toLocaleString()}`
                    }
                  </p>
                  {promo.minTransaction > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Min. transaksi: Rp {promo.minTransaction.toLocaleString()}
                    </p>
                  )}
                  {promo.maxDiscount && (
                    <p className="text-xs text-gray-500">
                      Max. diskon: Rp {promo.maxDiscount.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Usage Stats */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Kuota</span>
                    <span>{promo.used} / {promo.quota}</span>
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
                  <Button variant="outline" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
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
            <DialogTitle>Buat Promo Baru</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Nama Promo</Label>
              <Input placeholder="Contoh: Flash Sale 20%" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kode Promo</Label>
                <Input placeholder="FLASH20" />
              </div>
              <div>
                <Label>Tipe Promo</Label>
                <Select defaultValue="discount">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount">Diskon</SelectItem>
                    <SelectItem value="cashback">Cashback</SelectItem>
                    <SelectItem value="bonus">Bonus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nilai</Label>
                <Input type="number" placeholder="10" />
              </div>
              <div>
                <Label>Tipe Nilai</Label>
                <Select defaultValue="percentage">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Persentase (%)</SelectItem>
                    <SelectItem value="fixed">Nominal (Rp)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min. Transaksi (Rp)</Label>
                <Input type="number" placeholder="50000" />
              </div>
              <div>
                <Label>Max. Diskon (Rp)</Label>
                <Input type="number" placeholder="20000" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kuota</Label>
                <Input type="number" placeholder="1000" />
              </div>
              <div>
                <Label>Target User</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua User</SelectItem>
                    <SelectItem value="new">User Baru</SelectItem>
                    <SelectItem value="specific">User Khusus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Berlaku Dari</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Berlaku Sampai</Label>
                <Input type="date" />
              </div>
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
                onClick={() => setShowAddDialog(false)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Buat Promo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Promo Detail Dialog */}
      <Dialog open={!!selectedPromo} onOpenChange={() => setSelectedPromo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Promo</DialogTitle>
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
                    {selectedPromo.valueType === "percentage" 
                      ? `${selectedPromo.value}%` 
                      : `Rp ${selectedPromo.value.toLocaleString()}`
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Min. Transaksi</p>
                  <p>Rp {selectedPromo.minTransaction.toLocaleString()}</p>
                </div>
                {selectedPromo.maxDiscount && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Max. Diskon</p>
                    <p>Rp {selectedPromo.maxDiscount.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kuota</p>
                  <p>{selectedPromo.quota.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Telah Digunakan</p>
                  <p>{selectedPromo.used.toLocaleString()}</p>
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
                    style={{ width: `${(selectedPromo.used / selectedPromo.quota) * 100}%` }}
                  >
                    {((selectedPromo.used / selectedPromo.quota) * 100).toFixed(0)}%
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
