<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Auth routes
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Test route untuk debug notifikasi
Route::get('/test-notifications', function() {
    $user = \App\Models\User::where('role', 'customer')->first();
    if (!$user) {
        return 'No customer found';
    }
    
    $notifications = $user->notifications()->get();
    return response()->json([
        'user' => $user->name,
        'notifications_count' => $notifications->count(),
        'notifications' => $notifications
    ]);
});

// Test route untuk create sample notification
Route::get('/create-test-notification', function() {
    $user = \App\Models\User::where('role', 'customer')->first();
    if (!$user) {
        return 'No customer found';
    }
    
    $notification = \App\Models\Notification::create([
        'user_id' => $user->id,
        'title' => 'Test Notification',
        'message' => 'This is a test notification',
        'type' => 'info',
        'read' => false
    ]);
    
    return response()->json([
        'success' => true,
        'notification' => $notification
    ]);
});

// Test route untuk create announcement dan notification
Route::get('/test-announcement', function() {
    $announcement = \App\Models\Announcement::create([
        'title' => 'Test Announcement',
        'content' => 'This is a test announcement from admin',
        'type' => 'info',
        'is_active' => true
    ]);
    
    $customers = \App\Models\User::where('role', 'customer')->get();
    $notifications = [];
    
    foreach ($customers as $customer) {
        $notification = \App\Models\Notification::create([
            'user_id' => $customer->id,
            'title' => '📢 ' . $announcement->title,
            'message' => $announcement->content,
            'type' => $announcement->type,
            'read' => false
        ]);
        $notifications[] = $notification;
    }
    
    return response()->json([
        'success' => true,
        'announcement' => $announcement,
        'notifications_created' => count($notifications)
    ]);
});