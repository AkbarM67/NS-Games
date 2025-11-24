import { useState, useEffect } from "react";
import { Search, Filter, Star, ChevronRight } from "lucide-react";
import { Card } from "../SimpleUI";
import { Badge } from "../SimpleUI";
import { Button } from "../SimpleUI";
import { Input } from "../SimpleUI";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../SimpleUI";
import api from "../../lib/api";

interface ProductCatalogProps {
  setActivePage: (page: string) => void;
}

export function ProductCatalog({ setActivePage }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchPopularGames();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Frontend Customer: Fetching games from /customer/games');
      const response = await api.get('/customer/games');
      console.log('Frontend Customer: API Response:', response.data);
      if (response.data.success) {
        console.log('Frontend Customer: Games count:', response.data.data.length);
        // Convert games with products to customer format
        const customerProducts = response.data.data.flatMap((game: any) => {
          return game.products.map((product: any) => {
            let category = "game";
            if (game.category === "Pulsa") category = "pulsa";
            else if (game.category === "E-Wallet") category = "ewallet";
            
            return {
              id: `${game.id}_${product.id}`,
              name: `${game.name} - ${product.name}`,
              item: product.name,
              category: category,
              price: parseFloat(product.price),
              originalPrice: parseFloat(product.price) * 1.1,
              image: category === "pulsa" ? "📱" : category === "ewallet" ? "💳" : "🎮",
              rating: 4.8,
              sold: Math.floor(Math.random() * 50),
              gameId: game.id,
              productId: product.id
            };
          });
        });
        console.log('Frontend Customer: Converted products:', customerProducts);
        setProducts(customerProducts);
      } else {
        console.log('Frontend Customer: API response not successful');
      }
    } catch (error) {
      console.error('Frontend Customer: Error fetching products:', error);
      console.error('Frontend Customer: Error details:', error.response?.data || error.message);
      // Fallback: set empty array to show "no products" message
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularGames = async () => {
    try {
      const response = await api.get('/popular/games');
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
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="game">Game</TabsTrigger>
          <TabsTrigger value="pulsa">Pulsa</TabsTrigger>
          <TabsTrigger value="ewallet">E-Wallet</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {filteredProducts.map((product) => {
          const discount = getDiscount(product.originalPrice, product.price);
          
          return (
            <Card 
              key={product.id}
              onClick={() => setActivePage("order")}
              className="overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-6xl relative">
                {product.image}
                {discount > 0 && (
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-500">
                    -{discount}%
                  </Badge>
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-sm mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-xs text-gray-600 mb-3">{product.category === 'game' ? 'Game' : product.category === 'pulsa' ? 'Pulsa' : 'E-Wallet'}</p>
                
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
                  <span>{product.sold} terjual hari ini</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Produk tidak ditemukan</p>
          <p className="text-xs text-gray-400 mt-2">Total products: {products.length}</p>
          <p className="text-xs text-gray-400">Selected category: {selectedCategory}</p>
          <p className="text-xs text-gray-400">Search query: "{searchQuery}"</p>
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
          {popularGames.map((game) => (
            <Card key={game.rank} className="p-6">
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
