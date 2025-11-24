<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InitialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        \App\Models\User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create sample customer
        \App\Models\User::create([
            'name' => 'Customer Test',
            'email' => 'customer@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'customer',
        ]);

        // Create sample payment methods
        \App\Models\PaymentMethod::create([
            'name' => 'BCA',
            'type' => 'bank',
            'account_number' => '1234567890',
            'account_name' => 'NS Topup',
            'is_active' => true,
        ]);

        \App\Models\PaymentMethod::create([
            'name' => 'OVO',
            'type' => 'ewallet',
            'account_number' => '081234567890',
            'account_name' => 'NS Topup',
            'is_active' => true,
        ]);

        \App\Models\PaymentMethod::create([
            'name' => 'DANA',
            'type' => 'ewallet',
            'account_number' => '081234567890',
            'account_name' => 'NS Topup',
            'is_active' => true,
        ]);

        \App\Models\PaymentMethod::create([
            'name' => 'GoPay',
            'type' => 'ewallet',
            'account_number' => '081234567890',
            'account_name' => 'NS Topup',
            'is_active' => true,
        ]);

        echo "Initial users and payment methods seeded successfully!\n";
    }
}