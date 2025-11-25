<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        $users = User::where('role', 'customer')->get();
        
        foreach ($users as $user) {
            // Welcome notification
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Selamat Datang!',
                'message' => 'Selamat datang di NS Games Store. Nikmati berbagai produk topup game dan pulsa terbaik!',
                'type' => 'success',
                'read' => false
            ]);
            
            // Order notification
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Pesanan Berhasil',
                'message' => 'Pesanan Mobile Legends Diamond Anda telah berhasil diproses.',
                'type' => 'success',
                'read' => false
            ]);
            
            // Promo notification
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Promo Spesial!',
                'message' => 'Dapatkan diskon 10% untuk semua produk game. Gunakan kode: GAME10',
                'type' => 'warning',
                'read' => true
            ]);
        }
    }
}