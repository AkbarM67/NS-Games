<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderLog;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * @OA\Get(
     *     path="/admin/orders",
     *     summary="Get all orders for admin",
     *     tags={"Admin - Orders"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of orders"
     *     )
     * )
    public function index(Request $request)
    {
        $query = Order::with(['user', 'product.game']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->search) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with(['user', 'product.game', 'orderLogs'])
            ->findOrFail($id);

        return response()->json($order);
    }

    /**
     * @OA\Put(
     *     path="/admin/orders/{id}/status",
     *     summary="Update order status",
     *     tags={"Admin - Orders"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", enum={"pending","processing","success","failed"}),
     *             @OA\Property(property="note", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Order status updated successfully"
     *     )
     * )
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,success,failed',
            'note' => 'nullable|string',
        ]);

        $order = Order::findOrFail($id);
        $oldStatus = $order->status;

        $order->update(['status' => $request->status]);

        OrderLog::create([
            'order_id' => $order->id,
            'status_before' => $oldStatus,
            'status_after' => $request->status,
            'note' => $request->note,
        ]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'update',
            'model' => 'Order',
            'model_id' => $order->id,
            'old_values' => ['status' => $oldStatus],
            'new_values' => ['status' => $request->status],
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->load(['user', 'product.game'])
        ]);
    }
}