<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class NotificationService
{
    public static function createAnnouncementNotifications($announcement)
    {
        if (!$announcement->is_active) {
            return;
        }

        $customers = User::where('role', 'customer')->get();
        $notifications = [];
        
        foreach ($customers as $customer) {
            $notification = Notification::create([
                'user_id' => $customer->id,
                'title' => '📢 ' . $announcement->title,
                'message' => $announcement->content,
                'type' => $announcement->type,
                'read' => false
            ]);
            
            $notifications[] = $notification;
        }

        // Send real-time notification via WebSocket
        self::broadcastNotification([
            'event' => 'notification.new',
            'data' => [
                'title' => '📢 ' . $announcement->title,
                'message' => $announcement->content,
                'type' => $announcement->type,
                'count' => count($notifications)
            ]
        ]);

        return $notifications;
    }

    public static function broadcastNotification($data)
    {
        try {
            Http::timeout(2)->post('http://127.0.0.1:6001/broadcast', $data);
        } catch (\Exception $e) {
            // Silent fail if WebSocket server is not running
            \Log::info('WebSocket broadcast failed: ' . $e->getMessage());
        }
    }
}