<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\TopupProduct;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * @OA\Get(
     *     path="/orders",
     *     summary="Get user orders",
     *     tags={"Orders"},
     *     @OA\Response(
     *         response=200,
     *         description="List of user orders",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="game_name", type="string", example="Mobile Legends"),
     *                     @OA\Property(property="product_name", type="string", example="86 Diamonds"),
     *                     @OA\Property(property="player_id", type="string", example="123456789"),
     *                     @OA\Property(property="total_price", type="string", example="22000.00"),
     *                     @OA\Property(property="status", type="string", example="success"),
     *                     @OA\Property(property="payment_method", type="string", example="QRIS"),
     *                     @OA\Property(property="created_at", type="string", example="2025-11-21T10:00:00.000000Z")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $orders = Order::with(['product.game', 'user'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * @OA\Post(
     *     path="/orders",
     *     summary="Create new order",
     *     tags={"Orders"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="product_id", type="integer", example=1),
     *             @OA\Property(property="player_id", type="string", example="123456789"),
     *             @OA\Property(property="server_id", type="string", example="1234"),
     *             @OA\Property(property="payment_method", type="string", example="QRIS")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Order created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Order created successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="status", type="string", example="waiting_payment")
     *             )
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'target_user_id' => 'required|string', // player_id or phone_number
            'server_id' => 'nullable|string',
            'payment_method' => 'required|string'
        ]);

        $product = TopupProduct::with('game')->findOrFail($request->product_id);

        // Handle both authenticated and public access
        $userId = auth()->check() ? auth()->id() : 1; // Default to user ID 1 for testing

        $order = Order::create([
            'user_id' => $userId,
            'product_id' => $product->id,
            'game_name' => $product->game->name,
            'product_name' => $product->product_name,
            'player_id' => $request->target_user_id,
            'server_id' => $request->server_id,
            'total_price' => $product->price,
            'payment_method' => $request->payment_method,
            'status' => 'waiting_payment'
        ]);

        return response()->json([
            'success' => true,
            'data' => $order,
            'message' => 'Order created successfully'
        ], 201);
    }

    public function show($orderId)
    {
        $order = Order::with(['product.game', 'user'])
            ->where('user_id', auth()->id())
            ->findOrFail($orderId);

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }
}
