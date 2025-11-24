<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderLog;
use App\Models\TopupProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    /**
     * @OA\Get(
     *     path="/customer/orders",
     *     summary="Get customer orders history",
     *     tags={"Customer - Orders"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of customer orders"
     *     )
     * )
    public function index(Request $request)
    {
        $orders = Order::with(['product.game'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($orders);
    }

    /**
     * @OA\Post(
     *     path="/customer/orders",
     *     summary="Create new order",
     *     tags={"Customer - Orders"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"product_id","player_id","payment_method"},
     *             @OA\Property(property="product_id", type="integer", example=1),
     *             @OA\Property(property="player_id", type="string", example="123456789"),
     *             @OA\Property(property="server_id", type="string", example="2001"),
     *             @OA\Property(property="payment_method", type="string", example="BCA")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Order created successfully"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:topup_products,id',
            'player_id' => 'required|string',
            'server_id' => 'nullable|string',
            'payment_method' => 'required|string',
        ]);

        $product = TopupProduct::findOrFail($request->product_id);

        $order = Order::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
            'player_id' => $request->player_id,
            'server_id' => $request->server_id,
            'payment_method' => $request->payment_method,
            'total_price' => $product->price,
            'status' => 'waiting_payment',
        ]);

        OrderLog::create([
            'order_id' => $order->id,
            'status_after' => 'waiting_payment',
            'note' => 'Order created',
        ]);

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order->load(['product.game'])
        ]);
    }

    public function show($id, Request $request)
    {
        $order = Order::with(['product.game', 'orderLogs'])
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($order);
    }

    /**
     * @OA\Post(
     *     path="/customer/orders/{id}/payment-proof",
     *     summary="Upload payment proof",
     *     tags={"Customer - Orders"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="payment_proof",
     *                     type="string",
     *                     format="binary"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Payment proof uploaded successfully"
     *     )
     * )
     */
    public function uploadPaymentProof(Request $request, $id)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $order = Order::where('user_id', $request->user()->id)
            ->where('status', 'waiting_payment')
            ->findOrFail($id);

        if ($order->payment_proof_url) {
            Storage::delete($order->payment_proof_url);
        }

        $path = $request->file('payment_proof')->store('payment_proofs', 'public');

        $order->update([
            'payment_proof_url' => $path,
            'status' => 'pending'
        ]);

        OrderLog::create([
            'order_id' => $order->id,
            'status_before' => 'waiting_payment',
            'status_after' => 'pending',
            'note' => 'Payment proof uploaded',
        ]);

        return response()->json([
            'message' => 'Payment proof uploaded successfully',
            'order' => $order
        ]);
    }
}
