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
import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useState, useEffect } from "react";
import { useRealTime } from "../hooks/useRealTime";
import api from "../lib/api";

export function DashboardOverview() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default empty data instead of showing error
      setDashboardData({
        stats: {
          total_revenue: 0,
          today_revenue: 0,
          total_users: 0,
          new_users_today: 0,
          success_rate: 0,
          pending_orders: 0
        },
        top_products: [],
        recent_orders: [],
        pending_transactions: [],
        transaction_status: {
          success: 0,
          pending: 0,
          failed: 0
        }
      });
      setLoading(false);
    }
  };

  useRealTime({
    onDashboardUpdate: (data) => {
      setDashboardData(data);
    }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }


  // Real data dari API with fallback
  const stats = [
    {
      title: "Total Revenue",
      value: `Rp ${(dashboardData?.stats?.total_revenue || 0).toLocaleString()}`,
      change: `Hari ini: Rp ${(dashboardData?.stats?.today_revenue || 0).toLocaleString()}`,
      isPositive: true,
      icon: DollarSign,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Total Users",
      value: (dashboardData?.stats?.total_users || 0).toString(),
      change: `+${dashboardData?.stats?.new_users_today || 0} hari ini`,
      isPositive: true,
      icon: Users,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Success Rate",
      value: `${dashboardData?.stats?.success_rate || 0}%`,
      change: "Target: 95%",
      isPositive: (dashboardData?.stats?.success_rate || 0) >= 95,
      icon: CheckCircle,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Pending Orders",
      value: (dashboardData?.stats?.pending_orders || 0).toString(),
      change: "Perlu diproses",
      isPositive: false,
      icon: Clock,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  // Status transaksi (ambil dari API, fallback ke 0)
  const transactionStatus = [
    {
      label: "Sukses",
      value: dashboardData?.transaction_status?.success ?? 0,
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: CheckCircle
    },
    {
      label: "Pending",
      value: dashboardData?.transaction_status?.pending ?? 0,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      icon: Clock
    },
    {
      label: "Gagal",
      value: dashboardData?.transaction_status?.failed ?? 0,
      color: "text-red-600",
      bgColor: "bg-red-100",
      icon: XCircle
    }
  ];

  // Data grafik penjualan 7 hari terakhir
  const salesData = [
    { day: "Sen", amount: 0 },
    { day: "Sel", amount: 0 },
    { day: "Rab", amount: 0 },
    { day: "Kam", amount: 0 },
    { day: "Jum", amount: 0 },
    { day: "Sab", amount: 0 },
    { day: "Min", amount: 0 }
  ];

  // Data grafik revenue vs profit
  const revenueData = [
    { month: "Jan", revenue: 0, profit: 0 },
    { month: "Feb", revenue: 0, profit: 0 },
    { month: "Mar", revenue: 0, profit: 0 },
    { month: "Apr", revenue: 0, profit: 0 },
    { month: "Mei", revenue: 0, profit: 0 },
    { month: "Jun", revenue: 0, profit: 0 }
  ];

  // Produk terlaris dari API
  const topProducts = dashboardData?.top_products || [];

  // Data pie chart kategori produk
  const categoryData = [
    { name: "Game", value: 0, color: "#3B82F6" },
    { name: "Pulsa", value: 0, color: "#10B981" },
    { name: "E-Wallet", value: 0, color: "#F59E0B" },
    { name: "Voucher", value: 0, color: "#8B5CF6" }
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
              {topProducts.length > 0 ? topProducts.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                        {index + 1}
                      </div>
                      <span>{product.product_name}</span>
                    </div>
                  </td>
                  <td className="py-4">{product.total_sold} terjual</td>
                  <td className="py-4">-</td>
                  <td className="py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${topProducts.length > 0 ? Math.min((product.total_sold / Math.max(...topProducts.map(p => p.total_sold))) * 100, 100) : 0}%` }}
                      />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    Belum ada data transaksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
