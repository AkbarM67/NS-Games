import { useState } from "react";
import { Search, Filter, Download, Eye, RefreshCw, X, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card } from "./SimpleUI";
import { Badge } from "./SimpleUI";
import { Button } from "./SimpleUI";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./SimpleUI";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./SimpleUI";

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  product: string;
  category: string;
  amount: number;
  price: number;
  profit: number;
  status: "success" | "pending" | "failed";
  date: string;
  time: string;
  paymentMethod: string;
  targetAccount: string;
}

export function TransactionManagement() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data transaksi
  const transactions: Transaction[] = [
    {
      id: "TRX001234",
      userId: "USR001",
      userName: "Budi Santoso",
      product: "Mobile Legends 275 Diamonds",
      category: "Game",
      amount: 275,
      price: 75000,
      profit: 5000,
      status: "success",
      date: "2025-01-20",
      time: "14:30:25",
      paymentMethod: "QRIS",
      targetAccount: "1234567890"
    },
    {
      id: "TRX001235",
      userId: "USR002",
      userName: "Siti Rahayu",
      product: "Free Fire 100 Diamonds",
      category: "Game",
      amount: 100,
      price: 15000,
      profit: 1000,
      status: "pending",
      date: "2025-01-20",
      time: "14:32:10",
      paymentMethod: "VA BCA",
      targetAccount: "9876543210"
    },
    {
      id: "TRX001236",
      userId: "USR003",
      userName: "Ahmad Wijaya",
      product: "Pulsa Telkomsel 50.000",
      category: "Pulsa",
      amount: 50000,
      price: 51000,
      profit: 1000,
      status: "success",
      date: "2025-01-20",
      time: "14:35:42",
      paymentMethod: "E-Wallet",
      targetAccount: "081234567890"
    },
    {
      id: "TRX001237",
      userId: "USR004",
      userName: "Dewi Lestari",
      product: "PUBG Mobile 325 UC",
      category: "Game",
      amount: 325,
      price: 85000,
      profit: 6000,
      status: "failed",
      date: "2025-01-20",
      time: "14:38:15",
      paymentMethod: "QRIS",
      targetAccount: "1122334455"
    },
    {
      id: "TRX001238",
      userId: "USR005",
      userName: "Rizki Fadillah",
      product: "Genshin Impact 330 Genesis",
      category: "Game",
      amount: 330,
      price: 95000,
      profit: 7000,
      status: "success",
      date: "2025-01-20",
      time: "14:40:20",
      paymentMethod: "VA BNI",
      targetAccount: "6677889900"
    },
    {
      id: "TRX001239",
      userId: "USR006",
      userName: "Linda Marlina",
      product: "GoPay Rp 100.000",
      category: "E-Wallet",
      amount: 100000,
      price: 101000,
      profit: 1000,
      status: "success",
      date: "2025-01-20",
      time: "14:42:55",
      paymentMethod: "QRIS",
      targetAccount: "081298765432"
    },
    {
      id: "TRX001240",
      userId: "USR007",
      userName: "Eko Prasetyo",
      product: "Mobile Legends 565 Diamonds",
      category: "Game",
      amount: 565,
      price: 150000,
      profit: 10000,
      status: "pending",
      date: "2025-01-20",
      time: "14:45:30",
      paymentMethod: "VA Mandiri",
      targetAccount: "2233445566"
    },
    {
      id: "TRX001241",
      userId: "USR008",
      userName: "Fitri Handayani",
      product: "Pulsa XL 100.000",
      category: "Pulsa",
      amount: 100000,
      price: 101500,
      profit: 1500,
      status: "success",
      date: "2025-01-20",
      time: "14:48:12",
      paymentMethod: "E-Wallet",
      targetAccount: "085234567890"
    }
  ];

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

  // Filter transaksi
  const filteredTransactions = transactions.filter(trx => {
    const matchStatus = filterStatus === "all" || trx.status === filterStatus;
    const matchCategory = filterCategory === "all" || trx.category === filterCategory;
    const matchSearch = searchQuery === "" || 
      trx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.product.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchStatus && matchCategory && matchSearch;
  });

  // Statistik
  const totalTransactions = filteredTransactions.length;
  const totalRevenue = filteredTransactions.reduce((sum, trx) => sum + trx.price, 0);
  const totalProfit = filteredTransactions.reduce((sum, trx) => sum + trx.profit, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Manajemen Transaksi</h1>
          <p className="text-gray-600">Kelola dan monitor semua transaksi</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Transaksi</p>
          <p className="text-3xl">{totalTransactions}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
          <p className="text-3xl text-blue-600">Rp {totalRevenue.toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Profit</p>
          <p className="text-3xl text-green-600">Rp {totalProfit.toLocaleString()}</p>
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
                placeholder="Cari ID transaksi, nama user, atau produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Transactions Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm text-gray-600">ID Transaksi</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">User</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Produk</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Kategori</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Harga</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Profit</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Waktu</th>
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
                    <div>
                      <p className="text-sm">{trx.userName}</p>
                      <p className="text-xs text-gray-500">{trx.userId}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm">{trx.product}</p>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline">{trx.category}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm">Rp {trx.price.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-green-600">Rp {trx.profit.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(trx.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm">{trx.date}</p>
                      <p className="text-xs text-gray-500">{trx.time}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedTransaction(trx)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {trx.status === "pending" && (
                        <Button size="sm" variant="outline">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada transaksi ditemukan</p>
          </div>
        )}
      </Card>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-2xl">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">ID Transaksi</p>
                  <p className="font-mono">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Metode Pembayaran</p>
                  <p>{selectedTransaction.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nama User</p>
                  <p>{selectedTransaction.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">User ID</p>
                  <p>{selectedTransaction.userId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Produk</p>
                  <p>{selectedTransaction.product}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kategori</p>
                  <p>{selectedTransaction.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Target Account</p>
                  <p className="font-mono">{selectedTransaction.targetAccount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Jumlah</p>
                  <p>{selectedTransaction.amount}</p>
                </div>
              </div>

              {/* Price Info */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harga Jual</span>
                    <span>Rp {selectedTransaction.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profit</span>
                    <span className="text-green-600">Rp {selectedTransaction.profit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Total Dibayar</span>
                    <span>Rp {selectedTransaction.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedTransaction.status === "failed" && (
                <div className="flex gap-3">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Coba Lagi
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Refund
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
