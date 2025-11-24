<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Providers",
 *     description="Provider management endpoints"
 * )
 */

class ProviderController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/providers",
     *     summary="Get all providers",
     *     tags={"Providers"},
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="Providers retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="providers", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="name", type="string", example="Digiflazz"),
     *                     @OA\Property(property="status", type="string", example="inactive"),
     *                     @OA\Property(property="balance", type="number", example=0),
     *                     @OA\Property(property="username", type="string", example=""),
     *                     @OA\Property(property="api_key", type="string", example="")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $data = [
            'providers' => [
                [
                    'name' => 'Digiflazz',
                    'status' => Setting::get('provider.digiflazz.status', 'inactive'),
                    'balance' => Setting::get('provider.digiflazz.balance', 0),
                    'username' => Setting::get('provider.digiflazz.username', ''),
                    'api_key' => Setting::get('provider.digiflazz.api_key', '')
                ],
                [
                    'name' => 'VIP Reseller',
                    'status' => Setting::get('provider.vip_reseller.status', 'inactive'),
                    'balance' => Setting::get('provider.vip_reseller.balance', 0),
                    'api_id' => Setting::get('provider.vip_reseller.api_id', ''),
                    'api_key' => Setting::get('provider.vip_reseller.api_key', '')
                ],
                [
                    'name' => 'Apigames',
                    'status' => Setting::get('provider.apigames.status', 'inactive'),
                    'balance' => Setting::get('provider.apigames.balance', 0),
                    'api_key' => Setting::get('provider.apigames.api_key', '')
                ]
            ]
        ];
        
        return response()->json($data);
    }
}