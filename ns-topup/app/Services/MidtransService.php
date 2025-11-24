<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MidtransService
{
    private $serverKey;
    private $clientKey;
    private $isProduction;
    private $baseUrl;

    public function __construct()
    {
        $this->serverKey = Setting::get('payment.midtrans.server_key', '');
        $this->clientKey = Setting::get('payment.midtrans.client_key', '');
        $this->isProduction = Setting::get('payment.midtrans.is_production', false);
        $this->baseUrl = $this->isProduction 
            ? 'https://api.midtrans.com/v2' 
            : 'https://api.sandbox.midtrans.com/v2';
    }

    public function createTransaction($orderId, $amount, $customerDetails, $items = [])
    {
        $payload = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $amount
            ],
            'customer_details' => $customerDetails,
            'item_details' => $items,
            'enabled_payments' => [
                'credit_card', 'bca_va', 'bni_va', 'bri_va', 'echannel', 
                'permata_va', 'other_va', 'gopay', 'shopeepay', 'qris'
            ]
        ];

        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => 'Basic ' . base64_encode($this->serverKey . ':')
            ])->post('https://app.sandbox.midtrans.com/snap/v1/transactions', $payload);

            Log::info('Midtrans Create Transaction', [
                'order_id' => $orderId,
                'request' => $payload,
                'response' => $response->json()
            ]);

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Midtrans Error', [
                'order_id' => $orderId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function getTransactionStatus($orderId)
    {
        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Basic ' . base64_encode($this->serverKey . ':')
            ])->get($this->baseUrl . '/' . $orderId . '/status');

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Midtrans Status Check Error', [
                'order_id' => $orderId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function verifySignature($orderId, $statusCode, $grossAmount, $signatureKey)
    {
        $mySignature = hash('sha512', $orderId . $statusCode . $grossAmount . $this->serverKey);
        return $mySignature === $signatureKey;
    }
}