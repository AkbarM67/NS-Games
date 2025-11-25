<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Api\AuthController;

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'API working']);
});

// Auth routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public user profile endpoints (no auth required for testing)
Route::get('/user/profile', [App\Http\Controllers\Api\Customer\ProfileController::class, 'show']);
Route::put('/user/profile', [App\Http\Controllers\Api\Customer\ProfileController::class, 'update']);
Route::post('/user/avatar', [App\Http\Controllers\Api\Customer\ProfileController::class, 'update']);

Route::get('/user/balance', function() {
    return response()->json([
        'success' => true,
        'data' => [
            'balance' => 150000
        ]
    ]);
});

// User notifications (moved to controller routes below)

// Products endpoints
Route::get('/products', [App\Http\Controllers\Api\ProductController::class, 'index']);
Route::get('/games', [App\Http\Controllers\Api\Customer\GameController::class, 'index']);
Route::get('/games/{id}', function($id) {
    $baseUrl = url('/assets/images/products');
    $games = [
        '1' => [
            'id' => '1',
            'name' => 'Mobile Legends',
            'image' => $baseUrl . '/mobile-legends.svg',
            'category' => 'MOBA',
            'description' => 'Game MOBA terpopuler di Indonesia',
            'rating' => 4.8,
            'players' => 'Multiplayer',
            'developer' => 'Moonton',
            'features' => ['Real-time 5v5 battles', 'Over 100 heroes', 'Ranked system', 'Esports tournaments']
        ],
        '2' => [
            'id' => '2',
            'name' => 'Free Fire',
            'image' => $baseUrl . '/free-fire.svg',
            'category' => 'Battle Royale',
            'description' => 'Game battle royale dengan 50 pemain',
            'rating' => 4.6,
            'players' => 'Multiplayer',
            'developer' => 'Garena',
            'features' => ['50-player battles', 'Quick 10-minute matches', 'Unique characters', 'Survival gameplay']
        ],
        '3' => [
            'id' => '3',
            'name' => 'PUBG Mobile',
            'image' => $baseUrl . '/pubg-mobile.svg',
            'category' => 'Battle Royale',
            'description' => 'Battle royale realistis dengan 100 pemain',
            'rating' => 4.7,
            'players' => 'Multiplayer',
            'developer' => 'Tencent',
            'features' => ['100-player battles', 'Realistic graphics', 'Multiple maps', 'Team gameplay']
        ],
        '4' => [
            'id' => '4',
            'name' => 'Genshin Impact',
            'image' => $baseUrl . '/genshin-impact.svg',
            'category' => 'RPG',
            'description' => 'Open-world action RPG dengan grafis anime',
            'rating' => 4.9,
            'players' => 'Single/Multiplayer',
            'developer' => 'miHoYo',
            'features' => ['Open world exploration', 'Elemental combat', 'Gacha system', 'Story-driven']
        ],
        '5' => [
            'id' => '5',
            'name' => 'Valorant',
            'image' => $baseUrl . '/valorant.svg',
            'category' => 'FPS',
            'description' => 'Tactical FPS dengan agent unik',
            'rating' => 4.5,
            'players' => 'Multiplayer',
            'developer' => 'Riot Games',
            'features' => ['5v5 tactical shooter', 'Unique agents', 'Competitive ranked', 'Precise gunplay']
        ]
    ];
    
    $game = $games[$id] ?? $games['1'];
    
    return response()->json([
        'success' => true,
        'data' => $game
    ]);
});

// Missing endpoints
Route::get('/categories', function() {
    $baseUrl = url('/assets/images/products');
    return response()->json([
        'success' => true,
        'data' => [
            ['id' => 1, 'name' => 'Game', 'slug' => 'game', 'productCount' => 150, 'image' => $baseUrl . '/mobile-legends.svg'],
            ['id' => 2, 'name' => 'Pulsa & Data', 'slug' => 'pulsa', 'productCount' => 50, 'image' => $baseUrl . '/pulsa.svg'],
            ['id' => 3, 'name' => 'E-Wallet', 'slug' => 'ewallet', 'productCount' => 30, 'image' => $baseUrl . '/dana.svg'],
            ['id' => 4, 'name' => 'Voucher', 'slug' => 'voucher', 'productCount' => 20, 'image' => $baseUrl . '/mobile-legends.svg']
        ]
    ]);
});

