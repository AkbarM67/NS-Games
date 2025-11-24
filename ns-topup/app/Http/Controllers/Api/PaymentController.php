<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\MidtransService;
use App\Services\DigiFlazzService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    private $midtrans;
    private $digiflazz;

    public function __construct(MidtransService $midtrans, DigiFlazzService $digiflazz)
    {
        $this->midtrans = $midtrans;
        $this->digiflazz = $digiflazz;
    }

    public function createPayment(Request $request)
    {
        $request->validate([
            'product_id' => 'required|string',
            'target_user_id' => 'required|string',
            'server_id' => 'nullable|string',
            'payment_method' => 'required|string',
            'total_amount' => 'required|numeric'
        ]);

        try {
            // Generate unique order ID
            $orderId = 'TRX-' . time() . '-' . Str::random(6);
            
            // Use actual price from frontend
            $productPrice = $request->total_amount;
            $productName = 'Topup Game'; // Generic product name
            
            // Get first available product ID or create dummy
            $firstProduct = \App\Models\TopupProduct::first();
            $dummyProductId = $firstProduct ? $firstProduct->id : $this->createDummyProduct();
            
            // Create order record with required fields
            $order = Order::create([
                'id' => $orderId,
                'user_id' => auth()->id() ?? 1, // Fallback for testing
                'product_id' => $dummyProductId, // Use existing product ID
                'target_user_id' => $request->target_user_id,
                'server_id' => $request->server_id,
                'player_id' => $request->target_user_id, // Use target_user_id as player_id
                'total_price' => $productPrice,
                'payment_method' => $request->payment_method,
                'status' => 'pending'
            ]);
            
            // Store actual product_id in a custom field
            $order->update(['notes' => 'Product ID: ' . $request->product_id]);

            // Customer details
            $customerDetails = [
                'first_name' => auth()->user()->name ?? 'Customer',
                'email' => auth()->user()->email ?? 'customer@example.com',
                'phone' => '08123456789'
            ];

            // Item details
            $items = [
                [
                    'id' => $request->product_id,
                    'price' => $productPrice,
                    'quantity' => 1,
                    'name' => $productName
                ]
            ];

            // Create Midtrans transaction
            $midtransResponse = $this->midtrans->createTransaction(
                $orderId,
                $productPrice,
                $customerDetails,
                $items
            );

            if (isset($midtransResponse['token'])) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'order_id' => $orderId,
                        'snap_token' => $midtransResponse['token'],
                        'redirect_url' => $midtransResponse['redirect_url'] ?? null,
                        'total_amount' => $productPrice
                    ]
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment'
            ], 400);

        } catch (\Exception $e) {
            Log::error('Payment Creation Error', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Payment creation failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function webhook(Request $request)
    {
        try {
            $notification = $request->all();
            
            $orderId = $notification['order_id'];
            $statusCode = $notification['status_code'];
            $grossAmount = $notification['gross_amount'];
            $signatureKey = $notification['signature_key'];

            // Verify signature
            if (!$this->midtrans->verifySignature($orderId, $statusCode, $grossAmount, $signatureKey)) {
                return response()->json(['message' => 'Invalid signature'], 403);
            }

            $order = Order::find($orderId);
            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            $transactionStatus = $notification['transaction_status'];
            $fraudStatus = $notification['fraud_status'] ?? null;

            Log::info('Midtrans Webhook', [
                'order_id' => $orderId,
                'transaction_status' => $transactionStatus,
                'fraud_status' => $fraudStatus
            ]);

            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'challenge') {
                    $order->update(['status' => 'challenge']);
                } else if ($fraudStatus == 'accept') {
                    $order->update(['status' => 'paid']);
                    $this->processTopup($order);
                }
            } else if ($transactionStatus == 'settlement') {
                $order->update(['status' => 'paid']);
                $this->processTopup($order);
            } else if ($transactionStatus == 'pending') {
                $order->update(['status' => 'pending']);
            } else if ($transactionStatus == 'deny') {
                $order->update(['status' => 'failed']);
            } else if ($transactionStatus == 'expire') {
                $order->update(['status' => 'expired']);
            } else if ($transactionStatus == 'cancel') {
                $order->update(['status' => 'cancelled']);
            }

            return response()->json(['message' => 'OK']);

        } catch (\Exception $e) {
            Log::error('Webhook Error', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json(['message' => 'Webhook processing failed'], 500);
        }
    }

    private function processTopup($order)
    {
        try {
            // Extract actual product_id from notes
            $actualProductId = str_replace('Product ID: ', '', $order->notes ?? '');
            
            // Map product_id to Digiflazz SKU
            $buyerSkuCode = $this->mapProductToSku($actualProductId);
            
            if (!$buyerSkuCode) {
                Log::error('SKU mapping not found', ['product_id' => $actualProductId]);
                return;
            }

            // Process topup via Digiflazz
            $topupResponse = $this->digiflazz->topup(
                $buyerSkuCode,
                $order->target_user_id,
                $order->id
            );

            if ($topupResponse['data']['status'] === 'Sukses') {
                $order->update([
                    'status' => 'completed',
                    'digiflazz_response' => json_encode($topupResponse)
                ]);
            } else {
                $order->update([
                    'status' => 'topup_failed',
                    'digiflazz_response' => json_encode($topupResponse)
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Topup Processing Error', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);

            $order->update(['status' => 'topup_failed']);
        }
    }

    private function mapProductToSku($productId)
    {
        // Map your product IDs to Digiflazz SKU codes
        $mapping = [
            'ml86' => 'ML86',
            'ml172' => 'ML172', 
            'ml257' => 'ML257',
            'ff70' => 'FF70',
            'ff140' => 'FF140',
            '17_34' => 'ML86', // Map composite ID to SKU
            // Add more mappings as needed
        ];

        return $mapping[$productId] ?? 'ML86'; // Default fallback
    }
    
    private function createDummyProduct()
    {
        // Create a dummy product if none exists
        $game = \App\Models\Game::first();
        if (!$game) {
            $game = \App\Models\Game::create([
                'name' => 'Dummy Game',
                'category' => 'Game',
                'image' => 'dummy.jpg'
            ]);
        }
        
        $product = \App\Models\TopupProduct::create([
            'game_id' => $game->id,
            'product_name' => 'Dummy Product',
            'price' => 1000,
            'amount' => 1
        ]);
        
        return $product->id;
    }

    public function checkStatus($orderId)
    {
        try {
            $order = Order::find($orderId);
            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            $midtransStatus = $this->midtrans->getTransactionStatus($orderId);

            return response()->json([
                'success' => true,
                'data' => [
                    'order_id' => $orderId,
                    'status' => $order->status,
                    'midtrans_status' => $midtransStatus['transaction_status'] ?? null,
                    'total_amount' => $order->total_price
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Status check failed: ' . $e->getMessage()
            ], 500);
        }
    }
}