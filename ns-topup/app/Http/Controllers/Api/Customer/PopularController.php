<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class PopularController extends Controller
{
    public function games()
    {
        $popularGames = Game::select('games.*')
            ->join('topup_products', 'games.id', '=', 'topup_products.game_id')
            ->join('orders', 'topup_products.id', '=', 'orders.product_id')
            ->where('orders.status', 'success')
            ->where('orders.created_at', '>=', now()->subWeek())
            ->groupBy('games.id', 'games.name', 'games.category', 'games.description', 'games.image', 'games.is_active', 'games.created_at', 'games.updated_at')
            ->selectRaw('COUNT(orders.id) as sales_count')
            ->orderBy('sales_count', 'desc')
            ->limit(3)
            ->get()
            ->map(function($game, $index) {
                return [
                    'rank' => $index + 1,
                    'name' => $game->name,
                    'sales' => $game->sales_count,
                    'trend' => '+' . rand(5, 20) . '%'
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $popularGames
        ]);
    }
}