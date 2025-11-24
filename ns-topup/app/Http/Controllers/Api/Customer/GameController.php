<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\TopupProduct;

/**
 * @OA\Tag(
 *     name="Mobile API",
 *     description="Public endpoints for mobile applications"
 * )
 */
class GameController extends Controller
{
    /**
     * @OA\Get(
     *     path="/games",
     *     summary="Get all games with products",
     *     tags={"Games"},
     *     @OA\Response(
     *         response=200,
     *         description="List of games with products",
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
     *                     @OA\Property(
     *                         property="products",
     *                         type="array",
     *                         @OA\Items(
     *                             @OA\Property(property="id", type="integer", example=1),
     *                             @OA\Property(property="product_name", type="string", example="86 Diamonds"),
     *                             @OA\Property(property="price", type="string", example="22000.00"),
     *                             @OA\Property(property="sku_code", type="string", example="ML_86")
     *                         )
     *                     )
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $games = Game::with(['products' => function($query) {
            $query->orderBy('price');
        }])->where('is_active', true)->get();

        // Transform data to match frontend expectations
        $games = $games->map(function($game) {
            $game->products = $game->products->map(function($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->product_name,
                    'price' => $product->price,
                    'sku_code' => $product->sku_code
                ];
            });
            return $game;
        });

        return response()->json([
            'success' => true,
            'data' => $games
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/mobile/games/{gameId}/products",
     *     summary="Get products by game ID",
     *     tags={"Mobile API"},
     *     @OA\Parameter(
     *         name="gameId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         description="Game ID"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Game products retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="game", type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Mobile Legends")
     *                 ),
     *                 @OA\Property(property="products", type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="name", type="string", example="86 Diamonds"),
     *                         @OA\Property(property="price", type="string", example="22000.00"),
     *                         @OA\Property(property="sku_code", type="string", example="ML_86")
     *                     )
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function products($gameId)
    {
        $game = Game::with(['products' => function($query) {
            $query->orderBy('price');
        }])->findOrFail($gameId);

        // Transform products
        $products = $game->products->map(function($product) {
            return [
                'id' => $product->id,
                'name' => $product->product_name,
                'price' => $product->price,
                'sku_code' => $product->sku_code
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'game' => $game,
                'products' => $products
            ]
        ]);
    }
}