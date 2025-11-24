<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Order;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function dashboard()
    {
        $games = Game::withCount('topupProducts')
            ->with(['topupProducts' => function($query) {
                $query->orderBy('price', 'asc')->limit(1);
            }])
            ->get()
            ->map(function($game) {
                $game->min_price = $game->topupProducts->first()->price ?? null;
                return $game;
            });

        return view('customer.dashboard', compact('games'));
    }

    public function games()
    {
        $games = Game::with('topupProducts')->get();
        return view('customer.games', compact('games'));
    }

    public function orders()
    {
        $orders = Order::with(['product.game'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return view('customer.orders', compact('orders'));
    }

    public function gameTopup($gameId)
    {
        $game = Game::with('topupProducts')->findOrFail($gameId);
        return view('customer.game-topup', compact('game'));
    }

    public function profile()
    {
        return view('customer.profile');
    }

    public function createOrder(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:topup_products,id',
            'player_id' => 'required|string',
            'server_id' => 'nullable|string',
            'payment_method' => 'required|string'
        ]);

        $product = \App\Models\TopupProduct::with('game')->findOrFail($request->product_id);
        
        $order = Order::create([
            'user_id' => auth()->id(),
            'product_id' => $product->id,
            'game_name' => $product->game->name,
            'product_name' => $product->product_name,
            'player_id' => $request->player_id,
            'server_id' => $request->server_id,
            'amount' => $product->amount ?? 0,
            'total_price' => $product->price,
            'payment_method' => $request->payment_method,
            'status' => 'waiting_payment'
        ]);

        return redirect()->route('customer.orders')->with('success', 'Pesanan berhasil dibuat!');
    }
}