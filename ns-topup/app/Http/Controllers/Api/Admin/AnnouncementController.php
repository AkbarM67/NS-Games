<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $announcements->map(function($announcement) {
                return [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'content' => $announcement->content,
                    'type' => $announcement->type,
                    'is_active' => $announcement->is_active,
                    'created_at' => $announcement->created_at->format('d/m/Y H:i'),
                    'updated_at' => $announcement->updated_at->format('d/m/Y H:i')
                ];
            })
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:info,warning,success,error',
            'is_active' => 'boolean'
        ]);

        $announcement = Announcement::create($request->all());

        // Auto-create notification for all customers when announcement is active
        NotificationService::createAnnouncementNotifications($announcement);

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil ditambahkan dan notifikasi dikirim ke customer',
            'data' => $announcement
        ]);
    }

    public function update(Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);
        
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
    }

    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil dihapus'
        ]);
    }

    public function toggle(Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);
        $wasInactive = !$announcement->is_active;
        
        $announcement->update(['is_active' => $request->is_active]);

        // Auto-create notification when announcement is activated
        if ($request->is_active && $wasInactive) {
            NotificationService::createAnnouncementNotifications($announcement);
        }

        return response()->json([
            'success' => true,
            'message' => 'Status pengumuman berhasil diubah' . ($request->is_active && $wasInactive ? ' dan notifikasi dikirim ke customer' : '')
        ]);
    }
}