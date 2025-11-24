import { useState } from "react";
import { Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, Package } from "lucide-react";
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

interface Product {
  id: string;
  name: string;
  category: string;
  provider: string;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  status: "active" | "inactive";
  stock: number | "unlimited";
  soldToday: number;
}

export function ProductManagement() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data produk
  const products: Product[] = [
    {
      id: "PRD001",
      name: "Mobile Legends 86 Diamonds",
      category: "Game",
      provider: "VIP Reseller",
      buyPrice: 20000,
      sellPrice: 22000,
      profit: 2000,
      status: "active",
      stock: "unlimited",
      soldToday: 45
    },
    {
      id: "PRD002",
      name: "Mobile Legends 172 Diamonds",
      category: "Game",
      provider: "VIP Reseller",
      buyPrice: 40000,
      sellPrice: 43000,
      profit: 3000,
      status: "active",
      stock: "unlimited",
      soldToday: 38
    },
    {
      id: "PRD003",
      name: "Mobile Legends 257 Diamonds",
      category: "Game",
      provider: "VIP Reseller",
      buyPrice: 60000,
      sellPrice: 64000,
      profit: 4000,
      status: "active",
      stock: "unlimited",
      soldToday: 32
    },
    {
      id: "PRD004",
      name: "Free Fire 70 Diamonds",
      category: "Game",
      provider: "Digiflazz",
      buyPrice: 10000,
      sellPrice: 11000,
      profit: 1000,
      status: "active",
      stock: "unlimited",
      soldToday: 52
    },
    {
      id: "PRD005",
      name: "Free Fire 140 Diamonds",
      category: "Game",
      provider: "Digiflazz",
      buyPrice: 20000,
      sellPrice: 22000,
      profit: 2000,
      status: "active",
      stock: "unlimited",
      soldToday: 41
    },
    {
      id: "PRD006",
      name: "PUBG Mobile 60 UC",
      category: "Game",
      provider: "VIP Reseller",
      buyPrice: 15000,
      sellPrice: 16500,
      profit: 1500,
      status: "active",
      stock: "unlimited",
      soldToday: 28
    },
    {
      id: "PRD007",
      name: "Pulsa Telkomsel 10.000",
      category: "Pulsa",
      provider: "Digiflazz",
      buyPrice: 10500,
      sellPrice: 11000,
      profit: 500,
      status: "active",
      stock: "unlimited",
      soldToday: 120
    },
    {
      id: "PRD008",
      name: "Pulsa Telkomsel 25.000",
      category: "Pulsa",
      provider: "Digiflazz",
      buyPrice: 25000,
      sellPrice: 26000,
      profit: 1000,
      status: "active",
      stock: "unlimited",
      soldToday: 89
    },
    {
      id: "PRD009",
      name: "Pulsa XL 50.000",
      category: "Pulsa",
      provider: "Digiflazz",
      buyPrice: 50000,
      sellPrice: 51500,
      profit: 1500,
      status: "active",
      stock: "unlimited",
      soldToday: 45
    },
    {
      id: "PRD010",
      name: "GoPay Rp 50.000",
      category: "E-Wallet",
      provider: "VIP Reseller",
      buyPrice: 50000,
      sellPrice: 51000,
      profit: 1000,
      status: "active",
      stock: "unlimited",
      soldToday: 67
    },
    {
      id: "PRD011",
      name: "OVO Rp 100.000",
      category: "E-Wallet",
      provider: "VIP Reseller",
      buyPrice: 100000,
      sellPrice: 101500,
      profit: 1500,
      status: "active",
      stock: "unlimited",
      soldToday: 34
    },
    {
      id: "PRD012",
      name: "Steam Wallet USD 5",
      category: "Voucher",
      provider: "Digiflazz",
      buyPrice: 75000,
      sellPrice: 80000,
      profit: 5000,
      status: "inactive",
      stock: 0,
      soldToday: 0
    }
  ];

  // Filter produk
  const filteredProducts = products.filter(product => {
    const matchCategory = filterCategory === "all" || product.category === filterCategory;
    const matchSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchCategory && matchSearch;
  });

  // Statistik
  const totalProducts = filteredProducts.length;
  const activeProducts = filteredProducts.filter(p => p.status === "active").length;
  const totalSoldToday = filteredProducts.reduce((sum, p) => sum + p.soldToday, 0);
  const totalProfitToday = filteredProducts.reduce((sum, p) => sum + (p.profit * p.soldToday), 0);

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowAddDialog(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setShowAddDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Manajemen Produk</h1>
          <p className="text-gray-600">Kelola katalog produk topup game, pulsa, dan e-wallet</p>
        </div>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Produk</p>
          <p className="text-3xl">{totalProducts}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Produk Aktif</p>
          <p className="text-3xl text-green-600">{activeProducts}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Terjual Hari Ini</p>
          <p className="text-3xl text-blue-600">{totalSoldToday}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Profit Hari Ini</p>
          <p className="text-3xl text-purple-600">Rp {totalProfitToday.toLocaleString()}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama produk atau ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="Game">Game</SelectItem>
              <SelectItem value="Pulsa">Pulsa</SelectItem>
              <SelectItem value="E-Wallet">E-Wallet</SelectItem>
              <SelectItem value="Voucher">Voucher</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">{product.category}</Badge>
                    <p className="text-xs text-gray-500">{product.id}</p>
                  </div>
                </div>
                {product.status === "active" ? (
                  <ToggleRight className="w-6 h-6 text-green-600" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                )}
              </div>

              {/* Product Name */}
              <h3 className="mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{product.provider}</p>

              {/* Pricing */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Harga Modal</span>
                  <span>Rp {product.buyPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Harga Jual</span>
                  <span>Rp {product.sellPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm">Profit</span>
                  <span className="text-green-600">Rp {product.profit.toLocaleString()}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600">Terjual Hari Ini</p>
                  <p className="text-lg">{product.soldToday}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Stock</p>
                  <p className="text-lg">
                    {product.stock === "unlimited" ? "∞" : product.stock}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleEditProduct(product)}
                  variant="outline" 
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="icon">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada produk ditemukan</p>
          </div>
        </Card>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nama Produk</Label>
                <Input 
                  placeholder="Contoh: Mobile Legends 86 Diamonds"
                  defaultValue={selectedProduct?.name}
                />
              </div>
              <div>
                <Label>Kategori</Label>
                <Select defaultValue={selectedProduct?.category || "Game"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Game">Game</SelectItem>
                    <SelectItem value="Pulsa">Pulsa</SelectItem>
                    <SelectItem value="E-Wallet">E-Wallet</SelectItem>
                    <SelectItem value="Voucher">Voucher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Provider</Label>
                <Select defaultValue={selectedProduct?.provider || "Digiflazz"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Digiflazz">Digiflazz</SelectItem>
                    <SelectItem value="VIP Reseller">VIP Reseller</SelectItem>
                    <SelectItem value="Apigames">Apigames</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select defaultValue={selectedProduct?.status || "active"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Harga Modal (Rp)</Label>
                <Input 
                  type="number"
                  placeholder="20000"
                  defaultValue={selectedProduct?.buyPrice}
                />
              </div>
              <div>
                <Label>Harga Jual (Rp)</Label>
                <Input 
                  type="number"
                  placeholder="22000"
                  defaultValue={selectedProduct?.sellPrice}
                />
              </div>
            </div>

            <div>
              <Label>Deskripsi Produk</Label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Masukkan detail produk, cara pemesanan, dll..."
              />
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
                {selectedProduct ? "Simpan Perubahan" : "Tambah Produk"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
