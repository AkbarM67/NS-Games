import { useState, useEffect } from "react";
import api from "../../lib/api";
import { useRealTime } from "../../hooks/useRealTime";
import { Clock, CheckCircle, XCircle, Search, Filter, Eye, Download } from "lucide-react";
import { Card, Badge, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogHeader, DialogTitle } from "../SimpleUI";

interface Transaction {
  id: string;
  product: string;
  category: string;
  amount: string;
  price: number;
  status: "success" | "pending" | "failed";
  date: string;
  time: string;
  paymentMethod: string;
  targetAccount: string;
}

export function TransactionHistory() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time WebSocket connection
  useRealTime({
    onOrderUpdate: (updatedOrder) => {
      console.log('Order updated:', updatedOrder);
      // Refresh transactions when order status changes
      fetchTransactions();
    }
  });

  useEffect(() => {
    fetchTransactions();
    
    // Auto-refresh every 30 seconds for real-time order status
    const interval = setInterval(fetchTransactions, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/orders');
      if (response.data.success) {
        const orders = response.data.data.map((order: any) => ({
          id: order.order_id || `TRX${order.id}`,
          product: `${order.game_name || 'Unknown Game'} - ${order.product_name || 'Unknown Product'}`,
          category: order.game_name?.includes('Pulsa') ? 'Pulsa' : order.game_name?.includes('GoPay') || order.game_name?.includes('OVO') || order.game_name?.includes('DANA') ? 'E-Wallet' : 'Game',
          amount: order.product_name || '',
          price: parseFloat(order.total_amount || order.total_price || 0),
          status: order.status === 'success' ? 'success' : order.status === 'processing' ? 'pending' : order.status === 'waiting_payment' ? 'pending' : 'failed',
          date: new Date(order.created_at).toLocaleDateString('id-ID'),
          time: new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          paymentMethod: order.payment_method || 'Unknown',
          targetAccount: order.target_user_id || order.player_id || ''
        }));
        setTransactions(orders);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Set empty array if API fails
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };



  // Filter transaksi
  const filteredTransactions = transactions.filter(trx => {
    const matchStatus = filterStatus === "all" || trx.status === filterStatus;
    const matchSearch = searchQuery === "" || 
      trx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.product.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Sukses</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Gagal</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  // Statistics
  const totalTransactions = transactions.length;
  const successCount = transactions.filter(t => t.status === "success").length;
  const pendingCount = transactions.filter(t => t.status === "pending").length;
  const totalSpent = transactions
    .filter(t => t.status === "success")
    .reduce((sum, t) => sum + t.price, 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Riwayat Transaksi</h1>
        <p className="text-gray-600">Lihat semua transaksi yang pernah kamu lakukan</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Transaksi</p>
          <p className="text-3xl">{totalTransactions}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Berhasil</p>
          <p className="text-3xl text-green-600">{successCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Pending</p>
          <p className="text-3xl text-yellow-600">{pendingCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Belanja</p>
          <p className="text-xl">Rp {totalSpent.toLocaleString()}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari ID transaksi atau produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="success">Sukses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Gagal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Transactions List - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredTransactions.map((trx) => (
          <Card 
            key={trx.id} 
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedTransaction(trx)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(trx.status)}
                <div>
                  <p className="font-medium mb-1">{trx.product}</p>
                  <p className="text-sm text-gray-600">{trx.id}</p>
                </div>
              </div>
              {getStatusBadge(trx.status)}
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">{trx.date} • {trx.time}</p>
              </div>
              <p className="text-lg text-blue-600">Rp {trx.price.toLocaleString()}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Transactions Table - Desktop */}
      <Card className="p-6 hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm text-gray-600">ID Transaksi</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Produk</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Jumlah</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Harga</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Tanggal</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((trx) => (
                <tr key={trx.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm">{trx.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium">{trx.product}</p>
                    <p className="text-sm text-gray-600">{trx.category}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm">{trx.amount}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm">Rp {trx.price.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(trx.status)}
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm">{trx.date}</p>
                    <p className="text-xs text-gray-500">{trx.time}</p>
                  </td>
                  <td className="py-4 px-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedTransaction(trx)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada transaksi</p>
            <p className="text-sm text-gray-400 mt-2">Transaksi akan muncul setelah Anda melakukan pembelian</p>
          </div>
        )}
      </Card>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                selectedTransaction.status === "success" ? "bg-green-50" :
                selectedTransaction.status === "pending" ? "bg-yellow-50" :
                "bg-red-50"
              }`}>
                {getStatusIcon(selectedTransaction.status)}
                <div>
                  <p className="font-medium">
                    {selectedTransaction.status === "success" ? "Transaksi Berhasil" :
                     selectedTransaction.status === "pending" ? "Menunggu Pembayaran" :
                     "Transaksi Gagal"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedTransaction.date} {selectedTransaction.time}
                  </p>
                </div>
              </div>

              {/* Transaction Info */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">ID Transaksi</p>
                  <p className="font-mono">{selectedTransaction.id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Produk</p>
                  <p className="font-medium">{selectedTransaction.product}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Jumlah</p>
                  <p>{selectedTransaction.amount}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Target Account</p>
                  <p className="font-mono">{selectedTransaction.targetAccount}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Metode Pembayaran</p>
                  <p>{selectedTransaction.paymentMethod}</p>
                </div>
              </div>

              {/* Price Info */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Bayar</span>
                  <span className="text-2xl text-blue-600">
                    Rp {selectedTransaction.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {selectedTransaction.status === "success" && (
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              )}

              {selectedTransaction.status === "pending" && (
                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Bayar Sekarang
                  </Button>
                  <Button className="w-full" variant="outline">
                    Batalkan Pesanan
                  </Button>
                </div>
              )}

              {selectedTransaction.status === "failed" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-900 mb-2">
                    <strong>Alasan Gagal:</strong>
                  </p>
                  <p className="text-sm text-red-800">
                    User ID tidak ditemukan atau salah. Silakan hubungi customer service untuk bantuan.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
