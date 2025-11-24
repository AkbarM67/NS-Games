<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Game;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * @OA\Get(
     *     path="/admin/dashboard",
     *     summary="Get admin dashboard statistics",
     *     tags={"Admin - Dashboard"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Dashboard statistics"
     *     )
     * )
     */
    public function index()
    {
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'success')->sum('total_price');
        $totalCustomers = User::where('role', 'customer')->count();
        $pendingOrders = Order::where('status', 'pending')->count();

        // Sales chart data (last 7 days)
        $salesData = Order::where('status', 'success')
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_price) as total'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top games
        $topGames = Game::withCount(['orders' => function($query) {
            $query->where('status', 'success');
        }])
        ->orderBy('orders_count', 'desc')
        ->take(5)
        ->get();

        // Recent orders
        $recentOrders = Order::with(['user', 'product.game'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'stats' => [
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
                'total_customers' => $totalCustomers,
                'pending_orders' => $pendingOrders,
            ],
            'sales_data' => $salesData,
            'top_games' => $topGames,
            'recent_orders' => $recentOrders,
        ]);
    }
}