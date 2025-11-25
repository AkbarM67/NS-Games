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
        // Return mock data with consistent IDs and product images
        $baseUrl = url('/assets/images/products');
        $games = [
            [
                'id' => '1',
                'name' => 'Mobile Legends',
                'image' => $baseUrl . '/mobile-legends.svg',
                'category' => 'MOBA',
                'description' => 'Game MOBA terpopuler di Indonesia',
                'rating' => 4.8,
                'players' => 'Multiplayer',
                'productCount' => 15
            ],
            [
                'id' => '2', 
                'name' => 'Free Fire',
                'image' => $baseUrl . '/free-fire.svg',
                'category' => 'Battle Royale',
                'description' => 'Game battle royale dengan 50 pemain',
                'rating' => 4.6,
                'players' => 'Multiplayer',
                'productCount' => 12
            ],
            [
                'id' => '3',
                'name' => 'PUBG Mobile', 
                'image' => $baseUrl . '/pubg-mobile.svg',
                'category' => 'Battle Royale',
                'description' => 'Battle royale realistis dengan 100 pemain',
                'rating' => 4.7,
                'players' => 'Multiplayer',
                'productCount' => 10
            ],
            [
                'id' => '4',
                'name' => 'Genshin Impact',
                'image' => $baseUrl . '/genshin-impact.svg',
                'category' => 'RPG', 
                'description' => 'Open-world action RPG dengan grafis anime',
                'rating' => 4.9,
                'players' => 'Single/Multiplayer',
                'productCount' => 8
            ],
            [
                'id' => '5',
                'name' => 'Valorant',
                'image' => $baseUrl . '/valorant.svg',
                'category' => 'FPS',
                'description' => 'Tactical FPS dengan agent unik',
                'rating' => 4.5,
                'players' => 'Multiplayer', 
                'productCount' => 6
            ]
        ];

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