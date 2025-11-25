<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\BalanceTopup;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class BalanceController extends Controller
{
    public function topup(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10000|max:5000000',
            'payment_method' => 'required|string'
        ]);

        $user = User::find(1); // Mock user ID for demo
        
        $referenceId = 'TOPUP-' . time() . '-' . rand(1000, 9999);
        
        $topup = BalanceTopup::create([
            'user_id' => $user->id,
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'reference_id' => $referenceId,
            'payment_instructions' => $this->getPaymentInstructions($request->payment_method, $request->amount),
            'expires_at' => now()->addHours(24)
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'topup_id' => $topup->id,
                'reference_id' => $referenceId,
                'amount' => $topup->amount,
                'payment_method' => $topup->payment_method,
                'payment_instructions' => $topup->payment_instructions,
                'expires_at' => $topup->expires_at,
                'status' => $topup->status
            ]
        ]);
    }

    public function confirm(Request $request)
    {
        $request->validate([
            'reference_id' => 'required|string'
        ]);

        $topup = BalanceTopup::where('reference_id', $request->reference_id)->first();
        
        if (!$topup) {
            return response()->json(['success' => false, 'message' => 'Topup tidak ditemukan'], 404);
        }

        // Simulate payment confirmation (in real app, this would be webhook from payment gateway)
        $topup->update(['status' => 'success']);
        
        // Add balance to user
        $user = $topup->user;
        $user->increment('balance', $topup->amount);
        
        // Create notification
        Notification::create([
            'user_id' => $user->id,
            'title' => 'Topup Berhasil',
            'message' => "Saldo Anda berhasil ditambah Rp " . number_format($topup->amount, 0, ',', '.'),
            'type' => 'success'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Topup berhasil dikonfirmasi',
            'data' => [
                'new_balance' => $user->balance
            ]
        ]);
    }

    public function history()
    {
        $user = User::find(1); // Mock user ID
        
        $topups = $user->balanceTopups()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($topup) {
                return [
                    'id' => $topup->id,
                    'reference_id' => $topup->reference_id,
                    'amount' => $topup->amount,
                    'payment_method' => $topup->payment_method,
                    'status' => $topup->status,
                    'created_at' => $topup->created_at->format('d/m/Y H:i')
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $topups
        ]);
    }

    public function current()
    {
        $user = User::find(1); // Mock user ID
        
        return response()->json([
            'success' => true,
            'data' => [
                'balance' => $user->balance
            ]
        ]);
    }

    private function getPaymentInstructions($method, $amount)
    {
        $instructions = [
            'bank_transfer' => "Transfer ke rekening BCA 7751629722 a.n Akbar Maulana sebesar Rp " . number_format($amount, 0, ',', '.'),
            'dana' => "Buka aplikasi DANA, pilih Transfer, masukkan nomor 089662658999 sebesar Rp " . number_format($amount, 0, ',', '.'),
            'ovo' => "Buka aplikasi OVO, pilih Transfer, masukkan nomor 089662658999 sebesar Rp " . number_format($amount, 0, ',', '.'),
            'gopay' => "Buka aplikasi GoPay, pilih Transfer, masukkan nomor 089662658999 sebesar Rp " . number_format($amount, 0, ',', '.')
        ];

        return $instructions[$method] ?? "Silakan lakukan pembayaran sebesar Rp " . number_format($amount, 0, ',', '.');
    }
}