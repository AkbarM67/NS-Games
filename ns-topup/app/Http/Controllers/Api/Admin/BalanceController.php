<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BalanceTopup;
use App\Models\Notification;
use Illuminate\Http\Request;

class BalanceController extends Controller
{
    public function index()
    {
        $topups = BalanceTopup::with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($topup) {
                return [
                    'id' => $topup->id,
                    'user_name' => $topup->user->name,
                    'user_email' => $topup->user->email,
                    'amount' => $topup->amount,
                    'payment_method' => $topup->payment_method,
                    'status' => $topup->status,
                    'reference_id' => $topup->reference_id,
                    'created_at' => $topup->created_at->format('d/m/Y H:i')
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $topups
        ]);
    }

    public function approve(Request $request)
    {
        $request->validate([
            'topup_id' => 'required|integer'
        ]);

        $topup = BalanceTopup::find($request->topup_id);
        
        if (!$topup) {
            return response()->json(['success' => false, 'message' => 'Topup tidak ditemukan'], 404);
        }

        if ($topup->status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'Topup sudah diproses'], 400);
        }

        // Approve topup
        $topup->update(['status' => 'success']);
        
        // Add balance to user
        $user = $topup->user;
        $user->increment('balance', $topup->amount);
        
        // Create notification
        Notification::create([
            'user_id' => $user->id,
            'title' => 'Topup Disetujui',
            'message' => "Topup saldo Rp " . number_format($topup->amount, 0, ',', '.') . " telah disetujui admin",
            'type' => 'success'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Topup berhasil disetujui'
        ]);
    }

    public function reject(Request $request)
    {
        $request->validate([
            'topup_id' => 'required|integer',
            'reason' => 'required|string'
        ]);

        $topup = BalanceTopup::find($request->topup_id);
        
        if (!$topup) {
            return response()->json(['success' => false, 'message' => 'Topup tidak ditemukan'], 404);
        }

        $topup->update(['status' => 'failed']);
        
        // Create notification
        Notification::create([
            'user_id' => $topup->user_id,
            'title' => 'Topup Ditolak',
            'message' => "Topup saldo Rp " . number_format($topup->amount, 0, ',', '.') . " ditolak. Alasan: " . $request->reason,
            'type' => 'error'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Topup berhasil ditolak'
        ]);
    }
}