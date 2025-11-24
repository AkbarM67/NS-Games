<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Game;
use App\Models\Discount;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'success')->sum('total_price');
        $totalCustomers = User::where('role', 'customer')->count();
        $totalGames = Game::count();

        $recentOrders = Order::with(['user', 'product.game'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $topGames = Game::take(5)->get()->map(function($game) {
            $game->orders_count = 0; // Default value
            return $game;
        });

        return view('admin.dashboard', compact(
            'totalOrders',
            'totalRevenue',
            'totalCustomers',
            'totalGames',
            'recentOrders',
            'topGames'
        ));
    }

    public function orders()
    {
        $orders = Order::with(['user', 'product.game'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return view('admin.orders', compact('orders'));
    }



    public function games()
    {
        $games = Game::paginate(10);
        return view('admin.games.index', compact('games'));
    }

    public function createGame()
    {
        return view('admin.games.create');
    }

    public function storeGame(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'base_price' => 'required|numeric|min:0',
            'profit_margin' => 'required|numeric|min:0|max:100'
        ]);

        Game::create($request->all());
        return redirect()->route('admin.games.index')->with('success', 'Game berhasil ditambahkan');
    }

    public function editGame(Game $game)
    {
        return view('admin.games.edit', compact('game'));
    }

    public function updateGame(Request $request, Game $game)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'base_price' => 'required|numeric|min:0',
            'profit_margin' => 'required|numeric|min:0|max:100'
        ]);

        $game->update($request->all());
        return redirect()->route('admin.games.index')->with('success', 'Game berhasil diupdate');
    }

    public function destroyGame(Game $game)
    {
        $game->delete();
        return redirect()->route('admin.games.index')->with('success', 'Game berhasil dihapus');
    }

    public function discounts()
    {
        $discounts = Discount::with('game')->paginate(10);
        return view('admin.discounts.index', compact('discounts'));
    }

    public function settings()
    {
        $settings = [
            'app_fee' => Setting::getValue('app_fee', 0),
            'profit_margin' => Setting::getValue('profit_margin', 10)
        ];
        return view('admin.settings', compact('settings'));
    }

    public function updateSettings(Request $request)
    {
        Setting::setValue('app_fee', $request->app_fee, 'number', 'Biaya aplikasi per transaksi');
        Setting::setValue('profit_margin', $request->profit_margin, 'number', 'Margin keuntungan default (%)');

        return redirect()->back()->with('success', 'Pengaturan berhasil disimpan');
    }

    public function customers()
    {
        $customers = User::where('role', 'customer')->paginate(10);
        return view('admin.customers', compact('customers'));
    }

    public function paymentMethods()
    {
        $paymentMethods = \App\Models\PaymentMethod::all();
        return view('admin.payment-methods', compact('paymentMethods'));
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $request->validate(['status' => 'required|in:pending,processing,success,failed']);
        $order->update(['status' => $request->status]);
        return redirect()->back()->with('success', 'Order status updated successfully');
    }

    public function blockCustomer(Request $request, User $user)
    {
        $user->update(['is_active' => !$user->is_active]);
        $status = $user->is_active ? 'unblocked' : 'blocked';
        return redirect()->back()->with('success', "Customer {$status} successfully");
    }


}
