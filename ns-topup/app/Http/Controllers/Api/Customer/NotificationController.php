<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user() ?? User::where('role', 'customer')->first();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                    'data' => []
                ]);
            }
            
            $notifications = $user->notifications()
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function($notification) {
                    return [
                        'id' => $notification->id,
                        'title' => $notification->title,
                        'message' => $notification->message,
                        'type' => $notification->type,
                        'read' => $notification->read,
                        'created_at' => $notification->created_at->diffForHumans()
                    ];
                });

            $unreadCount = $user->notifications()->where('read', false)->count();
            
            return response()->json([
                'success' => true,
                'data' => $notifications,
                'unread_count' => $unreadCount
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
                'data' => []
            ]);
        }
    }

    public function unreadCount()
    {
        try {
            $user = Auth::user() ?? User::where('role', 'customer')->first();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                    'data' => ['unread_count' => 0]
                ]);
            }
            
            $count = $user->notifications()->where('read', false)->count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'unread_count' => $count
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
                'data' => ['unread_count' => 0]
            ]);
        }
    }

    public function markAsRead(Request $request)
    {
        $request->validate([
            'notification_id' => 'required|integer'
        ]);

        $user = Auth::user() ?? User::find(1); // Use authenticated user or fallback
        
        $notification = $user->notifications()->find($request->notification_id);
        
        if ($notification) {
            $notification->update(['read' => true]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Notifikasi ditandai sudah dibaca'
        ]);
    }

    public function markAllAsRead()
    {
        $user = Auth::user() ?? User::find(1); // Use authenticated user or fallback
        
        $user->notifications()->where('read', false)->update(['read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Semua notifikasi ditandai sudah dibaca'
        ]);
    }
}