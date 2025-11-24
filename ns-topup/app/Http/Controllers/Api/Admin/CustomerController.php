<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * @OA\Get(
     *     path="/customers",
     *     summary="Get all customers (Admin only)",
     *     tags={"Admin - Customers"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of customers",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="John Doe"),
     *                     @OA\Property(property="email", type="string", example="john@example.com"),
     *                     @OA\Property(property="phone", type="string", example="081234567890"),
     *                     @OA\Property(property="role", type="string", example="customer"),
     *                     @OA\Property(property="is_blocked", type="boolean", example=false),
     *                     @OA\Property(property="created_at", type="string", example="2025-11-21T10:00:00.000000Z")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        try {
            $customers = User::where('role', 'customer')
                ->withCount('orders')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($user) {
                    $totalSpent = $user->orders()->where('status', 'completed')->sum('total_amount');
                    
                    // Calculate level based on total spent
                    $level = 'bronze';
                    if ($totalSpent >= 15000000) $level = 'platinum';
                    elseif ($totalSpent >= 5000000) $level = 'gold';
                    elseif ($totalSpent >= 1000000) $level = 'silver';
                    
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'role' => $user->role,
                        'balance' => $user->balance ?? 0,
                        'total_spent' => $totalSpent,
                        'total_orders' => $user->orders_count,
                        'level' => $level,
                        'is_blocked' => $user->is_blocked,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at
                    ];
                });
            
            return response()->json([
                'success' => true,
                'data' => $customers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching customers: ' . $e->getMessage(),
                'data' => []
            ]);
        }
    }
    
    /**
     * @OA\Patch(
     *     path="/customers/{user}/block",
     *     summary="Block/Unblock customer (Admin only)",
     *     tags={"Admin - Customers"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="user",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         description="User ID"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User blocked/unblocked successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="User blocked")
     *         )
     *     )
     * )
     */
    public function block(User $user)
    {
        $user->update(['is_blocked' => !$user->is_blocked]);
        
        return response()->json([
            'success' => true,
            'message' => $user->is_blocked ? 'User blocked' : 'User unblocked'
        ]);
    }
}