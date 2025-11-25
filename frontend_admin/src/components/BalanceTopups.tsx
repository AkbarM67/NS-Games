import { useState, useEffect } from "react";
import api from "../lib/api";
import { CheckCircle, XCircle, Clock, User, CreditCard, Calendar } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useRealTime } from "../hooks/useRealTime";
import { toast } from "sonner";

interface BalanceTopup {
  id: number;
  user_name: string;
  user_email: string;
  amount: number;
  payment_method: string;
  status: 'pending' | 'success' | 'failed';
  reference_id: string;
  created_at: string;
}

export function BalanceTopups() {
  const [topups, setTopups] = useState<BalanceTopup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopup, setSelectedTopup] = useState<BalanceTopup | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useRealTime({
    onDashboardUpdate: () => {
      fetchTopups();
    }
  });

  useEffect(() => {
    fetchTopups();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchTopups, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchTopups = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/balance-topups');
      if (response.data.success) {
        setTopups(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching topups:', error);
      toast.error('Gagal memuat data topup');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (topupId: number) => {
    if (!confirm('Yakin ingin menyetujui topup ini?')) return;
    
    try {
      const response = await api.post('/admin/balance-topups/approve', {
        topup_id: topupId
      });
      
      if (response.data.success) {
        toast.success('Topup berhasil disetujui');
        fetchTopups();
      }
    } catch (error) {
      console.error('Error approving topup:', error);
      toast.error('Gagal menyetujui topup');
    }
  };

  const handleReject = async () => {
    if (!selectedTopup || !rejectReason.trim()) return;
    
    try {
      const response = await api.post('/admin/balance-topups/reject', {
        topup_id: selectedTopup.id,
        reason: rejectReason
      });
      
      if (response.data.success) {
        toast.success('Topup berhasil ditolak');
        setShowRejectDialog(false);
        setRejectReason('');
        setSelectedTopup(null);
        fetchTopups();
      }
    } catch (error) {
      console.error('Error rejecting topup:', error);
      toast.error('Gagal menolak topup');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Berhasil</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodName = (method: string) => {
    const methods: { [key: string]: string } = {
      'bank_transfer': 'Transfer Bank',
      'dana': 'DANA',
      'ovo': 'OVO',
      'gopay': 'GoPay'
    };
    return methods[method] || method;
  };

  const filteredTopups = topups.filter(topup => 
    filterStatus === 'all' || topup.status === filterStatus
  );

  const stats = {
    total: topups.length,
    pending: topups.filter(t => t.status === 'pending').length,
    success: topups.filter(t => t.status === 'success').length,
    failed: topups.filter(t => t.status === 'failed').length,
    totalAmount: topups
      .filter(t => t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Topup Saldo</h1>
          <p className="text-gray-600">Kelola permintaan topup saldo customer</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Topup</p>
          <p className="text-3xl">{stats.total}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Pending</p>
          <p className="text-3xl text-yellow-600">{stats.pending}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Berhasil</p>
          <p className="text-3xl text-green-600">{stats.success}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Ditolak</p>
          <p className="text-3xl text-red-600">{stats.failed}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Nilai</p>
          <p className="text-2xl text-blue-600">Rp {stats.totalAmount.toLocaleString()}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex gap-4">
          <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
                filterStatus === 'all' ? 'bg-white shadow-sm' : 'hover:bg-white hover:shadow-sm'
              }`}
            >
              Semua
            </button>
            <button 
              onClick={() => setFilterStatus('pending')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
                filterStatus === 'pending' ? 'bg-white shadow-sm' : 'hover:bg-white hover:shadow-sm'
              }`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilterStatus('success')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
                filterStatus === 'success' ? 'bg-white shadow-sm' : 'hover:bg-white hover:shadow-sm'
              }`}
            >
              Berhasil
            </button>
            <button 
              onClick={() => setFilterStatus('failed')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
                filterStatus === 'failed' ? 'bg-white shadow-sm' : 'hover:bg-white hover:shadow-sm'
              }`}
            >
              Ditolak
            </button>
          </div>
        </div>
      </Card>

      {/* Topups List */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <Card className="p-12">
            <div className="text-center">Loading...</div>
          </Card>
        ) : filteredTopups.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada data topup</p>
            </div>
          </Card>
        ) : (
          filteredTopups.map((topup) => (
            <Card key={topup.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium">{topup.user_name}</h3>
                      {getStatusBadge(topup.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{topup.user_email}</p>
                    <p className="text-xs text-gray-500">ID: {topup.reference_id}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 mb-1">
                    Rp {topup.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    {getPaymentMethodName(topup.payment_method)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {topup.created_at}
                  </p>
                </div>

                {topup.status === 'pending' && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleApprove(topup.id)}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Setujui
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedTopup(topup);
                        setShowRejectDialog(true);
                      }}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Tolak
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Topup</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Alasan Penolakan</Label>
              <Textarea
                placeholder="Masukkan alasan penolakan..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectReason('');
                  setSelectedTopup(null);
                }}
                variant="outline" 
                className="flex-1"
              >
                Batal
              </Button>
              <Button 
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Tolak Topup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}