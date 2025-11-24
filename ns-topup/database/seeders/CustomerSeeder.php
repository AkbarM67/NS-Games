<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Customer Demo',
            'username' => 'customer',
            'email' => 'customer@example.com',
            'phone' => '081234567890',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);
    }
}