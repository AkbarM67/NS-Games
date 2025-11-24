<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalRevenue = Order::where('status', 'success')->sum('total_price');
        $totalTransactions = Order::count();
        $totalUsers = User::where('role', 'customer')->count();
        
        $successOrders = Order::where('status', 'success')->count();
        $successRate = $totalTransactions > 0 ? ($successOrders / $totalTransactions) * 100 : 0;

        $recentTransactions = Order::with(['user', 'product.game'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function($order) {
                return [
                    'id' => $order->id,
                    'user' => $order->user->email ?? 'N/A',
                    'product' => $order->game_name . ' - ' . $order->product_name,
                    'amount' => $order->total_price,
                    'status' => $order->status,
                    'date' => $order->created_at->format('Y-m-d H:i:s')
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'totalRevenue' => $totalRevenue,
                'totalTransactions' => $totalTransactions,
                'totalUsers' => $totalUsers,
                'successRate' => round($successRate, 1),
                'recentTransactions' => $recentTransactions
            ]
        ]);
    }
}