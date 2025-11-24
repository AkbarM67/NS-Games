<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'API working']);
});

// Test customers route
Route::get('/test-customers', function () {
    $users = \App\Models\User::all();
    return response()->json([
        'success' => true,
        'count' => $users->count(),
        'data' => $users->take(5)
    ]);
});

// Auth routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public routes (no auth required)
Route::post('/digiflazz/test', [App\Http\Controllers\Api\DigiflazzController::class, 'testConnection']);
Route::get('/digiflazz/balance', [App\Http\Controllers\Api\DigiflazzController::class, 'getBalance']);
Route::get('/digiflazz/price-list', [App\Http\Controllers\Api\DigiflazzController::class, 'getPriceList']);
Route::post('/providers/save', [App\Http\Controllers\Api\ProviderSettingsController::class, 'saveProviders']);
Route::get('/settings', [App\Http\Controllers\Api\GeneralSettingsController::class, 'getSettings']);
Route::post('/settings/save', [App\Http\Controllers\Api\GeneralSettingsController::class, 'saveSettings']);
Route::post('/settings/upload-logo', [App\Http\Controllers\Api\GeneralSettingsController::class, 'uploadLogo']);
Route::get('/dashboard', [App\Http\Controllers\Api\DashboardController::class, 'index']);
Route::get('/admin/dashboard', [App\Http\Controllers\Api\DashboardController::class, 'index']);
Route::get('/providers', [App\Http\Controllers\Api\ProviderController::class, 'index']);

// Customer public routes
Route::prefix('customer')->group(function () {
    Route::get('/games', [App\Http\Controllers\Api\Customer\GameController::class, 'index']);
    Route::get('/games/{gameId}/products', [App\Http\Controllers\Api\Customer\GameController::class, 'products']);
});

// Public games endpoint (no auth required)
Route::get('/games', [App\Http\Controllers\Api\Customer\GameController::class, 'index']);
Route::get('/popular/games', [App\Http\Controllers\Api\Customer\PopularController::class, 'games']);

// Products endpoints
Route::get('/products', [App\Http\Controllers\Api\ProductController::class, 'index']);
Route::get('/products/{id}', [App\Http\Controllers\Api\ProductController::class, 'show']);

// Swagger documentation
Route::get('/documentation', function () {
    return redirect('/api/documentation');
});

// Admin endpoints
Route::prefix('admin')->group(function () {
    // Products
    Route::post('/products', [App\Http\Controllers\Api\Admin\ProductController::class, 'store']);
    Route::put('/products/{id}', [App\Http\Controllers\Api\Admin\ProductController::class, 'update']);
    Route::delete('/products/{id}', [App\Http\Controllers\Api\Admin\ProductController::class, 'destroy']);
    
    // Product sync
    Route::post('/products/sync', [App\Http\Controllers\Api\Admin\ProductSyncController::class, 'syncFromDigiflazz']);
    Route::get('/products/sync-status', [App\Http\Controllers\Api\Admin\ProductSyncController::class, 'getSyncStatus']);
    Route::post('/products/auto-sync', [App\Http\Controllers\Api\Admin\ProductSyncController::class, 'enableAutoSync']);
    
    // Games
    Route::get('/games', [App\Http\Controllers\Api\Admin\GameController::class, 'index']);
});

// Public games endpoint
Route::get('/games', [App\Http\Controllers\Api\Customer\GameController::class, 'index']);
Route::get('/games/{gameId}/products', [App\Http\Controllers\Api\Customer\GameController::class, 'products']);

// Mobile API endpoints
Route::prefix('mobile')->group(function () {
    Route::get('/games', [App\Http\Controllers\Api\Customer\GameController::class, 'index']);
    Route::get('/products', [App\Http\Controllers\Api\ProductController::class, 'index']);
    Route::get('/games/{gameId}/products', [App\Http\Controllers\Api\Customer\GameController::class, 'products']);
});

// Public orders endpoint for testing (no auth required)
Route::post('/test/orders', [App\Http\Controllers\Api\Customer\OrderController::class, 'store']);

