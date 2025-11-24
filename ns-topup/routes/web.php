<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\CustomerController;
use App\Http\Controllers\Web\AdminController;

// Home page
Route::get('/', function () {
    if (auth()->check()) {
        $user = auth()->user();
        if ($user->role === 'admin') {
            return redirect('http://localhost/NS-topupgames/dist/admin/');
        } else {
            return redirect('http://localhost/NS-topupgames/dist/customer/');
        }
    }
    return redirect()->route('login');
});

// Auth routes
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// API Documentation - handled by L5-Swagger package automatically

// Customer routes (authenticated)
Route::middleware(['auth'])->prefix('customer')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerController::class, 'dashboard'])->name('dashboard');
    Route::get('/games', [CustomerController::class, 'games'])->name('games');
    Route::get('/orders', [CustomerController::class, 'orders'])->name('orders');
    Route::get('/profile', [CustomerController::class, 'profile'])->name('profile');
    Route::get('/game/{game}/topup', [CustomerController::class, 'gameTopup'])->name('game.topup');
    Route::post('/order/create', [CustomerController::class, 'createOrder'])->name('order.create');
});

// Admin routes (authenticated + admin)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

    // Orders
    Route::get('/orders', [AdminController::class, 'orders'])->name('orders.index');
    Route::patch('/orders/{order}/status', [AdminController::class, 'updateOrderStatus'])->name('orders.update-status');

    // Games
    Route::get('/games', [AdminController::class, 'games'])->name('games.index');
    Route::get('/games/create', [AdminController::class, 'createGame'])->name('games.create');
    Route::post('/games', [AdminController::class, 'storeGame'])->name('games.store');
    Route::get('/games/{game}/edit', [AdminController::class, 'editGame'])->name('games.edit');
    Route::put('/games/{game}', [AdminController::class, 'updateGame'])->name('games.update');
    Route::delete('/games/{game}', [AdminController::class, 'destroyGame'])->name('games.destroy');

    // Transactions
    Route::get('/transactions', function() { return view('admin.transactions.index'); })->name('transactions.index');
    Route::get('/transactions/pending', function() { return view('admin.transactions.pending'); })->name('transactions.pending');
    Route::get('/transactions/{id}', function() { return view('admin.transactions.detail'); })->name('transactions.detail');

    // Products
    Route::get('/products', function() { return view('admin.products'); })->name('products.index');

    // Users
    Route::get('/users', function() { return view('admin.users.index'); })->name('users.index');

    // Payments
    Route::get('/payments', function() { return view('admin.payments.index'); })->name('payments.index');

    // Providers
    Route::get('/providers', function() { return view('admin.providers.index'); })->name('providers.index');

    // Promos
    Route::get('/promos', function() { return view('admin.promos.index'); })->name('promos.index');

    // Resellers
    Route::get('/resellers', function() { return view('admin.resellers.index'); })->name('resellers.index');

    // Support
    Route::get('/support', function() { return view('admin.support.index'); })->name('support.index');
    Route::get('/support/tickets', function() { return view('admin.support.tickets'); })->name('support.tickets');

    // Reports
    Route::get('/reports', function() { return view('admin.reports.index'); })->name('reports.index');

    // Analytics
    Route::get('/analytics', function() { return view('admin.analytics'); })->name('analytics');

    // Finance
    Route::get('/finance', function() { return view('admin.finance'); })->name('finance');

    // Marketing
    Route::get('/marketing', function() { return view('admin.marketing'); })->name('marketing');

    // Customers
    Route::get('/customers', [AdminController::class, 'customers'])->name('customers.index');
    Route::patch('/customers/{user}/block', [AdminController::class, 'blockCustomer'])->name('customers.block');

    // Payment Methods
    Route::resource('payment-methods', \App\Http\Controllers\Admin\PaymentMethodController::class);

    // Settings
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
    Route::post('/settings', [AdminController::class, 'updateSettings'])->name('settings.update');
});

// Public routes
Route::get('/games', [CustomerController::class, 'games'])->name('games.public');

// Redirect untuk backward compatibility
Route::get('/home', function () {
    if (auth()->user()->role === 'admin') {
        return redirect('/admin/dashboard');
    }
    return redirect('/customer/dashboard');
})->middleware('auth');