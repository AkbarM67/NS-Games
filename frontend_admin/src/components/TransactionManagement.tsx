import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useRealTime } from "../hooks/useRealTime";
import api from "../lib/api";
import { toast } from "sonner";

export function TransactionManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      console.log('Orders API response:', response.data);
      setOrders(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
      if (response.data.success) {
        toast.success(`Order #${orderId} berhasil diupdate ke ${status}`);
        fetchOrders();
      } else {
        toast.error('Gagal mengupdate status order');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Terjadi kesalahan saat mengupdate status');
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const response = await api.delete(`/admin/orders/${orderId}`);
      if (response.data.success) {
        toast.success(`Order #${orderId} berhasil dihapus`);
        fetchOrders();
      } else {
        toast.error('Gagal menghapus order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Terjadi kesalahan saat menghapus order');
    }
  };

  useRealTime({
    onDashboardUpdate: () => {
      fetchOrders();
    }
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      waiting_payment: { label: "Waiting Payment", className: "bg-orange-100 text-orange-800" },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      paid: { label: "Paid", className: "bg-blue-100 text-blue-800" },
      processing: { label: "Processing", className: "bg-blue-100 text-blue-800" },
      success: { label: "Success", className: "bg-green-100 text-green-800" },
      completed: { label: "Completed", className: "bg-green-100 text-green-800" },
      topup_failed: { label: "Topup Failed", className: "bg-red-100 text-red-800" },
      failed: { label: "Failed", className: "bg-red-100 text-red-800" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const pendingOrders = orders.filter((order: any) => 
    ['pending', 'paid', 'topup_failed', 'waiting_payment'].includes(order.status)
  );
  
  const completedOrders = orders.filter((order: any) => 
    ['completed', 'success'].includes(order.status)
  );
  
  const failedOrders = orders.filter((order: any) => 
    ['failed'].includes(order.status)
  );

  if (loading) {
    return <div className="p-6">Loading transactions...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl mb-1">Transaction Management</h1>
        <p className="text-gray-600">Kelola semua transaksi topup game</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({failedOrders.length})</TabsTrigger>
          <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Transaksi Tertunda</h3>
              <p className="text-sm text-gray-600">Transaksi yang memerlukan tindakan manual</p>
            </div>
            {renderTransactionTable(pendingOrders, true)}
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Transaksi Selesai</h3>
              <p className="text-sm text-gray-600">Transaksi yang berhasil diselesaikan</p>
            </div>
            {renderTransactionTable(completedOrders, false)}
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Transaksi Gagal</h3>
              <p className="text-sm text-gray-600">Transaksi yang gagal diproses</p>
            </div>
            {renderTransactionTable(failedOrders, true)}
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Semua Transaksi</h3>
              <p className="text-sm text-gray-600">Riwayat lengkap semua transaksi</p>
            </div>
            {renderTransactionTable(orders, true)}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderTransactionTable(data: any[], showActions: boolean) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Order ID</th>
              <th className="text-left py-3">Game</th>
              <th className="text-left py-3">Product</th>
              <th className="text-left py-3">User ID</th>
              <th className="text-left py-3">Amount</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Date</th>
              {showActions && <th className="text-left py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map((order: any) => (
              <tr key={order.id} className="border-b">
                <td className="py-4">#{order.id}</td>
                <td className="py-4">{order.game_name || order.product?.game?.name || '-'}</td>
                <td className="py-4">{order.product_name || order.product?.product_name || '-'}</td>
                <td className="py-4">{order.target_user_id || order.player_id || '-'}</td>
                <td className="py-4">Rp {(order.total_amount || order.total_price || 0).toLocaleString()}</td>
                <td className="py-4">{getStatusBadge(order.status)}</td>
                <td className="py-4">
                  <div className="text-sm">
                    <div>{new Date(order.created_at).toLocaleDateString('id-ID')}</div>
                    <div className="text-gray-500">{new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </td>
                {showActions && (
                  <td className="py-4">
                    <div className="flex gap-2">
                      {(order.status === 'paid' || order.status === 'topup_failed') && (
                        <Button 
                          size="sm" 
                          onClick={() => {
                            if (confirm(`Yakin ingin menyelesaikan order #${order.id} secara manual?`)) {
                              updateOrderStatus(order.id, 'completed');
                            }
                          }}
                        >
                          Manual Complete
                        </Button>
                      )}
                      {(order.status === 'pending' || order.status === 'waiting_payment') && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              if (confirm(`Yakin ingin menyelesaikan order #${order.id}?`)) {
                                updateOrderStatus(order.id, 'completed');
                              }
                            }}
                          >
                            Complete
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => {
                              if (confirm(`Yakin ingin menolak order #${order.id}? Tindakan ini tidak dapat dibatalkan.`)) {
                                updateOrderStatus(order.id, 'failed');
                              }
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus order #${order.id}? Tindakan ini tidak dapat dibatalkan.`)) {
                            deleteOrder(order.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan={showActions ? 8 : 7} className="py-8 text-center text-gray-500">
                  Tidak ada transaksi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}