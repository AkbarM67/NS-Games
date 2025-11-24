import { useState, useEffect } from "react";
import api from "../lib/api";
import { Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, Package } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRealTime } from "../hooks/useRealTime";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";

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
}

export function ProductManagement() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [rawProducts, setRawProducts] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    game_id: '',
    product_name: '',
    amount: '',
    price: '',
    base_price: '',
    sku_code: ''
  });

  useRealTime({
    onDashboardUpdate: () => {
      fetchProducts();
    }
  });

  useEffect(() => {
    fetchProducts();
    fetchGames();
    
    // Auto refresh every 5 minutes (to avoid rate limiting)
    const interval = setInterval(() => {
      fetchProducts();
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // First try to get local products (synced from Digiflazz)
      console.log('Fetching products from local database');
      const response = await api.get('/products');
      
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        // Data already transformed from backend
        const transformedProducts = response.data.data.map((item: any) => ({
          id: item.sku_code,
          name: item.name,
          category: item.category,
          provider: item.provider,
          buyPrice: item.base_price,
          sellPrice: item.price,
          profit: item.profit,
          status: item.is_active ? 'active' : 'inactive',
          stock: item.stock === -1 ? 'unlimited' : item.stock,
          db_id: item.id
        }));
        setProducts(transformedProducts);
        console.log(`Loaded ${transformedProducts.length} products from database`);
      } else {
        // If no local products, use demo data
        console.log('No local products found, using demo data');
        setProducts(getDemoProducts());
        toast.info('Tidak ada produk di database. Gunakan tombol "Sync Digiflazz" untuk mengambil data.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(getDemoProducts());
      toast.info('Menggunakan data demo produk');
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackProducts = async () => {
    try {
      const fallbackResponse = await api.get('/products');
      if (fallbackResponse.data.success) {
        setProducts(fallbackResponse.data.data);
        toast.info('Menggunakan data produk lokal');
      } else {
        // Use demo data if no local products
        setProducts(getDemoProducts());
        toast.info('Menggunakan data demo produk');
      }
    } catch (fallbackError) {
      console.error('Fallback products error:', fallbackError);
      setProducts(getDemoProducts());
      toast.info('Menggunakan data demo produk');
    }
  };

  const getDemoProducts = (): Product[] => [
    {
      id: 'ML86',
      name: 'Mobile Legends 86 Diamond',
      category: 'Game',
      provider: 'Demo',
      buyPrice: 20000,
      sellPrice: 22000,
      profit: 2000,
      status: 'active',
      stock: 'unlimited',

    },
    {
      id: 'FF70',
      name: 'Free Fire 70 Diamond',
      category: 'Game', 
      provider: 'Demo',
      buyPrice: 10000,
      sellPrice: 11000,
      profit: 1000,
      status: 'active',
      stock: 'unlimited',

    },
    {
      id: 'PUBG60',
      name: 'PUBG Mobile 60 UC',
      category: 'Game',
      provider: 'Demo',
      buyPrice: 15000,
      sellPrice: 16500,
      profit: 1500,
      status: 'active',
      stock: 'unlimited',

    }
  ];

  const fetchGames = async () => {
    try {
      const response = await api.get('/admin/games');
      if (response.data.success) {
        setGames(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleSaveProduct = async () => {
    try {
      if (selectedProduct) {
        const updateResponse = await api.put(`/admin/products/${selectedProduct.db_id}`, formData);
        if (updateResponse.data.success) {
          toast.success('Produk berhasil diupdate');
        }
      } else {
        // Create new product
        const response = await api.post('/admin/products', formData);
        if (response.data.success) {
          toast.success('Produk berhasil ditambahkan');
        }
      }
      
      setShowAddDialog(false);
      fetchProducts();
      setFormData({
        game_id: '',
        product_name: '',
        amount: '',
        price: '',
        base_price: '',
        sku_code: ''
      });
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Gagal menyimpan produk');
    }
  };

  const handleDeleteProduct = async (product: any) => {
    if (!product.db_id) {
      toast.error('Produk dari Digiflazz tidak bisa dihapus. Gunakan sync untuk update data.');
      return;
    }
    
    if (!confirm(`Yakin ingin menghapus produk "${product.name}"?`)) return;
    
    try {
      const deleteResponse = await api.delete(`/admin/products/${product.db_id}`);
      if (deleteResponse.data.success) {
        toast.success('Produk berhasil dihapus');
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Gagal menghapus produk');
    }
  };

  const handleSyncProducts = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await api.post('/admin/products/sync');
      if (response.data.success) {
        toast.success('Sinkronisasi produk berhasil!');
        fetchProducts(); // Refresh products after sync
      } else {
        toast.error(response.data.message || 'Gagal sinkronisasi produk');
      }
    } catch (error) {
      console.error('Error syncing products:', error);
      toast.error('Gagal sinkronisasi produk dari Digiflazz');
    } finally {
      setLoading(false);
    }
  };



  // Filter produk
  const filteredProducts = products.filter(product => {
    const matchCategory = filterCategory === "all" || product.category === filterCategory;
    const matchSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchCategory && matchSearch;
  });

  // Statistik realtime
  const totalProducts = filteredProducts.length;
  const activeProducts = filteredProducts.filter(p => p.status === "active").length;

  const handleEditProduct = async (product: any) => {
    if (!product.db_id) {
      toast.error('Produk dari Digiflazz tidak bisa diedit. Gunakan sync untuk update data.');
      return;
    }
    
    try {
      const response = await api.get(`/products/${product.db_id}`);
      if (response.data.success) {
        const dbProduct = response.data.data;
        setSelectedProduct(product);
        setFormData({
          game_id: dbProduct.game?.id?.toString() || '',
          product_name: dbProduct.name || '',
          amount: dbProduct.amount?.toString() || '',
          price: dbProduct.price?.toString() || '',
          base_price: dbProduct.base_price?.toString() || '',
          sku_code: dbProduct.sku_code || ''
        });
        setShowAddDialog(true);
      } else {
        toast.error('Produk tidak ditemukan di database');
      }
    } catch (error) {
      console.error('Error loading product for edit:', error);
      toast.error('Gagal memuat data produk');
    }
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setFormData({
      game_id: '',
      product_name: '',
      amount: '',
      price: '',
      base_price: '',
      sku_code: ''
    });
    setShowAddDialog(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Manajemen Produk</h1>
          <p className="text-gray-600">Kelola katalog produk topup game, pulsa, dan e-wallet</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSyncProducts} 
            variant="outline"
            disabled={loading}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Package className="w-4 h-4 mr-2" />
            {loading ? 'Sinkronisasi...' : 'Sync Digiflazz'}
          </Button>
          <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Produk
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Produk</p>
          <p className="text-3xl">{totalProducts}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Produk Aktif</p>
          <p className="text-3xl text-green-600">{activeProducts}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Sumber Data</p>
          <div className="flex items-center gap-2">
            <Badge variant={products.some(p => p.provider === 'digiflazz') ? 'default' : 'secondary'}>
              {products.some(p => p.provider === 'digiflazz') ? 'Digiflazz' : 'Lokal'}
            </Badge>
          </div>
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
              <div className="flex items-center justify-center mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
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
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleDeleteProduct(product)}
                >
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
                <Label>Game</Label>
                <Select 
                  value={formData.game_id} 
                  onValueChange={(value) => handleInputChange('game_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Game" />
                  </SelectTrigger>
                  <SelectContent>
                    {games.map((game) => (
                      <SelectItem key={game.id} value={game.id.toString()}>
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nama Produk</Label>
                <Input 
                  placeholder="Contoh: 86 Diamonds"
                  value={formData.product_name}
                  onChange={(e) => handleInputChange('product_name', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Amount/Jumlah</Label>
                <Input 
                  type="number"
                  placeholder="86"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                />
              </div>
              <div>
                <Label>SKU Code</Label>
                <Input 
                  placeholder="ML_86"
                  value={formData.sku_code}
                  onChange={(e) => handleInputChange('sku_code', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Harga Modal (Rp)</Label>
                <Input 
                  type="number"
                  placeholder="20000"
                  value={formData.base_price}
                  onChange={(e) => handleInputChange('base_price', e.target.value)}
                />
              </div>
              <div>
                <Label>Harga Jual (Rp)</Label>
                <Input 
                  type="number"
                  placeholder="22000"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                />
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
                onClick={handleSaveProduct}
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