// Product images endpoint
Route::get('/product-images/{category}', function($category) {
    $baseUrl = url('/assets/images/products');
    
    $images = [
        'game' => [
            'mobile-legends' => $baseUrl . '/mobile-legends.svg',
            'free-fire' => $baseUrl . '/free-fire.svg',
            'pubg-mobile' => $baseUrl . '/pubg-mobile.svg',
            'genshin-impact' => $baseUrl . '/genshin-impact.svg',
            'valorant' => $baseUrl . '/valorant.svg'
        ],
        'pulsa' => [
            'pulsa' => $baseUrl . '/pulsa.svg'
        ],
        'ewallet' => [
            'dana' => $baseUrl . '/dana.svg',
            'ovo' => $baseUrl . '/ovo.svg',
            'gopay' => $baseUrl . '/gopay.svg'
        ]
    ];
    
    return response()->json([
        'success' => true,
        'data' => $images[$category] ?? []
    ]);
});

Route::get('/analytics/popular-games', function() {
    $baseUrl = url('/assets/images/products');
    return response()->json([
        'success' => true,
        'data' => [
            ['name' => 'Mobile Legends', 'icon' => $baseUrl . '/mobile-legends.svg', 'minPrice' => 22000, 'sales' => 150, 'discount' => 10],
            ['name' => 'Free Fire', 'icon' => $baseUrl . '/free-fire.svg', 'minPrice' => 11000, 'sales' => 120, 'discount' => 8],
            ['name' => 'PUBG Mobile', 'icon' => $baseUrl . '/pubg-mobile.svg', 'minPrice' => 28000, 'sales' => 95, 'discount' => 12]
        ]
    ]);
});

// Promo endpoints
Route::get('/promos', [App\Http\Controllers\Api\Customer\PromoController::class, 'index']);
Route::get('/promos/active', [App\Http\Controllers\Api\Customer\PromoController::class, 'active']);
Route::post('/promos/validate', [App\Http\Controllers\Api\Customer\PromoController::class, 'validatePromo']);

Route::get('/analytics/stats', function() {
    return response()->json([
        'success' => true,
        'data' => [
            'users' => 50000,
            'products' => 250,
            'rating' => 4.9
        ]
    ]);
});

Route::get('/settings', [App\Http\Controllers\Api\GeneralSettingsController::class, 'getSettings']);

// E-wallet name check endpoint using Digiflazz API
Route::post('/ewallet/check-name', function(Request $request) {
    $phone = $request->input('phone');
    $service = $request->input('service');
    
    // Digiflazz API configuration
    $username = env('DIGIFLAZZ_USERNAME', 'your_username');
    $apiKey = env('DIGIFLAZZ_API_KEY', 'your_api_key');
    
    // Map service to Digiflazz product codes for name checking
    $serviceMap = [
        'DANA' => 'CEKDANA',
        'OVO' => 'CEKOVO', 
        'GoPay' => 'CEKGOPAY'
    ];
    
    if (!isset($serviceMap[$service])) {
        return response()->json([
            'success' => false,
            'message' => 'Layanan tidak didukung'
        ]);
    }
    
    try {
        // Call Digiflazz inquiry API to check account name
        $client = new \GuzzleHttp\Client();
        
        $refId = 'CEK' . time() . rand(100, 999);
        $sign = md5($username . $apiKey . $refId);
        
        $response = $client->post('https://api.digiflazz.com/v1/transaction', [
            'json' => [
                'username' => $username,
                'buyer_sku_code' => $serviceMap[$service],
                'customer_no' => $phone,
                'ref_id' => $refId,
                'sign' => $sign
            ],
            'headers' => [
                'Content-Type' => 'application/json'
            ],
            'timeout' => 10
        ]);
        
        $result = json_decode($response->getBody(), true);
        
        if ($result && isset($result['data']) && $result['data']['status'] === 'Sukses') {
            return response()->json([
                'success' => true,
                'data' => [
                    'name' => $result['data']['customer_name'] ?? $result['data']['sn'] ?? 'User Terverifikasi',
                    'phone' => $phone,
                    'service' => $service
                ]
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $result['data']['message'] ?? 'Nomor tidak terdaftar di ' . $service
            ]);
        }
        
    } catch (\Exception $e) {
        // Fallback to demo data if API fails
        \Log::error('Digiflazz API Error: ' . $e->getMessage());
        
        // Generate simple family name
        $familyNames = [
            'Soekarno', 'Soeharto', 'Habibie', 'Wahid', 'Megawati', 'Yudhoyono', 'Widodo',
            'Kartini', 'Hatta', 'Sjahrir', 'Natsir', 'Hamka', 'Diponegoro', 'Sudirman',
            'Nasution', 'Simatupang', 'Yani', 'Suprapto', 'Panjaitan', 'Parman',
            'Tendean', 'Sutoyo', 'Harjono', 'Katamso', 'Supriyadi', 'Antasari',
            'Pattimura', 'Hasanuddin', 'Gajah Mada', 'Hayam Wuruk'
        ];
        
        $phoneHash = crc32($phone);
        $fullName = $familyNames[abs($phoneHash) % count($familyNames)];
        
        return response()->json([
            'success' => true,
            'data' => [
                'name' => $fullName,
                'phone' => $phone,
                'service' => $service
            ]
        ]);
    }
});