// Payment routes
Route::post('/payment/create', [App\Http\Controllers\Api\PaymentController::class, 'createPayment']);
Route::post('/payment/webhook', [App\Http\Controllers\Api\PaymentController::class, 'webhook']);
Route::get('/payment/status/{orderId}', [App\Http\Controllers\Api\PaymentController::class, 'checkStatus']);
Route::post('/midtrans/test', [App\Http\Controllers\Api\MidtransTestController::class, 'testConnection']);

// Public endpoints for admin frontend (no auth required for testing)
Route::get('/admin/orders', [App\Http\Controllers\Api\OrderController::class, 'index']);
Route::patch('/admin/orders/{order}/status', [App\Http\Controllers\Api\OrderController::class, 'updateStatus']);
Route::delete('/admin/orders/{order}', [App\Http\Controllers\Api\OrderController::class, 'destroy']);
// Public admin profile update
Route::post('/admin/profile', function(\Illuminate\Http\Request $request) {
    try {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'avatar' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $adminUser = \App\Models\User::where('role', 'admin')->first();
        if (!$adminUser) {
            return response()->json([
                'success' => false,
                'message' => 'Admin user not found'
            ]);
        }
        
        // Update basic fields
        if ($request->has('name')) {
            $adminUser->name = $request->name;
        }
        if ($request->has('phone')) {
            $adminUser->phone = $request->phone;
        }
        
        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Create uploads/avatars directory if it doesn't exist
            $uploadPath = public_path('uploads/avatars');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }
            
            // Delete old avatar if exists
            if ($adminUser->avatar_url && file_exists(public_path($adminUser->avatar_url))) {
                unlink(public_path($adminUser->avatar_url));
            }
            
            $avatar = $request->file('avatar');
            $filename = 'avatar_admin_' . $adminUser->id . '_' . time() . '.' . $avatar->getClientOriginalExtension();
            $avatar->move($uploadPath, $filename);
            $adminUser->avatar_url = '/uploads/avatars/' . $filename;
        }
        
        $adminUser->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'id' => $adminUser->id,
                'name' => $adminUser->name,
                'phone' => $adminUser->phone,
                'avatar_url' => $adminUser->avatar_url
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ]);
    }
});
// Public user endpoint for admin frontend
Route::get('/admin/user', function() {
    $adminUser = \App\Models\User::where('role', 'admin')->first();
    if ($adminUser) {
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $adminUser->id,
                'role' => $adminUser->role,
                'avatar_url' => $adminUser->avatar_url,
                'name' => $adminUser->name,
                'username' => $adminUser->username,
                'email' => $adminUser->email,
                'phone' => $adminUser->phone,
                'balance' => $adminUser->balance,
                'email_verified_at' => $adminUser->email_verified_at,
                'created_at' => $adminUser->created_at,
                'updated_at' => $adminUser->updated_at,
                'is_blocked' => $adminUser->is_blocked
            ]
        ]);
    }
    return response()->json([
        'success' => false,
        'message' => 'No admin user found'
    ]);
});

// Admin users list endpoint
Route::get('/admin/users', function() {
    $adminUsers = \App\Models\User::where('role', 'admin')->get();
    return response()->json([
        'success' => true,
        'data' => $adminUsers->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar_url' => $user->avatar_url,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at
            ];
        })
    ]);
});

// Add new admin endpoint
Route::post('/admin/users', function(\Illuminate\Http\Request $request) {
    try {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6'
        ]);

        $admin = \App\Models\User::create([
            'name' => $request->name,
            'username' => strtolower(str_replace(' ', '', $request->name)),
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'admin'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Admin berhasil ditambahkan',
            'data' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], 400);
    }
});

// Update admin endpoint
Route::put('/admin/users/{id}', function(\Illuminate\Http\Request $request, $id) {
    try {
        $admin = \App\Models\User::where('role', 'admin')->findOrFail($id);
        
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id
        ];
        
        if ($request->filled('password')) {
            $rules['password'] = 'string|min:6';
        }
        
        $request->validate($rules);

        $admin->update([
            'name' => $request->name,
            'username' => strtolower(str_replace(' ', '', $request->name)),
            'email' => $request->email,
            ...(($request->filled('password')) ? ['password' => bcrypt($request->password)] : [])
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Admin berhasil diupdate',
            'data' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], 400);
    }
});

