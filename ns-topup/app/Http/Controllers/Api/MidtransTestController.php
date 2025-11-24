<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MidtransService;
use Illuminate\Http\Request;

class MidtransTestController extends Controller
{
    private $midtrans;

    public function __construct(MidtransService $midtrans)
    {
        $this->midtrans = $midtrans;
    }

    public function testConnection()
    {
        try {
            $orderId = 'TEST-' . time();
            $amount = 10000;
            $customerDetails = [
                'first_name' => 'Test',
                'email' => 'test@example.com',
                'phone' => '08123456789'
            ];
            $items = [
                [
                    'id' => 'test-item',
                    'price' => $amount,
                    'quantity' => 1,
                    'name' => 'Test Item'
                ]
            ];

            $response = $this->midtrans->createTransaction($orderId, $amount, $customerDetails, $items);

            return response()->json([
                'success' => true,
                'message' => 'Midtrans connection successful',
                'data' => [
                    'order_id' => $orderId,
                    'has_token' => isset($response['token']),
                    'response' => $response
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Midtrans connection failed: ' . $e->getMessage()
            ], 500);
        }
    }
}