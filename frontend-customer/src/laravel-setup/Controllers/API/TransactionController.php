<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Display user's transactions
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Transaction::where('user_id', $user->id)
            ->with(['product']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('transaction_id', 'like', '%' . $request->search . '%')
                  ->orWhereHas('product', function($q) use ($request) {
                      $q->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        $transactions = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    /**
     * Store a newly created transaction
     */
    public functioNS Games Store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'target_account' => 'required|string',
            'server_id' => 'nullable|string',
            'payment_method' => 'required|string',
            'promo_code' => 'nullable|string',
        ]);

        $user = $request->user();
        $product = Product::find($validated['product_id']);

        if ($product->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Product is not available'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Calculate total
            $amount = $product->sell_price;
            $adminFee = $this->calculateAdminFee($amount, $validated['payment_method']);
            $discount = 0;

            // Apply promo code if exists
            if (!empty($validated['promo_code'])) {
                $discount = $this->calculateDiscount($validated['promo_code'], $amount);
            }

            $total = $amount + $adminFee - $discount;

            // Create transaction
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'product_id' => $product->id,
                'target_account' => $validated['target_account'],
                'server_id' => $validated['server_id'] ?? null,
                'amount' => $amount,
                'admin_fee' => $adminFee,
                'discount' => $discount,
                'total' => $total,
                'status' => 'pending',
                'payment_method' => $validated['payment_method'],
                'promo_code' => $validated['promo_code'] ?? null,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaction created successfully',
                'data' => $transaction->load('product')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified transaction
     */
    public function show($id)
    {
        $user = auth()->user();
        
        $transaction = Transaction::where('user_id', $user->id)
            ->where('id', $id)
            ->with(['product'])
            ->first();

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $transaction
        ]);
    }

    /**
     * Get transaction statistics
     */
    public function statistics(Request $request)
    {
        $user = $request->user();

        $stats = [
            'total_transactions' => Transaction::where('user_id', $user->id)->count(),
            'success_count' => Transaction::where('user_id', $user->id)->success()->count(),
            'pending_count' => Transaction::where('user_id', $user->id)->pending()->count(),
            'failed_count' => Transaction::where('user_id', $user->id)->failed()->count(),
            'total_spent' => Transaction::where('user_id', $user->id)
                ->success()
                ->sum('total'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Update transaction status (Payment webhook)
     */
    public function updateStatus(Request $request, $transactionId)
    {
        $validated = $request->validate([
            'status' => 'required|in:success,failed,refunded',
            'payment_reference' => 'nullable|string',
        ]);

        $transaction = Transaction::where('transaction_id', $transactionId)->first();

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found'
            ], 404);
        }

        DB::beginTransaction();

        try {
            $transaction->update([
                'status' => $validated['status'],
                'payment_reference' => $validated['payment_reference'] ?? null,
                'paid_at' => $validated['status'] === 'success' ? now() : null,
            ]);

            // Update user stats if success
            if ($validated['status'] === 'success') {
                $user = $transaction->user;
                $user->increment('total_transactions');
                $user->increment('total_spent', $transaction->total);

                // Update user level based on total spent
                $this->updateUserLevel($user);

                // Increment product sold count
                $transaction->product->increment('sold_today');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaction status updated',
                'data' => $transaction
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update transaction status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate admin fee based on payment method
     */
    private function calculateAdminFee($amount, $paymentMethod)
    {
        $fees = [
            'qris' => ['type' => 'percentage', 'value' => 0.7],
            'bca' => ['type' => 'fixed', 'value' => 4000],
            'bni' => ['type' => 'fixed', 'value' => 4000],
            'mandiri' => ['type' => 'fixed', 'value' => 4000],
            'gopay' => ['type' => 'percentage', 'value' => 2],
            'ovo' => ['type' => 'percentage', 'value' => 2],
            'dana' => ['type' => 'percentage', 'value' => 2],
        ];

        $fee = $fees[$paymentMethod] ?? ['type' => 'fixed', 'value' => 0];

        if ($fee['type'] === 'percentage') {
            return ($amount * $fee['value']) / 100;
        }

        return $fee['value'];
    }

    /**
     * Calculate discount from promo code
     */
    private function calculateDiscount($promoCode, $amount)
    {
        // Implement promo code logic here
        // For now, simple example
        if ($promoCode === 'TOPUP10') {
            return min($amount * 0.1, 20000);
        }

        return 0;
    }

    /**
     * Update user level based on total spent
     */
    private function updateUserLevel(User $user)
    {
        $totalSpent = $user->total_spent;

        if ($totalSpent >= 15000000) {
            $user->level = 'platinum';
        } elseif ($totalSpent >= 5000000) {
            $user->level = 'gold';
        } elseif ($totalSpent >= 1000000) {
            $user->level = 'silver';
        } else {
            $user->level = 'bronze';
        }

        $user->save();
    }
}
