<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DigiFlazzService
{
    private $baseUrl = 'https://api.digiflazz.com/v1';
    private $username;
    private $apiKey;

    public function __construct()
    {
        $this->username = Setting::get('provider.digiflazz.username', '');
        $this->apiKey = Setting::get('provider.digiflazz.api_key', '');
    }

    private function generateSignature($data)
    {
        return md5($this->username . $this->apiKey . json_encode($data));
    }

    public function getBalance()
    {
        $data = [
            'cmd' => 'deposit',
            'username' => $this->username
        ];
        $data['sign'] = $this->generateSignature($data);

        $response = Http::post($this->baseUrl . '/cek-saldo', $data);
        
        return $response->json();
    }

    public function getPriceList()
    {
        $data = [
            'cmd' => 'prepaid',
            'username' => $this->username
        ];
        $data['sign'] = $this->generateSignature($data);

        $response = Http::post($this->baseUrl . '/price-list', $data);
        
        if ($response->successful()) {
            $responseData = $response->json();
            
            // Check if response contains error message
            if (isset($responseData['data']['rc']) && $responseData['data']['rc'] !== '00') {
                return [
                    'success' => false,
                    'message' => $responseData['data']['message'] ?? 'Unknown error from Digiflazz',
                    'data' => $responseData
                ];
            }
            
            return [
                'success' => true,
                'data' => $responseData
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Failed to connect to Digiflazz API'
        ];
    }

    public function topup($buyerSkuCode, $customerNo, $refId)
    {
        $data = [
            'username' => $this->username,
            'buyer_sku_code' => $buyerSkuCode,
            'customer_no' => $customerNo,
            'ref_id' => $refId,
            'sign' => $this->generateSignature([
                'buyer_sku_code' => $buyerSkuCode,
                'customer_no' => $customerNo,
                'ref_id' => $refId
            ])
        ];

        $response = Http::post($this->baseUrl . '/transaction', $data);
        
        Log::info('DigiFlazz Transaction', [
            'request' => $data,
            'response' => $response->json()
        ]);

        return $response->json();
    }

    public function checkStatus($refId)
    {
        $data = [
            'username' => $this->username,
            'buyer_sku_code' => '',
            'customer_no' => '',
            'ref_id' => $refId,
            'sign' => $this->generateSignature([
                'buyer_sku_code' => '',
                'customer_no' => '',
                'ref_id' => $refId
            ])
        ];

        $response = Http::post($this->baseUrl . '/transaction', $data);
        
        return $response->json();
    }
}