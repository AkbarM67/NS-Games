import { useState, useEffect } from "react";
import { ArrowLeft, Star, Users, Clock, Shield } from "lucide-react";
import { Card, Badge, Button } from "../SimpleUI";
import api from "../../lib/api";

interface GameDetailProps {
  gameId: string;
  onBack: () => void;
  onSelectProduct: (product: any) => void;
}

export function GameDetail({ gameId, onBack, onSelectProduct }: GameDetailProps) {
  const [game, setGame] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameDetail();
  }, [gameId]);

  const fetchGameDetail = async () => {
    try {
      const [gameResponse, productsResponse] = await Promise.all([
        api.get(`/games/${gameId}`),
        api.get(`/products?gameId=${gameId}`)
      ]);
      
      if (gameResponse.data.success) {
        setGame(gameResponse.data.data);
      }
      
      if (productsResponse.data.success) {
        const gameProducts = productsResponse.data.data.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          price: parseFloat(product.sellPrice || product.price || 0),
          originalPrice: parseFloat(product.sellPrice || product.price || 0) * 1.1,
          popular: product.isPopular || false
        }));
        setProducts(gameProducts);
      }
    } catch (error) {
      console.error('Error fetching game detail:', error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading game detail...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button variant="outline" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Katalog
        </Button>
        <div className="text-center">
          <p>Game tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Button 
        variant="outline" 
        onClick={onBack}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Katalog
      </Button>

      {/* Game Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl">
                {game?.image || '🎮'}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl">{game?.name || 'Unknown Game'}</h1>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    {game?.category || 'Game'}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-4">{game.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{game.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{game.players} Players</span>
                  </div>
                  <div>
                    <span>by {game.developer}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Game Features */}
        <div>
          <Card className="p-6">
            <h3 className="mb-4">Fitur Game</h3>
            <div className="space-y-3">
              {game.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Shield className="w-4 h-4" />
                <span>Proses Otomatis & Aman</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">
                <Clock className="w-4 h-4" />
                <span>Rata-rata 1-3 menit</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Products Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl mb-2">Pilih Nominal</h2>
            <p className="text-gray-600">Pilih jumlah diamonds/UC yang ingin dibeli</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            
            return (
              <Card 
                key={product.id}
                className={`p-4 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 relative ${
                  product.popular ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  const selectedProduct = { ...product, gameName: game.name, gameId: game.id };
                  localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
                  onSelectProduct(selectedProduct);
                }}
              >
                {product.popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white hover:bg-blue-500">
                    Populer
                  </Badge>
                )}
                
                {discount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white hover:bg-red-500">
                    -{discount}%
                  </Badge>
                )}

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
                    {game.image}
                  </div>
                  
                  <h4 className="font-medium mb-2">{product.name}</h4>
                  
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
                  
                  <Button 
                    size="sm" 
                    className="w-full"
                    variant={product.popular ? "default" : "outline"}
                  >
                    Pilih
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Info Section */}
      <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
        <h3 className="mb-3">Cara Top Up {game.name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</div>
            <div>
              <p className="font-medium mb-1">Masukkan User ID</p>
              <p className="text-gray-600">Buka game → Profile → Salin User ID</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</div>
            <div>
              <p className="font-medium mb-1">Pilih Nominal</p>
              <p className="text-gray-600">Pilih jumlah diamonds yang diinginkan</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</div>
            <div>
              <p className="font-medium mb-1">Bayar & Selesai</p>
              <p className="text-gray-600">Diamonds masuk otomatis ke akun</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}