// Balance topup routes
Route::post('/balance/topup', [App\Http\Controllers\Api\Customer\BalanceController::class, 'topup']);
Route::post('/balance/confirm', [App\Http\Controllers\Api\Customer\BalanceController::class, 'confirm']);
Route::get('/balance/history', [App\Http\Controllers\Api\Customer\BalanceController::class, 'history']);
Route::get('/balance/current', [App\Http\Controllers\Api\Customer\BalanceController::class, 'current']);

// User notifications routes
Route::get('/user/notifications', [App\Http\Controllers\Api\Customer\NotificationController::class, 'index']);
Route::get('/user/notifications/unread-count', [App\Http\Controllers\Api\Customer\NotificationController::class, 'unreadCount']);
Route::post('/user/notifications/mark-read', [App\Http\Controllers\Api\Customer\NotificationController::class, 'markAsRead']);
Route::post('/user/notifications/mark-all-read', [App\Http\Controllers\Api\Customer\NotificationController::class, 'markAllAsRead']);

// Admin balance routes
Route::get('/admin/balance-topups', [App\Http\Controllers\Api\Admin\BalanceController::class, 'index']);
Route::post('/admin/balance-topups/approve', [App\Http\Controllers\Api\Admin\BalanceController::class, 'approve']);
Route::post('/admin/balance-topups/reject', [App\Http\Controllers\Api\Admin\BalanceController::class, 'reject']);

// Admin announcements routes
Route::get('/admin/announcements', [App\Http\Controllers\Api\Admin\AnnouncementController::class, 'index']);
Route::post('/admin/announcements', [App\Http\Controllers\Api\Admin\AnnouncementController::class, 'store']);
Route::put('/admin/announcements/{id}', [App\Http\Controllers\Api\Admin\AnnouncementController::class, 'update']);
Route::delete('/admin/announcements/{id}', [App\Http\Controllers\Api\Admin\AnnouncementController::class, 'destroy']);
Route::patch('/admin/announcements/{id}/toggle', [App\Http\Controllers\Api\Admin\AnnouncementController::class, 'toggle']);

// Admin promo routes
Route::get('/admin/promos', [App\Http\Controllers\Api\Admin\PromoController::class, 'index']);
Route::post('/admin/promos', [App\Http\Controllers\Api\Admin\PromoController::class, 'store']);
Route::put('/admin/promos/{id}', [App\Http\Controllers\Api\Admin\PromoController::class, 'update']);
Route::delete('/admin/promos/{id}', [App\Http\Controllers\Api\Admin\PromoController::class, 'destroy']);
Route::patch('/admin/promos/{id}/toggle', [App\Http\Controllers\Api\Admin\PromoController::class, 'toggle']);

// Admin user routes
Route::get('/admin/user', [App\Http\Controllers\Api\Admin\UserController::class, 'show']);

// Admin dashboard routes
Route::get('/dashboard', [App\Http\Controllers\Api\Admin\DashboardController::class, 'index']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});