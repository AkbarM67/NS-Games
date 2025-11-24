import { useState } from "react";
import { Download, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Percent } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

export function FinancialReports() {
  const [period, setPeriod] = useState("monthly");

  // Data laporan kosong untuk simulasi real data
  const monthlyData = [
    { month: "Jul", revenue: 0, cost: 0, profit: 0, transactions: 0 },
    { month: "Agu", revenue: 0, cost: 0, profit: 0, transactions: 0 },
    { month: "Sep", revenue: 0, cost: 0, profit: 0, transactions: 0 },
    { month: "Okt", revenue: 0, cost: 0, profit: 0, transactions: 0 },
    { month: "Nov", revenue: 0, cost: 0, profit: 0, transactions: 0 },
    { month: "Des", revenue: 0, cost: 0, profit: 0, transactions: 0 }
  ];

  const weeklyData = [
    { week: "Week 1", revenue: 0, profit: 0 },
    { week: "Week 2", revenue: 0, profit: 0 },
    { week: "Week 3", revenue: 0, profit: 0 },
    { week: "Week 4", revenue: 0, profit: 0 }
  ];

  // Top products kosong
  const topProducts = [];

  // Top customers kosong
  const topCustomers = [];

  // Summary statistics
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = monthlyData.reduce((sum, item) => sum + item.profit, 0);
  const totalTransactions = monthlyData.reduce((sum, item) => sum + item.transactions, 0);
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0';

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const revenueGrowth = previousMonth.revenue > 0 ? (((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100).toFixed(1) : '0.0';
  const profitGrowth = previousMonth.profit > 0 ? (((currentMonth.profit - previousMonth.profit) / previousMonth.profit) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Laporan Keuangan</h1>
          <p className="text-gray-600">Analisis revenue, profit, dan performa bisnis</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Mingguan</SelectItem>
              <SelectItem value="monthly">Bulanan</SelectItem>
              <SelectItem value="yearly">Tahunan</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">{revenueGrowth}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue (6 Bulan)</p>
          <p className="text-2xl">Rp {(totalRevenue / 1000000).toFixed(0)}jt</p>
          <p className="text-xs text-gray-500 mt-2">vs bulan lalu: +Rp {((currentMonth.revenue - previousMonth.revenue) / 1000000).toFixed(1)}jt</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">{profitGrowth}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Profit (6 Bulan)</p>
          <p className="text-2xl text-green-600">Rp {(totalProfit / 1000000).toFixed(0)}jt</p>
          <p className="text-xs text-gray-500 mt-2">vs bulan lalu: +Rp {((currentMonth.profit - previousMonth.profit) / 1000000).toFixed(1)}jt</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Transaksi</p>
          <p className="text-2xl">{totalTransactions.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Rata-rata: {(totalTransactions / 6).toFixed(0)}/bulan</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Percent className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Profit Margin</p>
          <p className="text-2xl">{profitMargin}%</p>
          <p className="text-xs text-gray-500 mt-2">Target: 15%</p>
        </Card>
      </div>

      {/* Revenue vs Profit Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3>Revenue vs Profit Trend</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span className="text-sm text-gray-600">Profit</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `Rp ${(Number(value) / 1000000).toFixed(1)}jt`} />
            <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} name="Revenue" />
            <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} name="Profit" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Monthly Breakdown */}
      <Card className="p-6">
        <h3 className="mb-6">Detail Bulanan</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm text-gray-600">Bulan</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Revenue</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Cost</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Profit</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Margin</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data, index) => {
                const margin = ((data.profit / data.revenue) * 100).toFixed(1);
                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">{data.month}</td>
                    <td className="py-4 px-4">Rp {(data.revenue / 1000000).toFixed(1)}jt</td>
                    <td className="py-4 px-4">Rp {(data.cost / 1000000).toFixed(1)}jt</td>
                    <td className="py-4 px-4 text-green-600">Rp {(data.profit / 1000000).toFixed(1)}jt</td>
                    <td className="py-4 px-4">{margin}%</td>
                    <td className="py-4 px-4">{data.transactions.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2">
                <td className="py-4 px-4">Total</td>
                <td className="py-4 px-4">Rp {(totalRevenue / 1000000).toFixed(0)}jt</td>
                <td className="py-4 px-4">Rp {(monthlyData.reduce((sum, item) => sum + item.cost, 0) / 1000000).toFixed(0)}jt</td>
                <td className="py-4 px-4 text-green-600">Rp {(totalProfit / 1000000).toFixed(0)}jt</td>
                <td className="py-4 px-4">{profitMargin}%</td>
                <td className="py-4 px-4">{totalTransactions.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Top Products & Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="p-6">
          <h3 className="mb-4">Top 5 Produk by Revenue</h3>
          <div className="space-y-4">
            {topProducts.length > 0 ? topProducts.map((product, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">{product.name}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{product.transactions} transaksi</span>
                    <span>•</span>
                    <span className="text-green-600">Profit: Rp {(product.profit / 1000000).toFixed(1)}jt</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">Rp {(product.revenue / 1000000).toFixed(1)}jt</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada data produk
              </div>
            )}
          </div>
        </Card>

        {/* Top Customers */}
        <Card className="p-6">
          <h3 className="mb-4">Top 5 Customer by Spending</h3>
          <div className="space-y-4">
            {topCustomers.length > 0 ? topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white">
                  {customer.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">{customer.name}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{customer.transactions} transaksi</span>
                    <span>•</span>
                    <span>{customer.level}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">Rp {(customer.spent / 1000000).toFixed(1)}jt</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada data customer
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
