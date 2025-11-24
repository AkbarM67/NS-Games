<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use App\Models\Setting;
use App\Models\Product;

/**
 * @OA\Tag(
 *     name="Admin - Product Sync",
 *     description="Product synchronization with Digiflazz API"
 * )
 */
class ProductSyncController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/admin/products/sync",
     *     summary="Sync products from Digiflazz API",
     *     tags={"Admin - Product Sync"},
     *     @OA\Response(
     *         response=200,
     *         description="Sync completed successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Sinkronisasi produk berhasil"),
     *             @OA\Property(property="output", type="string", example="Starting Digiflazz products synchronization..."),
     *             @OA\Property(property="last_sync", type="string", example="2024-01-01 12:00:00")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Sync already running or failed",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Sinkronisasi sedang berjalan, silakan tunggu...")
     *         )
     *     )
     * )
     */
    public function syncFromDigiflazz()
    {
        try {
            // Check if sync is already running
            if (cache()->has('digiflazz_sync_running')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sinkronisasi sedang berjalan, silakan tunggu...'
                ]);
            }
            
            // Set sync flag
            cache()->put('digiflazz_sync_running', true, 300); // 5 minutes
            
            // Run sync command
            Artisan::call('digiflazz:sync-products');
            $output = Artisan::output();
            
            // Clear sync flag
            cache()->forget('digiflazz_sync_running');
            
            return response()->json([
                'success' => true,
                'message' => 'Sinkronisasi produk berhasil',
                'output' => $output,
                'last_sync' => Setting::get('digiflazz.last_sync')
            ]);
            
        } catch (\Exception $e) {
            cache()->forget('digiflazz_sync_running');
            
            return response()->json([
                'success' => false,
                'message' => 'Error saat sinkronisasi: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * @OA\Get(
     *     path="/api/admin/products/sync-status",
     *     summary="Get synchronization status",
     *     tags={"Admin - Product Sync"},
     *     @OA\Response(
     *         response=200,
     *         description="Sync status retrieved",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="last_sync", type="string", example="2024-01-01 12:00:00"),
     *                 @OA\Property(property="is_running", type="boolean", example=false),
     *                 @OA\Property(property="total_products", type="integer", example=12),
     *                 @OA\Property(property="digiflazz_products", type="integer", example=11),
     *                 @OA\Property(property="last_sync_formatted", type="string", example="2 hours ago")
     *             )
     *         )
     *     )
     * )
     */
    public function getSyncStatus()
    {
        $lastSync = Setting::get('digiflazz.last_sync');
        $isRunning = cache()->has('digiflazz_sync_running');
        $totalProducts = Product::count();
        $digiflazzProducts = Product::where('provider', 'digiflazz')->count();
        
        return response()->json([
            'success' => true,
            'data' => [
                'last_sync' => $lastSync,
                'is_running' => $isRunning,
                'total_products' => $totalProducts,
                'digiflazz_products' => $digiflazzProducts,
                'last_sync_formatted' => $lastSync ? \Carbon\Carbon::parse($lastSync)->diffForHumans() : 'Belum pernah'
            ]
        ]);
    }
    
    public function enableAutoSync(Request $request)
    {
        $request->validate([
            'enabled' => 'required|boolean',
            'interval' => 'sometimes|integer|min:5|max:1440' // 5 minutes to 24 hours
        ]);
        
        Setting::set('digiflazz.auto_sync.enabled', $request->enabled);
        
        if ($request->has('interval')) {
            Setting::set('digiflazz.auto_sync.interval', $request->interval);
        }
        
        return response()->json([
            'success' => true,
            'message' => $request->enabled ? 'Auto sync diaktifkan' : 'Auto sync dinonaktifkan'
        ]);
    }
}