import { useState } from "react";
import { ArrowLeft, CreditCard, Smartphone, Building2, QrCode } from "lucide-react";
import { Card } from "../SimpleUI";
import { Button } from "../SimpleUI";
import { Input } from "../SimpleUI";
import api from "../../lib/api";

interface TopupBalanceProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function TopupBalance({ onBack, onSuccess }: TopupBalanceProps) {
  const [step, setStep] = useState<'amount' | 'payment' | 'instructions'>('amount');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [loading, setLoading] = useState(false);
  const [topupData, setTopupData] = useState<any>(null);

  const predefinedAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

  const paymentMethods = [
    { id: 'bank_transfer', name: 'Transfer Bank', icon: Building2, desc: 'BCA, Mandiri, BRI, BNI' },
    { id: 'dana', name: 'DANA', icon: Smartphone, desc: 'Transfer via DANA' },
    { id: 'ovo', name: 'OVO', icon: Smartphone, desc: 'Transfer via OVO' },
    { id: 'gopay', name: 'GoPay', icon: Smartphone, desc: 'Transfer via GoPay' }
  ];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getCurrentAmount = () => {
    return selectedAmount || parseInt(customAmount) || 0;
  };

  const handleNextStep = () => {
    const amount = getCurrentAmount();
    if (amount >= 10000) {
      setStep('payment');
    }
  };

  const handlePaymentSelect = (paymentId: string) => {
    setSelectedPayment(paymentId);
  };

  const handleCreateTopup = async () => {
    const amount = getCurrentAmount();
    
    if (!selectedPayment || amount < 10000) return;

    setLoading(true);
    try {
      const response = await api.post('/balance/topup', {
        amount: amount,
        payment_method: selectedPayment
      });

      if (response.data.success) {
        setTopupData(response.data.data);
        setStep('instructions');
      }
    } catch (error) {
      console.error('Error creating topup:', error);
      alert('Gagal membuat topup');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!topupData) return;

    setLoading(true);
    try {
      const response = await api.post('/balance/confirm', {
        reference_id: topupData.reference_id
      });

      if (response.data.success) {
        alert('Topup berhasil dikonfirmasi!');
        onSuccess();
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Gagal mengkonfirmasi pembayaran');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl">Topup Saldo</h1>
          <p className="text-gray-600">Isi saldo untuk kemudahan transaksi</p>
        </div>
      </div>

      {/* Step 1: Amount Selection */}
      {step === 'amount' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg mb-4">Pilih Nominal Topup</h3>
            
            {/* Predefined Amounts */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedAmount === amount
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium">Rp {amount.toLocaleString()}</p>
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">Atau masukkan nominal custom</label>
              <Input
                type="number"
                placeholder="Minimal Rp 10.000"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-gray-500 mt-1">Minimal Rp 10.000 - Maksimal Rp 5.000.000</p>
            </div>
          </Card>

          <Button 
            onClick={handleNextStep}
            disabled={getCurrentAmount() < 10000}
            className="w-full"
            size="lg"
          >
            Lanjut - Rp {getCurrentAmount().toLocaleString()}
          </Button>
        </div>
      )}

      {/* Step 2: Payment Method */}
      {step === 'payment' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">Pilih Metode Pembayaran</h3>
              <p className="text-blue-600 font-medium">Rp {getCurrentAmount().toLocaleString()}</p>
            </div>
            
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentSelect(method.id)}
                    className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                      selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-600">{method.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('amount')} className="flex-1">
              Kembali
            </Button>
            <Button 
              onClick={handleCreateTopup}
              disabled={!selectedPayment || loading}
              className="flex-1"
            >
              {loading ? 'Memproses...' : 'Buat Topup'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Payment Instructions */}
      {step === 'instructions' && topupData && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg mb-4">Instruksi Pembayaran</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 mb-2">ID Transaksi:</p>
              <p className="font-mono font-medium text-blue-900">{topupData.reference_id}</p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nominal:</p>
                <p className="text-xl font-medium">Rp {topupData.amount.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Metode Pembayaran:</p>
                <p className="font-medium">{paymentMethods.find(m => m.id === selectedPayment)?.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Instruksi:</p>
                <div className="bg-gray-50 border rounded-lg p-3">
                  <p className="text-sm">{topupData.payment_instructions}</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  ⏰ Selesaikan pembayaran dalam 24 jam. Setelah transfer, klik "Konfirmasi Pembayaran"
                </p>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Kembali ke Profile
            </Button>
            <Button 
              onClick={handleConfirmPayment}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Mengkonfirmasi...' : 'Konfirmasi Pembayaran'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}