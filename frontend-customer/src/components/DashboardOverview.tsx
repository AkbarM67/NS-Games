import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Card } from "./SimpleUI";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export function DashboardOverview() {
  // Mock data untuk statistik
  const stats = [
    {
      title: "Total Revenue Hari Ini",
      value: "Rp 12.450.000",
      change: "+15.3%",
      isPositive: true,
      icon: DollarSign,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Total Transaksi",
      value: "1,248",
      change: "+8.2%",
      isPositive: true,
      icon: ShoppingCart,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "User Aktif",
      value: "856",
      change: "+12.5%",
      isPositive: true,
      icon: Users,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Produk Aktif",
      value: "324",
      change: "-2.1%",
      isPositive: false,
      icon: Package,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  // Status transaksi
  const transactionStatus = [
    { label: "Sukses", value: 1180, color: "text-green-600", bgColor: "bg-green-100", icon: CheckCircle },
    { label: "Pending", value: 42, color: "text-yellow-600", bgColor: "bg-yellow-100", icon: Clock },
    { label: "Gagal", value: 26, color: "text-red-600", bgColor: "bg-red-100", icon: XCircle }
  ];

  // Data grafik penjualan 7 hari terakhir
  const salesData = [
    { day: "Sen", amount: 4200 },
    { day: "Sel", amount: 5800 },
    { day: "Rab", amount: 7200 },
    { day: "Kam", amount: 6500 },
    { day: "Jum", amount: 8900 },
    { day: "Sab", amount: 11200 },
    { day: "Min", amount: 9800 }
  ];

  // Data grafik revenue vs profit
  const revenueData = [
    { month: "Jan", revenue: 45000, profit: 12000 },
    { month: "Feb", revenue: 52000, profit: 15000 },
    { month: "Mar", revenue: 48000, profit: 13500 },
    { month: "Apr", revenue: 61000, profit: 18000 },
    { month: "Mei", revenue: 55000, profit: 16000 },
    { month: "Jun", revenue: 67000, profit: 20000 }
  ];

  // Produk terlaris
  const topProducts = [
    { name: "Mobile Legends", sales: 450, revenue: "Rp 2.250.000" },
    { name: "Free Fire", sales: 380, revenue: "Rp 1.900.000" },
    { name: "PUBG Mobile", sales: 320, revenue: "Rp 1.600.000" },
    { name: "Genshin Impact", sales: 280, revenue: "Rp 1.400.000" },
    { name: "Pulsa Telkomsel", sales: 520, revenue: "Rp 2.600.000" }
  ];

  // Data pie chart kategori produk
  const categoryData = [
    { name: "Game", value: 45, color: "#3B82F6" },
    { name: "Pulsa", value: 30, color: "#10B981" },
    { name: "E-Wallet", value: 15, color: "#F59E0B" },
    { name: "Voucher", value: 10, color: "#8B5CF6" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl mb-1">Dashboard</h1>
        <p className="text-gray-600">Selamat datang kembali, Admin! Berikut ringkasan bisnis Anda hari ini.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-2xl mb-2">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    {stat.isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm ${stat.isPositive ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs kemarin</span>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Transaction Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {transactionStatus.map((status, index) => {
          const Icon = status.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`${status.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${status.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{status.label}</p>
                  <p className="text-2xl">{status.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="p-6">
          <h3 className="mb-4">Penjualan 7 Hari Terakhir</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString()}`} />
              <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="mb-4">Distribusi Kategori Produk</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Revenue vs Profit */}
      <Card className="p-6">
        <h3 className="mb-4">Revenue vs Profit (6 Bulan Terakhir)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString()}`} />
            <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} name="Revenue" />
            <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} name="Profit" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Products */}
      <Card className="p-6">
        <h3 className="mb-4">Produk Terlaris Hari Ini</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 text-sm text-gray-600">Produk</th>
                <th className="text-left py-3 text-sm text-gray-600">Terjual</th>
                <th className="text-left py-3 text-sm text-gray-600">Revenue</th>
                <th className="text-left py-3 text-sm text-gray-600">Performa</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                        {index + 1}
                      </div>
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4">{product.sales} transaksi</td>
                  <td className="py-4">{product.revenue}</td>
                  <td className="py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(product.sales / 520) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