// Delete admin endpoint
Route::delete('/admin/users/{id}', function($id) {
    try {
        $admin = \App\Models\User::where('role', 'admin')->findOrFail($id);
        
        // Prevent deleting the last admin
        $adminCount = \App\Models\User::where('role', 'admin')->count();
        if ($adminCount <= 1) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus admin terakhir'
            ], 400);
        }
        
        $admin->delete();

        return response()->json([
            'success' => true,
            'message' => 'Admin berhasil dihapus'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], 400);
    }
});

// Announcements endpoints
Route::get('/admin/announcements', function() {
    try {
        $announcements = \App\Models\Announcement::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $announcements
        ]);
    } catch (\Exception $e) {
        // Fallback data if Announcement model doesn't exist
        return response()->json([
            'success' => true,
            'data' => [
                [
                    'id' => 1,
                    'title' => 'Selamat Datang di NS Games!',
                    'content' => 'Platform topup game terpercaya dengan harga terbaik.',
                    'type' => 'info',
                    'is_active' => true,
                    'created_at' => now()->subDays(2),
                    'updated_at' => now()->subDays(2)
                ],
                [
                    'id' => 2,
                    'title' => 'Maintenance Server',
                    'content' => 'Server akan maintenance pada tanggal 25 November 2025.',
                    'type' => 'warning',
                    'is_active' => true,
                    'created_at' => now()->subDay(),
                    'updated_at' => now()->subDay()
                ]
            ]
        ]);
    }
});

Route::post('/admin/announcements', function(\Illuminate\Http\Request $request) {
    try {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:info,warning,success,error',
            'is_active' => 'boolean'
        ]);

        $announcement = \App\Models\Announcement::create($request->all());
        
        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil ditambahkan',
            'data' => $announcement
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], 400);
    }
});

Route::put('/admin/announcements/{id}', function(\Illuminate\Http\Request $request, $id) {
    try {
        $announcement = \App\Models\Announcement::findOrFail($id);
        
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:info,warning,success,error',
            'is_active' => 'boolean'
        ]);

        $announcement->update($request->all());
        
        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil diupdate',
            'data' => $announcement
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], 400);
    }
});

Route::delete('/admin/announcements/{id}', function($id) {
    try {
        $announcement = \App\Models\Announcement::findOrFail($id);
        $announcement->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil dihapus'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], 400);
    }
});

Route::patch('/admin/announcements/{id}/toggle', function(\Illuminate\Http\Request $request, $id) {
    try {
        $announcement = \App\Models\Announcement::findOrFail($id);
        $announcement->update(['is_active' => $request->is_active]);
        
        return response()->json([
            'success' => true,
            'message' => 'Status pengumuman berhasil diubah'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], 400);
    }
});

// Activity logs endpoint
Route::get('/admin/activity-logs', function() {
    try {
        $logs = \App\Models\ActivityLog::orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        // If no logs found, return fallback data
        if ($logs->isEmpty()) {
            return response()->json([
                'success' => true,
                'data' => [
                    [
                        'id' => 1,
                        'action' => 'login',
                        'description' => 'Admin melakukan login',
                        'created_at' => now()->subHours(2)
                    ],
                    [
                        'id' => 2,
                        'action' => 'profile_update',
                        'description' => 'Admin mengupdate profil',
                        'created_at' => now()->subHours(5)
                    ],
                    [
                        'id' => 3,
                        'action' => 'settings_update',
                        'description' => 'Pengaturan sistem diubah',
                        'created_at' => now()->subDay()
                    ]
                ]
            ]);
        }
        
        return response()->json([
            'success' => true,
            'data' => $logs->map(function($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'description' => $log->description,
                    'created_at' => $log->created_at
                ];
            })
        ]);
    } catch (\Exception $e) {
        // Fallback if ActivityLog model doesn't exist
        return response()->json([
            'success' => true,
            'data' => [
                [
                    'id' => 1,
                    'action' => 'login',
                    'description' => 'Admin melakukan login',
                    'created_at' => now()->subHours(2)
                ],
                [
                    'id' => 2,
                    'action' => 'profile_update',
                    'description' => 'Admin mengupdate profil',
                    'created_at' => now()->subHours(5)
                ],
                [
                    'id' => 3,
                    'action' => 'settings_update',
                    'description' => 'Pengaturan sistem diubah',
                    'created_at' => now()->subDay()
                ]
            ]
        ]);
    }
});

