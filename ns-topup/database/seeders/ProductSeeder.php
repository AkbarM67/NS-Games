<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Game;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing products
        Product::query()->delete();
        
        // Create games
        $mobileLegends = Game::firstOrCreate(['name' => 'Mobile Legends'], [
            'description' => 'MOBA Game populer',
            'is_active' => true
        ]);
        
        $freefire = Game::firstOrCreate(['name' => 'Free Fire'], [
            'description' => 'Battle Royale Game',
            'is_active' => true
        ]);
        
        $pubg = Game::firstOrCreate(['name' => 'PUBG Mobile'], [
            'description' => 'Battle Royale Game',
            'is_active' => true
        ]);
        
        // Mobile Legends Products (Digiflazz)
        $mlProducts = [
            ['sku' => 'ML86', 'name' => '86 Diamond', 'amount' => 86, 'base' => 20000, 'price' => 22000],
            ['sku' => 'ML172', 'name' => '172 Diamond', 'amount' => 172, 'base' => 40000, 'price' => 43000],
            ['sku' => 'ML257', 'name' => '257 Diamond', 'amount' => 257, 'base' => 60000, 'price' => 64000],
            ['sku' => 'ML344', 'name' => '344 Diamond', 'amount' => 344, 'base' => 80000, 'price' => 85000],
        ];
        
        foreach ($mlProducts as $product) {
            Product::create([
                'game_id' => $mobileLegends->id,
                'product_name' => $product['name'],
                'sku_code' => $product['sku'],
                'amount' => $product['amount'],
                'base_price' => $product['base'],
                'price' => $product['price'],
                'is_active' => true,
                'provider' => 'digiflazz',
                'category' => 'Game',
                'stock' => -1,
                'last_sync' => now()
            ]);
        }
        
        // Free Fire Products (Digiflazz)
        $ffProducts = [
            ['sku' => 'FF70', 'name' => '70 Diamond', 'amount' => 70, 'base' => 10000, 'price' => 11000],
            ['sku' => 'FF140', 'name' => '140 Diamond', 'amount' => 140, 'base' => 20000, 'price' => 22000],
            ['sku' => 'FF355', 'name' => '355 Diamond', 'amount' => 355, 'base' => 50000, 'price' => 53000],
            ['sku' => 'FF720', 'name' => '720 Diamond', 'amount' => 720, 'base' => 100000, 'price' => 105000],
        ];
        
        foreach ($ffProducts as $product) {
            Product::create([
                'game_id' => $freefire->id,
                'product_name' => $product['name'],
                'sku_code' => $product['sku'],
                'amount' => $product['amount'],
                'base_price' => $product['base'],
                'price' => $product['price'],
                'is_active' => true,
                'provider' => 'digiflazz',
                'category' => 'Game',
                'stock' => -1,
                'last_sync' => now()
            ]);
        }
        
        // PUBG Products (Digiflazz)
        $pubgProducts = [
            ['sku' => 'PUBG60', 'name' => '60 UC', 'amount' => 60, 'base' => 15000, 'price' => 16500],
            ['sku' => 'PUBG325', 'name' => '325 UC', 'amount' => 325, 'base' => 75000, 'price' => 80000],
            ['sku' => 'PUBG660', 'name' => '660 UC', 'amount' => 660, 'base' => 150000, 'price' => 158000],
        ];
        
        foreach ($pubgProducts as $product) {
            Product::create([
                'game_id' => $pubg->id,
                'product_name' => $product['name'],
                'sku_code' => $product['sku'],
                'amount' => $product['amount'],
                'base_price' => $product['base'],
                'price' => $product['price'],
                'is_active' => true,
                'provider' => 'digiflazz',
                'category' => 'Game',
                'stock' => -1,
                'last_sync' => now()
            ]);
        }
        
        // Local Products (Manual)
        Product::create([
            'game_id' => $mobileLegends->id,
            'product_name' => '500 Diamond (Manual)',
            'sku_code' => 'ML500_LOCAL',
            'amount' => 500,
            'base_price' => 120000,
            'price' => 130000,
            'is_active' => true,
            'provider' => 'local',
            'category' => 'Game',
            'stock' => 50
        ]);
    }
}