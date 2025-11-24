<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

/**
 * @OA\Tag(
 *     name="Digiflazz",
 *     description="Digiflazz API integration endpoints"
 * )
 */
class DigiflazzController extends Controller
{
    private $baseUrl = 'https://api.digiflazz.com/v1';
    
    private function getCredentials()
    {
        return [
            'username' => Setting::get('provider.digiflazz.username', ''),
            'api_key' => Setting::get('provider.digiflazz.api_key', '')
        ];
    }

    /**
     * @OA\Get(
     *     path="/api/digiflazz/balance",
     *     summary="Get Digiflazz balance",
     *     tags={"Digiflazz"},
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="Balance retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="balance", type="number", example=100000),
     *             @OA\Property(property="status", type="string", example="active")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function getBalance()
    {
        try {
            $credentials = $this->getCredentials();
            
            $data = [
                'cmd' => 'deposit',
                'username' => $credentials['username']
            ];
            $data['sign'] = md5($credentials['username'] . $credentials['api_key'] . json_encode($data));
            
            $response = Http::post($this->baseUrl . '/cek-saldo', $data);

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'success' => true,
                    'balance' => $data['data']['deposit'] ?? 0,
                    'status' => 'active'
                ]);
            }

            return response()->json([
                'success' => false,
                'balance' => 0,
                'status' => 'error',
                'message' => 'Failed to connect'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'balance' => 0,
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/digiflazz/price-list",
     *     summary="Get Digiflazz price list",
     *     tags={"Digiflazz"},
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="Price list retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="data", type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="product_name", type="string", example="Mobile Legends 86 Diamond"),
     *                         @OA\Property(property="category", type="string", example="Games"),
     *                         @OA\Property(property="brand", type="string", example="MOBILE LEGENDS"),
     *                         @OA\Property(property="price", type="number", example=20000),
     *                         @OA\Property(property="buyer_sku_code", type="string", example="ML86"),
     *                         @OA\Property(property="buyer_product_status", type="boolean", example=true),
     *                         @OA\Property(property="stock", type="number", example=999999)
     *                     )
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function getPriceList()
    {
        try {
            $credentials = $this->getCredentials();
            
            $data = [
                'cmd' => 'prepaid',
                'username' => $credentials['username']
            ];
            $data['sign'] = md5($credentials['username'] . $credentials['api_key'] . json_encode($data));
            
            $response = Http::post($this->baseUrl . '/price-list', $data);
            
            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'data' => $response->json()
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to get price list'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/digiflazz/test",
     *     summary="Test Digiflazz connection",
     *     tags={"Digiflazz"},
     *     @OA\Response(
     *         response=200,
     *         description="Connection test result",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Connection test using provider settings"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="username", type="string", example="your_username"),
     *                 @OA\Property(property="api_key", type="string", example="dev-fc9c19..."),
     *                 @OA\Property(property="status", type="string", example="configured")
     *             )
     *         )
     *     )
     * )
     */
    public function testConnection()
    {
        $credentials = $this->getCredentials();
        
        return response()->json([
            'success' => true,
            'message' => 'Connection test using provider settings',
            'data' => [
                'username' => $credentials['username'],
                'api_key' => $credentials['api_key'] ? substr($credentials['api_key'], 0, 10) . '...' : 'Not set',
                'status' => $credentials['username'] && $credentials['api_key'] ? 'configured' : 'not_configured'
            ]
        ]);
    }
}