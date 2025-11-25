import { useState, useEffect } from "react";
import { Search, Filter, Star, ChevronRight, Smartphone } from "lucide-react";
import { Card } from "../SimpleUI";
import { Badge } from "../SimpleUI";
import { Button } from "../SimpleUI";
import { Input } from "../SimpleUI";
import { Label } from "../SimpleUI";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../SimpleUI";
import api from "../../lib/api";
import { useRealTime } from "../../hooks/useRealTime";
import { GameDetail } from "./GameDetail";
import { OrderPage } from "./OrderPage";

interface ProductCatalogProps {
  setActivePage: (page: string) => void;
}

interface Game {
  id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  rating: number;
  players: string;
  productCount: number;
}

export function ProductCatalog({ setActivePage }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'games' | 'products' | 'order'>('games');
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [detectedProvider, setDetectedProvider] = useState<string | null>(null);
  const [ewalletInput, setEwalletInput] = useState("");
  const [ewalletNumber, setEwalletNumber] = useState("");
  const [checkedUser, setCheckedUser] = useState<{name: string, service: string} | null>(null);
  const [selectedEwallet, setSelectedEwallet] = useState<string>("");

  // Provider detection function
  const detectProvider = (phone: string) => {
    if (phone.length < 4) return null;
    
    const prefixes = {
      'Telkomsel': ['0811', '0812', '0813', '0821', '0822', '0823', '0851', '0852', '0853'],
      'Indosat': ['0814', '0815', '0816', '0855', '0856', '0857', '0858'],
      'XL': ['0817', '0818', '0819', '0859', '0877', '0878'],
      'Tri': ['0895', '0896', '0897', '0898', '0899'],
      'Smartfren': ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888'],
      'Axis': ['0831', '0832', '0833', '0838']
    };
    
    for (const [provider, codes] of Object.entries(prefixes)) {
      for (const code of codes) {
        if (phone.startsWith(code)) {
          return provider;
        }
      }
    }
    
    return 'Unknown';
  };

  // Real-time WebSocket connection
  useRealTime({
    onProductUpdate: (updatedProduct) => {
      console.log('Product updated:', updatedProduct);
      // Refresh products when admin updates them
      fetchProducts();
    }
  });

  useEffect(() => {
    fetchGames();
    fetchProducts();
    fetchPopularGames();
    
    // Auto-refresh every 30 seconds as fallback
    const interval = setInterval(() => {
      fetchGames();
      fetchProducts();
      fetchPopularGames();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      
      if (response.data.success && response.data.data.length > 0) {
        const customerProducts = response.data.data.map((product: any) => {
          let category = "game";
          if (product.category === "Pulsa" || product.name.toLowerCase().includes('pulsa')) category = "pulsa";
          else if (product.category === "E-Wallet" || product.name.toLowerCase().includes('gopay') || product.name.toLowerCase().includes('ovo') || product.name.toLowerCase().includes('dana')) category = "ewallet";
          
          return {
            id: product.id.toString(),
            name: product.name,
            item: product.name,
            category: category,
            price: parseFloat(product.sellPrice || product.price || 0),
            originalPrice: parseFloat(product.sellPrice || product.price || 0) * 1.1,
            image: product.image,
            rating: 4.8,
            sold: Math.floor(Math.random() * 50) + 10,
            gameId: product.gameId || product.id,
            productId: product.id
          };
        });
        setProducts(customerProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await api.get('/games');
      if (response.data.success) {
        setGames(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchPopularGames = async () => {
    try {
      const response = await api.get('/analytics/popular-games');
      if (response.data.success) {
        setPopularGames(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching popular games:', error);
    }
  };

  // Use real products from API
  const displayProducts = products;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  console.log('Frontend Customer: Final products state:', products);

  // Filter products
  const filteredProducts = displayProducts.filter(product => {
    const matchCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.item.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchCategory && matchSearch;
  });

  console.log('Frontend Customer: Filtered products:', filteredProducts);

  const getDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  // Handle game selection
  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
    setView('products');
  };

  // Handle product selection
  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    // Store selected product in localStorage for OrderPage
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    setView('order');
    setActivePage('order');
  };

  // Handle back to games
  const handleBackToGames = () => {
    setSelectedGame(null);
    setView('games');
  };

  // Check e-wallet user name
  const checkEwalletUser = (phone: string) => {
    if (phone.length < 8) return null;
    
    // Mock user data
    const mockUsers = {
      '08123456789': { name: 'John Doe', service: 'DANA' },
      '08234567890': { name: 'Jane Smith', service: 'OVO' },
      '08345678901': { name: 'Ahmad Budi', service: 'GoPay' },
    };
    
    return mockUsers[phone] || { name: 'User Tidak Ditemukan', service: 'Unknown' };
  };

  // Render based on current view
  if (view === 'products' && selectedGame) {
    return (
      <GameDetail 
        gameId={selectedGame}
        onBack={handleBackToGames}
        onSelectProduct={handleProductSelect}
      />
    );
  }

  if (view === 'order' && selectedProduct) {
    return <OrderPage />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Katalog Produk</h1>
        <p className="text-gray-600">Pilih produk yang kamu butuhkan</p>
      </div>

      {/* Search & Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari game, pulsa, atau e-wallet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-8">
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 grid grid-cols-4 w-full">
          <button 
            onClick={() => setSelectedCategory("all")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
              selectedCategory === "all" ? "bg-white shadow-sm" : "hover:bg-white hover:shadow-sm"
            }`}
          >
            Semua
          </button>
          <button 
            onClick={() => setSelectedCategory("game")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
              selectedCategory === "game" ? "bg-white shadow-sm" : "hover:bg-white hover:shadow-sm"
            }`}
          >
            Game
          </button>
          <button 
            onClick={() => setSelectedCategory("pulsa")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
              selectedCategory === "pulsa" ? "bg-white shadow-sm" : "hover:bg-white hover:shadow-sm"
            }`}
          >
            Pulsa
          </button>
          <button 
            onClick={() => setSelectedCategory("ewallet")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
              selectedCategory === "ewallet" ? "bg-white shadow-sm" : "hover:bg-white hover:shadow-sm"
            }`}
          >
            E-Wallet
          </button>
        </div>
      </div>

      {/* Games Grid */}
      {(selectedCategory === "all" || selectedCategory === "game") && (
        <div className={selectedCategory === "all" ? "mb-12" : ""}>
          <h2 className="text-2xl mb-6">Game Populer</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games
              .filter(game => 
                searchQuery === "" || 
                game.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((game) => (
                <Card 
                  key={game.id}
                  onClick={() => handleGameSelect(game.id)}
                  className="overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  {/* Game Image */}
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                    {game.image && (game.image.startsWith('http') || game.image.startsWith('/')) ? (
                      <img 
                        src={game.image}
                        alt={game.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling!.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`text-6xl ${game.image && (game.image.startsWith('http') || game.image.startsWith('/')) ? 'hidden' : ''}`}>
                      {game.image && !game.image.startsWith('http') && !game.image.startsWith('/') ? game.image : "🎮"}
                    </div>
                  </div>
                  
                  {/* Game Info */}
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{game.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{game.category}</p>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{game.description}</p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{game.rating}</span>
                      </div>
                      <span>{game.players}</span>
                    </div>
                    
                    <Button size="sm" className="w-full">
                      {game.productCount} Produk
                    </Button>
                  </div>
                </Card>
              ))
            }
          </div>
        </div>
      )}

      {/* Pulsa Section with Phone Input */}
      {selectedCategory === "pulsa" && (
        <div>
          <h2 className="text-2xl mb-6">Pulsa & Paket Data</h2>
          
          {/* Phone Number Input */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3>Masukkan Nomor Telepon</h3>
                <p className="text-sm text-gray-600">Nomor akan otomatis terdeteksi providernya</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="08123456789"
                  value={phoneInput}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setPhoneInput(value);
                    detectProvider(value);
                  }}
                  className="text-lg"
                />
              </div>
              <Button 
                onClick={() => {
                  if (phoneInput.length >= 4) {
                    setPhoneNumber(phoneInput);
                    setDetectedProvider(detectProvider(phoneInput));
                  }
                }}
                disabled={phoneInput.length < 4}
              >
                Cek Provider
              </Button>
            </div>
            
            {detectedProvider && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Provider Terdeteksi: {detectedProvider}</p>
                    <p className="text-sm text-blue-700">Nomor: {phoneInput}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
          
          {/* Pulsa Products */}
          {detectedProvider && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts
                .filter(product => {
                  if (product.category !== "pulsa") return false;
                  
                  // Match provider name in product name
                  const productName = product.name.toLowerCase();
                  const provider = detectedProvider.toLowerCase();
                  
                  // Check for exact provider match or common variations
                  if (provider === 'telkomsel' && productName.includes('telkomsel')) return true;
                  if (provider === 'indosat' && (productName.includes('indosat') || productName.includes('im3'))) return true;
                  if (provider === 'xl' && (productName.includes('xl') || productName.includes('axis'))) return true;
                  if (provider === 'tri' && (productName.includes('tri') || productName.includes('three'))) return true;
                  if (provider === 'smartfren' && productName.includes('smartfren')) return true;
                  if (provider === 'axis' && (productName.includes('axis') || productName.includes('xl'))) return true;
                  
                  return false;
                })
                .map((product) => {
                  const discount = getDiscount(product.originalPrice, product.price);
                  
                  return (
                    <Card 
                      key={product.id}
                      onClick={() => {
                        const productWithPhone = { ...product, phoneNumber: phoneInput };
                        localStorage.setItem('selectedProduct', JSON.stringify(productWithPhone));
                        setActivePage("order");
                      }}
                      className="overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                      <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                        <div className="text-6xl">📱</div>
                        {discount > 0 && (
                          <Badge className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-500">
                            -{discount}%
                          </Badge>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-sm mb-1 line-clamp-2">{product.name}</h3>
                        <p className="text-xs text-gray-600 mb-3">Pulsa</p>
                        
                        <div className="mb-3">
                          {discount > 0 && (
                            <p className="text-xs text-gray-400 line-through mb-1">
                              Rp {product.originalPrice.toLocaleString()}
                            </p>
                          )}
                          <p className="text-lg text-blue-600">
                            Rp {product.price.toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}</span>
                          </div>
                          <span>{product.sold} terjual</span>
                        </div>
                      </div>
                    </Card>
                  );
                })
              }
            </div>
          )}
          
          {!detectedProvider && (
            <div className="text-center py-8">
              <p className="text-gray-500">Masukkan nomor telepon untuk melihat produk pulsa</p>
            </div>
          )}
          
          {detectedProvider && filteredProducts.filter(product => {
            if (product.category !== "pulsa") return false;
            const productName = product.name.toLowerCase();
            const provider = detectedProvider.toLowerCase();
            if (provider === 'telkomsel' && productName.includes('telkomsel')) return true;
            if (provider === 'indosat' && (productName.includes('indosat') || productName.includes('im3'))) return true;
            if (provider === 'xl' && (productName.includes('xl') || productName.includes('axis'))) return true;
            if (provider === 'tri' && (productName.includes('tri') || productName.includes('three'))) return true;
            if (provider === 'smartfren' && productName.includes('smartfren')) return true;
            if (provider === 'axis' && (productName.includes('axis') || productName.includes('xl'))) return true;
            return false;
          }).length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada produk pulsa {detectedProvider} tersedia</p>
              <p className="text-xs text-gray-400 mt-2">Coba dengan nomor provider lain</p>
            </div>
          )}
        </div>
      )}
      
      {/* E-wallet Section with Phone Input */}
      {selectedCategory === "ewallet" && (
        <div>
          <h2 className="text-2xl mb-6">E-Wallet Top Up</h2>
          
          {/* Phone Number Input */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3>Pilih Layanan E-Wallet</h3>
                <p className="text-sm text-gray-600">Pilih layanan yang ingin di top-up</p>
              </div>
            </div>
            
            {/* E-wallet Service Selection */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setSelectedEwallet('DANA')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedEwallet === 'DANA' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💳</div>
                  <p className="font-medium">DANA</p>
                </div>
              </button>
              
              <button
                onClick={() => setSelectedEwallet('OVO')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedEwallet === 'OVO' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🟣</div>
                  <p className="font-medium">OVO</p>
                </div>
              </button>
              
              <button
                onClick={() => setSelectedEwallet('GoPay')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedEwallet === 'GoPay' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🟢</div>
                  <p className="font-medium">GoPay</p>
                </div>
              </button>
            </div>
            
            {selectedEwallet && (
              <div>
                <div className="mb-2">
                  <span className="text-sm font-medium">Nomor {selectedEwallet}</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input 
                      placeholder="08123456789"
                      value={ewalletInput}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setEwalletInput(value);
                      }}
                      className="text-lg"
                    />
                  </div>
                  <Button 
                    onClick={async () => {
                      if (ewalletInput.length >= 8) {
                        try {
                          const response = await api.post('/ewallet/check-name', {
                            phone: ewalletInput,
                            service: selectedEwallet
                          });
                          
                          if (response.data.success) {
                            setCheckedUser({
                              name: response.data.data.name,
                              service: selectedEwallet
                            });
                            setEwalletNumber(ewalletInput);
                          } else {
                            alert(response.data.message);
                            setCheckedUser(null);
                          }
                        } catch (error) {
                          console.error('Error checking name:', error);
                          alert('Gagal mengecek nama pengguna');
                          setCheckedUser(null);
                        }
                      }
                    }}
                    disabled={ewalletInput.length < 8}
                  >
                    Cek Nama
                  </Button>
                </div>
              </div>
            )}
            
            {checkedUser && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Nama: {checkedUser.name}</p>
                    <p className="text-sm text-green-700">Nomor: {ewalletNumber} | Layanan: {checkedUser.service}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
          
          {/* E-wallet Products */}
          {checkedUser && checkedUser.name !== 'User Tidak Ditemukan' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts
                .filter(product => {
                  if (product.category !== "ewallet") return false;
                  if (product.name.toLowerCase().includes('cek nama pengguna')) return false;
                  
                  // Filter by selected service
                  const productName = product.name.toLowerCase();
                  const service = selectedEwallet.toLowerCase();
                  
                  if (service === 'dana' && productName.includes('dana')) return true;
                  if (service === 'ovo' && productName.includes('ovo')) return true;
                  if (service === 'gopay' && (productName.includes('gopay') || productName.includes('go pay'))) return true;
                  
                  return false;
                })
                .map((product) => {
                  const discount = getDiscount(product.originalPrice, product.price);
                  
                  return (
                    <Card 
                      key={product.id}
                      onClick={() => {
                        const productWithPhone = { ...product, phoneNumber: ewalletNumber, userName: checkedUser.name };
                        localStorage.setItem('selectedProduct', JSON.stringify(productWithPhone));
                        setActivePage("order");
                      }}
                      className="overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                      <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                        <div className="text-6xl">💳</div>
                        {discount > 0 && (
                          <Badge className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-500">
                            -{discount}%
                          </Badge>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-sm mb-1 line-clamp-2">{product.name}</h3>
                        <p className="text-xs text-gray-600 mb-3">E-Wallet</p>
                        
                        <div className="mb-3">
                          {discount > 0 && (
                            <p className="text-xs text-gray-400 line-through mb-1">
                              Rp {product.originalPrice.toLocaleString()}
                            </p>
                          )}
                          <p className="text-lg text-blue-600">
                            Rp {product.price.toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}</span>
                          </div>
                          <span>{product.sold} terjual</span>
                        </div>
                      </div>
                    </Card>
                  );
                })
              }
            </div>
          )}
          
          {!selectedEwallet && (
            <div className="text-center py-8">
              <p className="text-gray-500">Pilih layanan e-wallet terlebih dahulu</p>
            </div>
          )}
          
          {selectedEwallet && !checkedUser && (
            <div className="text-center py-8">
              <p className="text-gray-500">Masukkan nomor {selectedEwallet} untuk cek nama pengguna</p>
            </div>
          )}
          
          {checkedUser && checkedUser.name === 'User Tidak Ditemukan' && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nomor tidak terdaftar di layanan e-wallet</p>
              <p className="text-xs text-gray-400 mt-2">Coba dengan nomor lain</p>
            </div>
          )}
        </div>
      )}
      
      {/* All Products */}
      {selectedCategory === "all" && (
        <div>
          <h2 className="text-2xl mb-6">Semua Produk</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts
              .filter(product => 
                selectedCategory === "all" ? 
                  product.category !== "pulsa" : // Exclude pulsa from "all" since it has special handling
                  product.category === selectedCategory
              )
              .map((product) => {
                const discount = getDiscount(product.originalPrice, product.price);
                
                return (
                  <Card 
                    key={product.id}
                    onClick={() => {
                      if (product.category === "game") {
                        // Game products go to GameDetail first
                        setSelectedGame(product.gameId);
                        setView('products');
                      } else if (product.name.toLowerCase().includes('cek nama pengguna')) {
                        // Skip cek nama pengguna products in regular flow
                        return;
                      } else {
                        // Regular pulsa and E-wallet go directly to order
                        localStorage.setItem('selectedProduct', JSON.stringify(product));
                        setActivePage("order");
                      }
                    }}
                    className="overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                      {product.image ? (
                        <img 
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling!.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`text-6xl ${product.image ? 'hidden' : ''}`}>
                        {product.category === "pulsa" ? "📱" : product.category === "ewallet" ? "💳" : "🎮"}
                      </div>
                      {discount > 0 && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-500">
                          -{discount}%
                        </Badge>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-sm mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-3">{product.category === 'pulsa' ? 'Pulsa' : 'E-Wallet'}</p>
                      
                      {/* Price */}
                      <div className="mb-3">
                        {discount > 0 && (
                          <p className="text-xs text-gray-400 line-through mb-1">
                            Rp {product.originalPrice.toLocaleString()}
                          </p>
                        )}
                        <p className="text-lg text-blue-600">
                          Rp {product.price.toLocaleString()}
                        </p>
                      </div>
                      
                      {/* Rating & Sales */}
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{product.rating}</span>
                        </div>
                        <span>{product.sold} terjual</span>
                      </div>
                    </div>
                  </Card>
                );
              })
            }
          </div>
        </div>
      )}

      {/* No Results */}
      {games.filter(game => 
        searchQuery === "" || 
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).length === 0 && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada produk ditemukan</p>
        </div>
      )}

      {/* Popular Games Section */}
      <section className="mt-12 pt-12 border-t">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl mb-2">Game Paling Populer</h2>
            <p className="text-gray-600">Paling banyak dibeli minggu ini</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularGames.map((game, index) => (
            <Card key={game.name || index} className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                  #{game.rank}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">{game.name}</p>
                  <p className="text-sm text-gray-600">{game.sales} transaksi</p>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  {game.trend}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="mt-12">
        <Card className="bg-gradient-to-r from-orange-500 to-pink-600 text-white p-8 text-center">
          <h3 className="text-2xl mb-2">Pakai Kode Promo TOPUP10</h3>
          <p className="text-lg mb-4">Dapatkan diskon 10% untuk semua produk!</p>
          <p className="text-sm text-white/80">Min. belanja Rp 50.000 • Maks. diskon Rp 20.000</p>
        </Card>
      </section>
    </div>
  );
}
