<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/admin/games",
     *     summary="Get all games for admin",
     *     tags={"Admin - Games"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of all games",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Mobile Legends"),
     *                     @OA\Property(property="category", type="string", example="MOBA"),
     *                     @OA\Property(property="description", type="string", example="MOBA game populer"),
     *                     @OA\Property(property="image", type="string", example="https://example.com/image.jpg"),
     *                     @OA\Property(property="is_active", type="boolean", example=true)
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $games = Game::with('topupProducts')->get();

        return response()->json([
            'success' => true,
            'data' => $games
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/admin/games",
     *     summary="Create new game",
     *     tags={"Admin - Games"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Mobile Legends"),
     *             @OA\Property(property="category", type="string", example="MOBA"),
     *             @OA\Property(property="description", type="string", example="MOBA game populer"),
     *             @OA\Property(property="image", type="string", example="https://example.com/image.jpg"),
     *             @OA\Property(property="is_active", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Game created successfully"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $game = Game::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $game,
            'message' => 'Game created successfully'
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/api/admin/games/{id}",
     *     summary="Update game",
     *     tags={"Admin - Games"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Game updated successfully"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $game = Game::findOrFail($id);
        $game->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $game,
            'message' => 'Game updated successfully'
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/admin/games/{id}",
     *     summary="Delete game",
     *     tags={"Admin - Games"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Game deleted successfully"
     *     )
     * )
     */
    public function destroy($id)
    {
        $game = Game::findOrFail($id);
        $game->delete();

        return response()->json([
            'success' => true,
            'message' => 'Game deleted successfully'
        ]);
    }
}
