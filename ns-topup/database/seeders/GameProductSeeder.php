<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\TopupProduct;
use Illuminate\Database\Seeder;

class GameProductSeeder extends Seeder
{
    public function run()
    {
        // Mobile Legends
        $ml = Game::create([
            'name' => 'Mobile Legends',
            'description' => 'MOBA game populer dengan jutaan pemain',
            'image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
            'category' => 'MOBA',
            'is_active' => true
        ]);

        TopupProduct::create(['game_id' => $ml->id, 'product_name' => '86 Diamonds', 'amount' => 86, 'price' => 22000, 'base_price' => 20000, 'sku_code' => 'ML_86']);
        TopupProduct::create(['game_id' => $ml->id, 'product_name' => '172 Diamonds', 'amount' => 172, 'price' => 43000, 'base_price' => 40000, 'sku_code' => 'ML_172']);
        TopupProduct::create(['game_id' => $ml->id, 'product_name' => '257 Diamonds', 'amount' => 257, 'price' => 64000, 'base_price' => 60000, 'sku_code' => 'ML_257']);

        // Free Fire
        $ff = Game::create([
            'name' => 'Free Fire',
            'description' => 'Battle Royale game terpopuler',
            'image' => 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
            'category' => 'Battle Royale',
            'is_active' => true
        ]);

        TopupProduct::create(['game_id' => $ff->id, 'product_name' => '70 Diamonds', 'amount' => 70, 'price' => 11000, 'base_price' => 10000, 'sku_code' => 'FF_70']);
        TopupProduct::create(['game_id' => $ff->id, 'product_name' => '140 Diamonds', 'amount' => 140, 'price' => 22000, 'base_price' => 20000, 'sku_code' => 'FF_140']);
        TopupProduct::create(['game_id' => $ff->id, 'product_name' => '355 Diamonds', 'amount' => 355, 'price' => 55000, 'base_price' => 50000, 'sku_code' => 'FF_355']);

        // PUBG Mobile
        $pubg = Game::create([
            'name' => 'PUBG Mobile',
            'description' => 'Battle Royale realistis',
            'image' => 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400',
            'category' => 'Battle Royale',
            'is_active' => true
        ]);

        TopupProduct::create(['game_id' => $pubg->id, 'product_name' => '60 UC', 'amount' => 60, 'price' => 16500, 'base_price' => 15000, 'sku_code' => 'PUBG_60']);
        TopupProduct::create(['game_id' => $pubg->id, 'product_name' => '325 UC', 'amount' => 325, 'price' => 85000, 'base_price' => 80000, 'sku_code' => 'PUBG_325']);

        // Genshin Impact
        $genshin = Game::create([
            'name' => 'Genshin Impact',
            'description' => 'Open-world RPG dengan grafis memukau',
            'image' => 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
            'category' => 'RPG',
            'is_active' => true
        ]);

        TopupProduct::create(['game_id' => $genshin->id, 'product_name' => '60 Genesis Crystals', 'amount' => 60, 'price' => 18000, 'base_price' => 16000, 'sku_code' => 'GI_60']);
        TopupProduct::create(['game_id' => $genshin->id, 'product_name' => '330 Genesis Crystals', 'amount' => 330, 'price' => 95000, 'base_price' => 90000, 'sku_code' => 'GI_330']);

        // Pulsa Telkomsel
        $telkomsel = Game::create([
            'name' => 'Pulsa Telkomsel',
            'description' => 'Pulsa dan paket data Telkomsel',
            'image' => '📱',
            'category' => 'Pulsa',
            'is_active' => true
        ]);

        TopupProduct::create(['game_id' => $telkomsel->id, 'product_name' => 'Pulsa 10.000', 'amount' => 10000, 'price' => 11000, 'base_price' => 10500, 'sku_code' => 'TSEL_10K']);
        TopupProduct::create(['game_id' => $telkomsel->id, 'product_name' => 'Pulsa 25.000', 'amount' => 25000, 'price' => 26000, 'base_price' => 25500, 'sku_code' => 'TSEL_25K']);
        TopupProduct::create(['game_id' => $telkomsel->id, 'product_name' => 'Pulsa 50.000', 'amount' => 50000, 'price' => 51000, 'base_price' => 50500, 'sku_code' => 'TSEL_50K']);
        TopupProduct::create(['game_id' => $telkomsel->id, 'product_name' => 'Pulsa 100.000', 'amount' => 100000, 'price' => 101000, 'base_price' => 100500, 'sku_code' => 'TSEL_100K']);

        // Pulsa Indosat
        $indosat = Game::create([
            'name' => 'Pulsa Indosat',
            'description' => 'Pulsa dan paket data Indosat Ooredoo',
            'image' => '📱',
            'category' => 'Pulsa',
            'is_active' => true
        ]);

        TopupProduct::create(['game_id' => $indosat->id, 'product_name' => 'Pulsa 10.000', 'amount' => 10000, 'price' => 11000, 'base_price' => 10500, 'sku_code' => 'ISAT_10K']);
        TopupProduct::create(['game_id' => $indosat->id, 'product_name' => 'Pulsa 25.000', 'amount' => 25000, 'price' => 26000, 'base_price' => 25500, 'sku_code' => 'ISAT_25K']);
        TopupProduct::create(['game_id' => $indosat->id, 'product_name' => 'Pulsa 50.000', 'amount' => 50000, 'price' => 51000, 'base_price' => 50500, 'sku_code' => 'ISAT_50K']);

        // GoPay
        $gopay = Game::create([
            'name' => 'GoPay',
            'description' => 'Top up saldo GoPay',
            'image' => '💳',
            'category' => 'E-Wallet',
            'is_active' => true
        ]);

        TopupProduct::create(['game_id' => $gopay->id, 'product_name' => 'Saldo 25.000', 'amount' => 25000, 'price' => 26000, 'base_price' => 25500, 'sku_code' => 'GOPAY_25K']);
        TopupProduct::create(['game_id' => $gopay->id, 'product_name' => 'Saldo 50.000', 'amount' => 50000, 'price' => 51000, 'base_price' => 50500, 'sku_code' => 'GOPAY_50K']);
        TopupProduct::create(['game_id' => $gopay->id, 'product_name' => 'Saldo 100.000', 'amount' => 100000, 'price' => 101000, 'base_price' => 100500, 'sku_code' => 'GOPAY_100K']);

        // OVO
        $ovo = Game::create([
            'name' => 'OVO',
            'description' => 'Top up saldo OVO',
            'image' => '💳',
            'category' => 'E-Wallet',
            'is_active' => true
        ]);

        TopupProduct::create(['game_id' => $ovo->id, 'product_name' => 'Saldo 25.000', 'amount' => 25000, 'price' => 26000, 'base_price' => 25500, 'sku_code' => 'OVO_25K']);
        TopupProduct::create(['game_id' => $ovo->id, 'product_name' => 'Saldo 50.000', 'amount' => 50000, 'price' => 51000, 'base_price' => 50500, 'sku_code' => 'OVO_50K']);
        TopupProduct::create(['game_id' => $ovo->id, 'product_name' => 'Saldo 100.000', 'amount' => 100000, 'price' => 101000, 'base_price' => 100500, 'sku_code' => 'OVO_100K']);

        // DANA
        $dana = Game::create([
            'name' => 'DANA',
            'description' => 'Top up saldo DANA',
            'image' => '💳',
            'category' => 'E-Wallet',
            'is_active' => true
        ]);

        TopupProduct::create(['game_id' => $dana->id, 'product_name' => 'Saldo 25.000', 'amount' => 25000, 'price' => 26000, 'base_price' => 25500, 'sku_code' => 'DANA_25K']);
        TopupProduct::create(['game_id' => $dana->id, 'product_name' => 'Saldo 50.000', 'amount' => 50000, 'price' => 51000, 'base_price' => 50500, 'sku_code' => 'DANA_50K']);
        TopupProduct::create(['game_id' => $dana->id, 'product_name' => 'Saldo 100.000', 'amount' => 100000, 'price' => 101000, 'base_price' => 100500, 'sku_code' => 'DANA_100K']);

        echo "Game, pulsa, e-wallet and product data seeded successfully!\n";
    }
}