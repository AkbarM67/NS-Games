import { 
  Gamepad2, 
  Smartphone, 
  Wallet, 
  Gift, 
  Zap, 
  Shield, 
  Clock,
  Star,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Card, Badge, Button } from "../SimpleUI";
import { useState, useEffect } from "react";
import api from "../../lib/api";
import { useRealTime } from "../../hooks/useRealTime";

interface UserHomepageProps {
  setActivePage: (page: string) => void;
}

export function UserHomepage({ setActivePage }: UserHomepageProps) {
  const [categories, setCategories] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [promos, setPromos] = useState([]);
  const [stats, setStats] = useState({ users: 0, products: 0, rating: 0 });
  const [loading, setLoading] = useState(true);

  useRealTime({
    onProductUpdate: () => {
      fetchData();
    }
  });

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, gamesRes, promosRes, statsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/analytics/popular-games'),
        api.get('/promos/active'),
        api.get('/analytics/stats')
      ]);

      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data);
      }

      if (gamesRes.data.success) {
        setPopularGames(gamesRes.data.data);
      }

      if (promosRes.data.success) {
        console.log('Promos loaded:', promosRes.data.data);
        setPromos(promosRes.data.data);
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Zap, title: "Proses Cepat", desc: "Rata-rata kurang dari 1 menit" },
    { icon: Shield, title: "100% Aman", desc: "Transaksi terenkripsi" },
    { icon: Clock, title: "24/7 Support", desc: "CS siap membantu" },
    { icon: Star, title: "Harga Terbaik", desc: "Termurah se-Indonesia" },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm">Platform Topup #1 di Indonesia</span>
              </div>
              <h1 className="text-4xl md:text-5xl mb-4">
                Topup Game, Pulsa & E-Wallet
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Cepat, Murah, dan Terpercaya! Proses otomatis dalam hitungan detik.
              </p>
              <div className="flex flex-wrap gap-4">
               <Button
                  onClick={() => setActivePage("catalog")}
                  className="bg-white/20 text-white hover:bg-white/30 px-6 py-3 rounded-xl flex items-center border-2 border-white/40"
                >
                  Belanja Sekarang
                  <ChevronRight className="w-6 h-6 ml-3" />
                </Button>

                <Button
                  className="bg-white/20 text-white hover:bg-white/30 px-6 py-3 rounded-xl flex items-center border-2 border-white/40"
                >
                  Cek Promo
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
                <div>
                  <p className="text-3xl mb-1">{loading ? '...' : `${Math.floor(stats.users / 1000)}k+`}</p>
                  <p className="text-sm text-blue-100">User Aktif</p>
                </div>
                <div>
                  <p className="text-3xl mb-1">{loading ? '...' : `${stats.products}+`}</p>
                  <p className="text-sm text-blue-100">Produk</p>
                </div>
                <div>
                  <p className="text-3xl mb-1">{loading ? '...' : stats.rating}</p>
                  <p className="text-sm text-blue-100">Rating</p>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-full h-96 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl mb-2">Promo Hari Ini! 🎉</h3>
                    <p className="text-blue-100">Dapatkan diskon hingga 15%</p>
                  </div>
                  <div className="space-y-4">
                    {promos.slice(0, 2).map((promo, index) => (
                      <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <h3 className="text-xl mb-2 !text-white !opacity-100">{promo.name}</h3>
                        <div className="flex items-center justify-between">
                          <code className="bg-white/20 px-3 py-1 rounded text-sm">{promo.code}</code>
                          <Button
                            size="sm"
                            className="bg-white/80 text-blue-600 hover:bg-white/90 px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm"
                          >
                            Pakai
                          </Button>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl mb-2">Kategori Produk</h2>
          <p className="text-gray-600">Pilih kategori yang kamu butuhkan</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </Card>
            ))
          ) : (
            categories.map((category: any) => {
              const iconMap: any = {
                'game': Gamepad2,
                'pulsa': Smartphone,
                'ewallet': Wallet,
                'voucher': Gift
              };
              const Icon = iconMap[category.slug] || Gamepad2;
              const colorMap: any = {
                'game': 'from-blue-500 to-cyan-500',
                'pulsa': 'from-green-500 to-emerald-500',
                'ewallet': 'from-purple-500 to-pink-500',
                'voucher': 'from-orange-500 to-red-500'
              };
              const color = colorMap[category.slug] || 'from-blue-500 to-cyan-500';
              
              return (
                <Card 
                  key={category.id}
                  onClick={() => setActivePage("catalog")}
                  className="p-6 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-center mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600 text-center">{category.productCount || 0} Produk</p>
                </Card>
              );
            })
          )}
        </div>
      </section>

      {/* Popular Games */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl mb-2">Game Populer</h2>
            <p className="text-gray-600">Produk paling banyak dibeli</p>
          </div>
         <Button
            onClick={() => setActivePage("catalog")}
            className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-xl flex items-center"
          >
            Lihat Semua
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </Card>
            ))
          ) : (
            popularGames.map((game: any, index: number) => (
              <Card 
                key={index}
                onClick={() => setActivePage("catalog")}
                className="overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-6xl">
                  {game.icon || '🎮'}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm line-clamp-2">{game.name}</h3>
                    {game.discount && (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">
                        -{game.discount}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-blue-600 mb-2">Mulai Rp {game.minPrice?.toLocaleString() || '0'}</p>
                  <p className="text-xs text-gray-500">{game.sales || 0} terjual hari ini</p>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Promo Section */}
     <section className="max-w-7xl mx-auto px-4">
  <div className="text-center mb-8">
    <h2 className="text-3xl mb-2">Promo Spesial</h2>
    <p className="text-gray-600">Dapatkan diskon dan cashback menarik!</p>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {loading ? (
      Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <div className="bg-gray-200 p-6">
            <div className="h-4 bg-gray-300 rounded mb-3"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded mb-4"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
        </Card>
      ))
    ) : promos.length === 0 ? (
      <div className="col-span-full text-center py-12">
        <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Belum ada promo tersedia</p>
      </div>
    ) : (
      promos.map((promo: any, index: number) => {
        const colors = [
          'bg-gradient-to-r from-blue-500 to-purple-600',
          'bg-gradient-to-r from-green-500 to-teal-600',
          'bg-gradient-to-r from-orange-500 to-pink-600'
        ];
        const color = colors[index % colors.length];
        
        return (
          <Card key={index} className="overflow-hidden border-0 shadow-lg">
            <div className={`${color} text-white p-6`}>
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-5 h-5" />
                <span className="text-sm font-medium">Promo Spesial</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{promo.name}</h3>
              <p className="text-sm text-white/90 mb-4">{promo.description}</p>
              <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2.5 border border-white/30">
                <code className="font-mono text-white font-semibold text-base">{promo.code}</code>
                <Button
                  size="sm"
                  className="bg-white/90 text-gray-900 hover:bg-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Salin
                </Button>
              </div>
            </div>
          </Card>
        );
      })
    )}
  </div>
</section>

      {/* Features */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-2">Kenapa Pilih Kami?</h2>
            <p className="text-gray-600">Keunggulan yang membuat kami berbeda</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl mb-2">Testimoni Pelanggan</h2>
          <p className="text-gray-600">Apa kata mereka tentang kami</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Ahmad S.", rating: 5, text: "Pelayanan cepat banget! Diamonds langsung masuk dalam 1 menit." },
            { name: "Siti R.", rating: 5, text: "Harga paling murah yang pernah saya temukan. Recommended!" },
            { name: "Budi W.", rating: 5, text: "CS nya responsif dan ramah. Transaksi aman dan terpercaya." },
          ].map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
              <p className="font-medium">{testimonial.name}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 text-center">
          <h2 className="text-3xl mb-4">Siap Topup Sekarang?</h2>
          <p className="text-xl text-blue-100 mb-6">
            Dapatkan diamond, UC, dan pulsa dalam hitungan detik!
          </p>
          <Button 
            onClick={() => setActivePage("catalog")}
            className="bg-white text-blue-600 hover:bg-blue-50"
            size="lg"
          >
            Mulai Belanja
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </section>
    </div>
  );
}
