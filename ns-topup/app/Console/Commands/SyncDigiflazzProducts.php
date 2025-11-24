<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\DigiFlazzService;
use App\Models\Product;
use App\Models\Game;

class SyncDigiflazzProducts extends Command
{
    protected $signature = 'digiflazz:sync-products {--force : Force sync even if recently synced}';
    protected $description = 'Sync products from Digiflazz API to local database';

    public function handle()
    {
        $this->info('Starting Digiflazz products synchronization...');
        
        try {
            $digiflazzService = new DigiFlazzService();
            $response = $digiflazzService->getPriceList();
            
            if (!$response['success']) {
                $this->error('Failed to fetch products from Digiflazz: ' . $response['message']);
                return 1;
            }
            
            $products = $response['data']['data'] ?? [];
            
            if (empty($products) || !is_array($products)) {
                $this->warn('No products received from Digiflazz API');
                return 0;
            }
            
            $syncedCount = 0;
            $updatedCount = 0;
            
            foreach ($products as $productData) {
                $this->syncProduct($productData, $syncedCount, $updatedCount);
            }
            
            $this->info("Synchronization completed!");
            $this->info("New products: {$syncedCount}");
            $this->info("Updated products: {$updatedCount}");
            
            // Update last sync time
            \App\Models\Setting::set('digiflazz.last_sync', now());
            
        } catch (\Exception $e) {
            $this->error('Error during synchronization: ' . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
    
    private function syncProduct($productData, &$syncedCount, &$updatedCount)
    {
        try {
            // Find or create game category
            $game = Game::firstOrCreate([
                'name' => $productData['brand'] ?? 'Unknown'
            ], [
                'description' => 'Auto-synced from Digiflazz',
                'image_url' => null,
                'is_active' => true
            ]);
            
            // Check if product exists
            $product = Product::where('sku_code', $productData['buyer_sku_code'])->first();
            
            $productInfo = [
                'game_id' => $game->id,
                'product_name' => $productData['product_name'],
                'amount' => $this->extractAmount($productData['product_name']),
                'sku_code' => $productData['buyer_sku_code'],
                'base_price' => $productData['price'],
                'price' => $productData['selling_price'] ?? ($productData['price'] * 1.1),
                'is_active' => $productData['buyer_product_status'] ?? true,
                'provider' => 'digiflazz',
                'category' => $productData['category'] ?? 'Game',
                'stock' => $productData['unlimited_stock'] ? -1 : ($productData['stock'] ?? 0),
                'last_sync' => now()
            ];
            
            if ($product) {
                $product->update($productInfo);
                $updatedCount++;
                $this->line("Updated: {$productData['product_name']}");
            } else {
                Product::create($productInfo);
                $syncedCount++;
                $this->line("Added: {$productData['product_name']}");
            }
            
        } catch (\Exception $e) {
            $this->warn("Failed to sync product {$productData['product_name']}: " . $e->getMessage());
        }
    }
    
    private function extractAmount($productName)
    {
        // Extract numeric amount from product name
        preg_match('/(\d+)/', $productName, $matches);
        return $matches[1] ?? 0;
    }
}