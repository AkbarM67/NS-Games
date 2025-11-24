<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\DigiFlazzService;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class ProductDisplayController extends Controller
{
    public function index()
    {
        try {
            // Try to get fresh data from Digiflazz with cache
            $cacheKey = 'digiflazz_products_display';
            $products = Cache::remember($cacheKey, 300, function () { // 5 minutes cache
                return $this->getDigiflazzProducts();
            });
            
            if (!empty($products)) {
                return response()->json([
                    'success' => true,
                    'data' => $products,
                    'source' => 'digiflazz'
                ]);
            }
            
            // Fallback to local database
            return $this->getLocalProducts();
            
        } catch (\Exception $e) {
            return $this->getLocalProducts();
        }
    }
    
    private function getDigiflazzProducts()
    {
        $digiflazzService = new DigiFlazzService();
        $response = $digiflazzService->getPriceList();
        
        if (!$response['success'] || !isset($response['data']['data'])) {
            return [];
        }
        
        $data = $response['data']['data'];
        if (!is_array($data)) {
            return [];
        }
        
        return array_map(function($item) {
            return [
                'id' => $item['buyer_sku_code'] ?? uniqid(),
                'name' => $item['product_name'] ?? 'Unknown Product',
                'category' => $this->mapCategory($item['category'] ?? ''),
                'provider' => 'Digiflazz',
                'buyPrice' => floatval($item['price'] ?? 0),
                'sellPrice' => floatval($item['selling_price'] ?? ($item['price'] * 1.1)),
                'profit' => floatval(($item['selling_price'] ?? ($item['price'] * 1.1)) - ($item['price'] ?? 0)),
                'status' => ($item['buyer_product_status'] ?? true) ? 'active' : 'inactive',
                'stock' => ($item['unlimited_stock'] ?? true) ? 'unlimited' : ($item['stock'] ?? 0),
                'sku_code' => $item['buyer_sku_code'] ?? '',
                'db_id' => null // No database ID for Digiflazz products
            ];
        }, array_slice($data, 0, 100)); // Limit to 100 products
    }
    
    private function getLocalProducts()
    {
        $products = Product::with('game')->get();
        
        $transformedProducts = $products->map(function($product) {
            return [
                'id' => $product->sku_code,
                'name' => $product->product_name,
                'category' => $product->category ?? 'Game',
                'provider' => $product->provider ?? 'Local',
                'buyPrice' => floatval($product->base_price),
                'sellPrice' => floatval($product->price),
                'profit' => floatval($product->price - $product->base_price),
                'status' => $product->is_active ? 'active' : 'inactive',
                'stock' => $product->stock == -1 ? 'unlimited' : $product->stock,
                'sku_code' => $product->sku_code,
                'db_id' => $product->id // Database ID for local products
            ];
        });
        
        return response()->json([
            'success' => true,
            'data' => $transformedProducts,
            'source' => 'local'
        ]);
    }
    
    private function mapCategory($category)
    {
        $categoryMap = [
            'Games' => 'Game',
            'Pulsa' => 'Pulsa',
            'E-Money' => 'E-Wallet',
            'Voucher' => 'Voucher'
        ];
        
        return $categoryMap[$category] ?? 'Game';
    }
}