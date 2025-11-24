<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::withCount('topupProducts')->paginate(15);
        return response()->json($games);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = [
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ];

        if ($request->hasFile('icon')) {
            $data['icon_url'] = $request->file('icon')->store('games', 'public');
        }

        $game = Game::create($data);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'create',
            'model' => 'Game',
            'model_id' => $game->id,
            'new_values' => $data,
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Game created successfully',
            'game' => $game
        ]);
    }

    public function show($id)
    {
        $game = Game::with('topupProducts')->findOrFail($id);
        return response()->json($game);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $game = Game::findOrFail($id);
        $oldValues = $game->toArray();

        $data = [
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ];

        if ($request->hasFile('icon')) {
            if ($game->icon_url) {
                Storage::delete($game->icon_url);
            }
            $data['icon_url'] = $request->file('icon')->store('games', 'public');
        }

        $game->update($data);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'update',
            'model' => 'Game',
            'model_id' => $game->id,
            'old_values' => $oldValues,
            'new_values' => $data,
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Game updated successfully',
            'game' => $game
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $game = Game::findOrFail($id);
        $oldValues = $game->toArray();

        if ($game->icon_url) {
            Storage::delete($game->icon_url);
        }

        $game->delete();

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'delete',
            'model' => 'Game',
            'model_id' => $id,
            'old_values' => $oldValues,
            'ip_address' => $request->ip(),
        ]);

        return response()->json(['message' => 'Game deleted successfully']);
    }
}
