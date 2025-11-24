<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use App\Models\TopupProduct;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run()
    {
        $customers = User::where('role', 'customer')->get();
        $products = TopupProduct::with('game')->get();
        
        if ($customers->isEmpty() || $products->isEmpty()) {
            echo "No customers or products found. Skipping order seeding.\n";
            return;
        }
        
        $statuses = ['waiting_payment', 'pending', 'processing', 'success', 'failed'];
        $paymentMethods = ['QRIS', 'VA BCA', 'VA BNI', 'GoPay', 'OVO', 'DANA'];
        
        for ($i = 0; $i < 20; $i++) {
            $customer = $customers->random();
            $product = $products->random();
            
            Order::create([
                'user_id' => $customer->id,
                'product_id' => $product->id,
                'game_name' => $product->game->name,
                'product_name' => $product->product_name,
                'player_id' => (string) rand(100000000, 999999999),
                'server_id' => (string) rand(1000, 9999),
                'amount' => $product->amount ?? 0,
                'total_price' => $product->price,
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'status' => $statuses[array_rand($statuses)],
                'created_at' => now()->subDays(rand(0, 30))
            ]);
        }
        
        echo "Sample orders created successfully!\n";
    }
}