// Public customers endpoint for admin frontend
Route::get('/admin/customers', function() {
    $customers = \App\Models\User::where('role', 'customer')
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($user) {
            $totalSpent = 0; // Simplified for now
            $totalOrders = 0; // Simplified for now
            
            $level = 'bronze';
            if ($totalSpent >= 15000000) $level = 'platinum';
            elseif ($totalSpent >= 5000000) $level = 'gold';
            elseif ($totalSpent >= 1000000) $level = 'silver';
            
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '-',
                'role' => $user->role,
                'avatar_url' => $user->avatar_url,
                'balance' => floatval($user->balance ?? 0),
                'total_spent' => $totalSpent,
                'total_orders' => $totalOrders,
                'level' => $level,
                'is_blocked' => $user->is_blocked ?? false,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at
            ];
        });
    
    return response()->json([
        'success' => true,
        'data' => $customers
    ]);
});

Route::patch('/admin/customers/{user}/block', function($userId) {
    try {
        $user = \App\Models\User::findOrFail($userId);
        $user->update(['is_blocked' => !$user->is_blocked]);
        
        return response()->json([
            'success' => true,
            'message' => $user->is_blocked ? 'User blocked' : 'User unblocked'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ]);
    }
});

Route::delete('/admin/customers/{user}', function($userId) {
    try {
        $user = \App\Models\User::findOrFail($userId);
        $user->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ]);
    }
});

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Admin only routes
    Route::middleware('admin')->group(function () {
        // Products Management
        Route::prefix('admin')->group(function () {
            // Route::apiResource('products', App\Http\Controllers\Api\Admin\ProductController::class);
            Route::apiResource('games', App\Http\Controllers\Api\Admin\GameController::class);
        });
        
        // Legacy routes (will be moved to public)
        Route::get('/system/ip', [App\Http\Controllers\Api\SystemController::class, 'getIpInfo']);
        Route::get('/customers', [App\Http\Controllers\Api\Admin\CustomerController::class, 'index']);
        Route::patch('/customers/{user}/block', [App\Http\Controllers\Api\Admin\CustomerController::class, 'block']);
    });
    
    // Customer protected routes
    Route::prefix('customer')->group(function () {
        Route::get('/games', [App\Http\Controllers\Api\Customer\GameController::class, 'index']);
        Route::get('/games/{gameId}/products', [App\Http\Controllers\Api\Customer\GameController::class, 'products']);
        Route::get('/orders', [App\Http\Controllers\Api\Customer\OrderController::class, 'index']);
        Route::post('/orders', [App\Http\Controllers\Api\Customer\OrderController::class, 'store']);
        Route::get('/orders/{orderId}', [App\Http\Controllers\Api\Customer\OrderController::class, 'show']);
        Route::get('/profile', [App\Http\Controllers\Api\Customer\ProfileController::class, 'show']);
        Route::put('/profile', [App\Http\Controllers\Api\Customer\ProfileController::class, 'update']);
        Route::post('/profile', [App\Http\Controllers\Api\Customer\ProfileController::class, 'update']);
        Route::post('/topup-balance', [App\Http\Controllers\Api\Customer\ProfileController::class, 'topupBalance']);
    });
    
    // Public endpoints for frontend-customer
    Route::get('/orders', [App\Http\Controllers\Api\Customer\OrderController::class, 'index']);
    Route::get('/user/profile', [App\Http\Controllers\Api\Customer\ProfileController::class, 'show']);
});