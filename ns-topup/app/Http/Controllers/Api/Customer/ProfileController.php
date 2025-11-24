<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Customer - Profile",
 *     description="Customer profile management"
 * )
 */
class ProfileController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/customer/profile",
     *     summary="Get customer profile",
     *     tags={"Customer - Profile"},
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="Profile retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", example="john@example.com"),
     *             @OA\Property(property="phone", type="string", example="081234567890"),
     *             @OA\Property(property="balance", type="number", example=50000),
     *             @OA\Property(property="level", type="string", example="Bronze"),
     *             @OA\Property(property="total_orders", type="integer", example=15),
     *             @OA\Property(property="created_at", type="string", example="2024-01-15T08:30:00Z")
     *         )
     *     )
     * )
     */
    public function show()
    {
        $user = auth()->user();
        $totalOrders = $user->orders()->count();
        $totalSpent = $user->orders()->where('status', 'completed')->sum('total_amount');
        
        // Calculate level based on total spent
        $level = 'bronze';
        if ($totalSpent >= 15000000) $level = 'platinum';
        elseif ($totalSpent >= 5000000) $level = 'gold';
        elseif ($totalSpent >= 1000000) $level = 'silver';
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'balance' => $user->balance ?? 0,
                'level' => $level,
                'total_orders' => $totalOrders,
                'total_spent' => $totalSpent,
                'created_at' => $user->created_at->toISOString(),
                'join_date' => $user->created_at->format('d F Y'),
                'avatar_url' => $user->avatar_url
            ]
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/customer/profile",
     *     summary="Update customer profile",
     *     tags={"Customer - Profile"},
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="phone", type="string", example="081234567890")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Profile updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Profile updated successfully"),
     *             @OA\Property(property="user", type="object")
     *         )
     *     )
     * )
     */
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'avatar' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $user = auth()->user();
        
        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $filename = 'avatar_' . $user->id . '_' . time() . '.' . $avatar->getClientOriginalExtension();
            $avatar->move(public_path('uploads/avatars'), $filename);
            $user->avatar_url = '/uploads/avatars/' . $filename;
        }
        
        $user->update($request->only(['name', 'phone']));
        if (isset($user->avatar_url)) {
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'avatar_url' => $user->avatar_url
            ]
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/customer/topup-balance",
     *     summary="Top up customer balance",
     *     tags={"Customer - Profile"},
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"amount", "payment_method"},
     *             @OA\Property(property="amount", type="number", example=100000),
     *             @OA\Property(property="payment_method", type="string", example="qris")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Top up request created",
     *         @OA\JsonContent(
     *             @OA\Property(property="topup_id", type="string", example="TOP-20241201-001"),
     *             @OA\Property(property="amount", type="number", example=100000),
     *             @OA\Property(property="status", type="string", example="waiting_payment"),
     *             @OA\Property(property="payment_url", type="string", example="https://payment.example.com/topup/123")
     *         )
     *     )
     * )
     */
    public function topupBalance(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10000',
            'payment_method' => 'required|string'
        ]);

        return response()->json([
            'topup_id' => 'TOP-' . date('Ymd') . '-001',
            'amount' => $request->amount,
            'status' => 'waiting_payment',
            'payment_url' => 'https://payment.example.com/topup/123'
        ], 201);
    }
}