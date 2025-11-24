<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Game;

class GameController extends Controller
{
    /**
     * @OA\Get(
     *     path="/customer/games",
     *     summary="Get all games with products",
     *     tags={"Customer - Games"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of games with products",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="slug", type="string"),
     *                 @OA\Property(property="icon_url", type="string"),
     *                 @OA\Property(property="topup_products", type="array", @OA\Items(
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="product_name", type="string"),
     *                     @OA\Property(property="amount", type="integer"),
     *                     @OA\Property(property="price", type="number"),
     *                     @OA\Property(property="base_price", type="number")
     *                 ))
     *             )
     *         )
     *     )
     * )
    public function index()
    {
        $games = Game::with('topupProducts')->get();
        
        return response()->json($games);
    }

    /**
     * @OA\Get(
     *     path="/customer/games/{id}",
     *     summary="Get game detail with products",
     *     tags={"Customer - Games"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Game detail with products"
     *     )
     * )
     */
    public function show($id)
    {
        $game = Game::with('topupProducts')->findOrFail($id);
        
        return response()->json($game);
    }
}