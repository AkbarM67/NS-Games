<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\PromoController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Products (Public)
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/popular', [ProductController::class, 'popular']);
    Route::get('/category/{category}', [ProductController::class, 'byCategory']);
    Route::get('/{id}', [ProductController::class, 'show']);
});

// Promos (Public)
Route::get('/promos', [PromoController::class, 'index']);
Route::get('/promos/active', [PromoController::class, 'active']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // User profile
    Route::prefix('user')->group(function () {
        Route::get('/profile', [UserController::class, 'profile']);
        Route::put('/profile', [UserController::class, 'updateProfile']);
        Route::post('/topup', [UserController::class, 'topup']);
        Route::get('/balance', [UserController::class, 'balance']);
        Route::get('/referral', [UserController::class, 'referral']);
    });

    // Transactions
    Route::prefix('transactions')->group(function () {
        Route::get('/', [TransactionController::class, 'index']);
        Route::post('/', [TransactionController::class, 'store']);
        Route::get('/statistics', [TransactionController::class, 'statistics']);
        Route::get('/{id}', [TransactionController::class, 'show']);
    });

    // Promo code validation
    Route::post('/promos/validate', [PromoController::class, 'validate']);
});

// Admin routes (require admin role)
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    
    // Products management
    Route::prefix('products')->group(function () {
        Route::post('/', [ProductController::class, 'store']);
        Route::put('/{id}', [ProductController::class, 'update']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);
    });

    // Transactions management
    Route::prefix('transactions')->group(function () {
        Route::get('/all', [TransactionController::class, 'adminIndex']);
        Route::put('/{transactionId}/status', [TransactionController::class, 'updateStatus']);
    });

    // Users management
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}/balance', [UserController::class, 'updateBalance']);
        Route::put('/{id}/block', [UserController::class, 'blockUser']);
    });

    // Promos management
    Route::prefix('promos')->group(function () {
        Route::post('/', [PromoController::class, 'store']);
        Route::put('/{id}', [PromoController::class, 'update']);
        Route::delete('/{id}', [PromoController::class, 'destroy']);
    });

    // Dashboard statistics
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/reports', [AdminController::class, 'reports']);
});

// Webhook endpoints (for payment gateway callbacks)
Route::post('/webhook/payment/{provider}', [TransactionController::class, 'paymentWebhook']);
