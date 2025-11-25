import { useState, useEffect } from "react";
import api from "../../lib/api";
import { useRealTime } from "../../hooks/useRealTime";
import { ShoppingCart, Info, AlertCircle, CheckCircle, Copy, Smartphone } from "lucide-react";
import { Card, Badge, Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogHeader, DialogTitle } from "../SimpleUI";

// Declare Midtrans Snap
declare global {
  interface Window {
    snap: any;
  }
}

export function OrderPage() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time WebSocket connection
  useRealTime({
    onProductUpdate: (updatedProduct) => {
      console.log('Product updated:', updatedProduct);
      // Refresh products when admin updates pricing
      fetchProducts();
    },
    onOrderUpdate: (updatedOrder) => {
      console.log('Order updated:', updatedOrder);
      // Show notification when order status changes
      if (updatedOrder.status === 'success') {
        alert('Pesanan berhasil diproses!');
      }
    }
  });

  useEffect(() => {
    fetchProducts();
    loadMidtransScript();
    
    // Load selected product from localStorage
    const storedProduct = localStorage.getItem('selectedProduct');
    if (storedProduct) {
      try {
        const product = JSON.parse(storedProduct);
        setSelectedProduct(product.id);
      } catch (error) {
        console.error('Error parsing stored product:', error);
      }
    }
    
    // Auto-refresh products every 60 seconds
    const interval = setInterval(fetchProducts, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const loadMidtransScript = () => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', 'SB-Mid-client-K5IIhOtJfHqw5-6H');
    document.head.appendChild(script);
  };

  const fetchProducts = async () => {
    try {
      console.log('OrderPage: Fetching products from /products');
      const response = await api.get('/products');
      console.log('OrderPage: API Response:', response.data);
      
      if (response.data.success && response.data.data.length > 0) {
        const allProducts = response.data.data.map((product: any) => {
          let category = "game";
          if (product.category === "Pulsa" || product.name.toLowerCase().includes('pulsa')) category = "pulsa";
          else if (product.category === "E-Wallet" || product.name.toLowerCase().includes('gopay') || product.name.toLowerCase().includes('ovo') || product.name.toLowerCase().includes('dana')) category = "ewallet";
          
          return {
            id: product.id.toString(),
            name: product.name,
            price: parseFloat(product.sellPrice || product.price || 0),
            category: category,
            gameId: product.gameId || product.id,
            productId: product.id
          };
        });
        console.log('OrderPage: Converted products:', allProducts);
        setProducts(allProducts);
      } else {
        console.log('OrderPage: No products found, using fallback data');
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error('OrderPage: Error fetching products:', error);
      // Always use fallback data on error
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const mockProducts = [
    { id: "ml86", name: "Mobile Legends - 86 Diamonds", price: 22000, category: "game" },
    { id: "ml172", name: "Mobile Legends - 172 Diamonds", price: 43000, category: "game" },
    { id: "ml257", name: "Mobile Legends - 257 Diamonds", price: 64000, category: "game" },
    { id: "ff70", name: "Free Fire - 70 Diamonds", price: 11000, category: "game" },
    { id: "ff140", name: "Free Fire - 140 Diamonds", price: 22000, category: "game" },
    { id: "telkomsel10", name: "Pulsa Telkomsel 10.000", price: 11000, category: "pulsa" },
    { id: "telkomsel25", name: "Pulsa Telkomsel 25.000", price: 26000, category: "pulsa" },
  ];

  const paymentMethods = [
    { id: "qris", name: "QRIS", fee: 0.7, type: "percentage" },
    { id: "bca", name: "Virtual Account BCA", fee: 4000, type: "fixed" },
    { id: "bni", name: "Virtual Account BNI", fee: 4000, type: "fixed" },
    { id: "mandiri", name: "Virtual Account Mandiri", fee: 4000, type: "fixed" },
    { id: "gopay", name: "GoPay", fee: 2, type: "percentage" },
    { id: "ovo", name: "OVO", fee: 2, type: "percentage" },
    { id: "dana", name: "DANA", fee: 2, type: "percentage" },
  ];

  const selectedProductData = products.find(p => p.id === selectedProduct);
  const selectedPaymentData = paymentMethods.find(p => p.id === paymentMethod);

  const calculateTotal = () => {
    if (!selectedProductData || !selectedProductData.price) return 0;
    
    let total = selectedProductData.price;
    
    if (selectedPaymentData) {
      if (selectedPaymentData.type === "percentage") {
        total += (total * selectedPaymentData.fee) / 100;
      } else {
        total += selectedPaymentData.fee;
      }
    }
    
    // Discount from promo code
    if (promoCode === "TOPUP10") {
      const discount = Math.min(total * 0.1, 20000);
      total -= discount;
    }
    
    return Math.round(total);
  };

  const handleOrder = async () => {
    // Validasi
    if (!selectedProductData) {
      alert("Pilih produk terlebih dahulu");
      return;
    }
    
    if (selectedProductData?.category === "game" && (!userId || !serverId)) {
      alert("Masukkan User ID dan Server ID");
      return;
    }
    
    if (selectedProductData?.category === "pulsa" && !phoneNumber) {
      alert("Masukkan nomor telepon");
      return;
    }
    
    if (!paymentMethod) {
      alert("Pilih metode pembayaran");
      return;
    }
    
    try {
      const orderData = {
        product_id: selectedProductData.id,
        target_user_id: selectedProductData.category === "game" ? userId : phoneNumber,
        server_id: serverId || null,
        payment_method: paymentMethod,
        total_amount: calculateTotal()
      };
      
      console.log('OrderPage: Creating payment with data:', orderData);
      
      const response = await api.post('/payment/create', orderData);
      console.log('OrderPage: Payment response:', response.data);
      
      if (response.data.success && response.data.data.snap_token) {
        // Open Midtrans Snap
        window.snap.pay(response.data.data.snap_token, {
          onSuccess: function(result: any) {
            console.log('Payment success:', result);
            setShowSuccess(true);
          },
          onPending: function(result: any) {
            console.log('Payment pending:', result);
            alert('Pembayaran sedang diproses');
          },
          onError: function(result: any) {
            console.log('Payment error:', result);
            alert('Pembayaran gagal');
          },
          onClose: function() {
            console.log('Payment popup closed');
          }
        });
      } else {
        alert('Gagal membuat pembayaran: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('OrderPage: Error creating payment:', error);
      console.error('OrderPage: Error details:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert('Gagal membuat pembayaran: ' + errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Buat Pesanan</h1>
        <p className="text-gray-600">Isi form di bawah untuk melakukan pemesanan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Product Display */}
          {selectedProductData && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3>Produk Dipilih</h3>
                  <p className="text-sm text-gray-600">Produk yang akan dibeli</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">{selectedProductData.name}</h4>
                    <p className="text-sm text-blue-700 capitalize">{selectedProductData.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">Rp {selectedProductData.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Game Account Info */}
          {selectedProductData?.category === "game" && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Info className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3>Data Akun Game</h3>
                  <p className="text-sm text-gray-600">Masukkan ID akun game kamu</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>User ID / Player ID</Label>
                  <Input 
                    placeholder="Contoh: 123456789"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Server ID (Opsional)</Label>
                  <Input 
                    placeholder="Contoh: 1234"
                    value={serverId}
                    onChange={(e) => setServerId(e.target.value)}
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Cara Mendapatkan User ID:</p>
                    <p>Buka game → Menu Profile → Salin User ID dan Server ID kamu</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Phone Number for Pulsa */}
          {selectedProductData?.category === "pulsa" && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3>Nomor Telepon</h3>
                  <p className="text-sm text-gray-600">Masukkan nomor yang akan diisi pulsa</p>
                </div>
              </div>

              <div>
                <Label>Nomor Telepon</Label>
                <Input 
                  placeholder="08123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </Card>
          )}

          {/* Payment Method */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3>Metode Pembayaran</h3>
                <p className="text-sm text-gray-600">Pilih cara pembayaran</p>
              </div>
            </div>

            <div>
              <Label>Metode Pembayaran</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pembayaran..." />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1.5 text-xs text-gray-500">QRIS</div>
                  <SelectItem value="qris">QRIS - Fee 0.7%</SelectItem>
                  
                  <div className="px-2 py-1.5 text-xs text-gray-500 border-t mt-2 pt-2">Virtual Account</div>
                  <SelectItem value="bca">BCA Virtual Account - Fee Rp 4.000</SelectItem>
                  <SelectItem value="bni">BNI Virtual Account - Fee Rp 4.000</SelectItem>
                  <SelectItem value="mandiri">Mandiri Virtual Account - Fee Rp 4.000</SelectItem>
                  
                  <div className="px-2 py-1.5 text-xs text-gray-500 border-t mt-2 pt-2">E-Wallet</div>
                  <SelectItem value="gopay">GoPay - Fee 2%</SelectItem>
                  <SelectItem value="ovo">OVO - Fee 2%</SelectItem>
                  <SelectItem value="dana">DANA - Fee 2%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Promo Code */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <Copy className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3>Kode Promo</h3>
                <p className="text-sm text-gray-600">Punya kode promo? Masukkan di sini</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Input 
                placeholder="Masukkan kode promo"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              />
              <Button variant="outline">Pakai</Button>
            </div>

            {promoCode === "TOPUP10" && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-900">
                  <p className="font-medium">Kode promo berhasil digunakan!</p>
                  <p>Diskon 10% telah diterapkan (Maks. Rp 20.000)</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Side - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="mb-6">Ringkasan Pesanan</h3>

            {selectedProductData ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Produk</p>
                  <p className="font-medium">{selectedProductData.name}</p>
                </div>

                {selectedProductData.category === "game" && userId && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">User ID</p>
                    <p className="font-medium">{userId}</p>
                  </div>
                )}

                {selectedProductData.category === "pulsa" && phoneNumber && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nomor Telepon</p>
                    <p className="font-medium">{phoneNumber}</p>
                  </div>
                )}

                {selectedPaymentData && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Metode Pembayaran</p>
                    <p className="font-medium">{selectedPaymentData.name}</p>
                  </div>
                )}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Harga Produk</span>
                    <span>Rp {selectedProductData.price.toLocaleString()}</span>
                  </div>
                  
                  {selectedPaymentData && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Biaya Admin</span>
                      <span>
                        {selectedPaymentData.type === "percentage"
                          ? `Rp ${Math.round((selectedProductData.price * selectedPaymentData.fee) / 100).toLocaleString()}`
                          : `Rp ${selectedPaymentData.fee.toLocaleString()}`
                        }
                      </span>
                    </div>
                  )}
                  
                  {promoCode === "TOPUP10" && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Diskon Promo</span>
                      <span>- Rp {Math.min(selectedProductData.price * 0.1, 20000).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total Bayar</span>
                    <span className="text-2xl text-blue-600">
                      Rp {(calculateTotal() || 0).toLocaleString()}
                    </span>
                  </div>

                  <Button 
                    onClick={handleOrder}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    Bayar Sekarang
                  </Button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-900">
                    Pastikan data yang kamu masukkan sudah benar sebelum melakukan pembayaran
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Pilih produk untuk melihat ringkasan</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pesanan Berhasil Dibuat!</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg mb-2">ID Transaksi: <span className="font-mono">TRX{Date.now()}</span></p>
              <p className="text-gray-600">Silakan lakukan pembayaran sebelum expired</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Total Pembayaran</p>
              <p className="text-3xl text-blue-600 mb-4">Rp {calculateTotal().toLocaleString()}</p>
              
              {paymentMethod === "qris" && (
                <div className="text-center">
                  <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <p className="text-gray-400">QR Code</p>
                  </div>
                  <p className="text-sm text-gray-600">Scan QR Code di atas untuk membayar</p>
                </div>
              )}
              
              {paymentMethod && paymentMethod !== "qris" && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Nomor Virtual Account</p>
                  <div className="bg-white border rounded-lg p-3 font-mono text-lg text-center mb-3">
                    8087 1234 5678 9012
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    Transfer ke nomor VA di atas sesuai total pembayaran
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowSuccess(false)}>
                Tutup
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                Cek Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
