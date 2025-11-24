<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        User::updateOrCreate(
            ['email' => 'admin@nsgames.com'],
            [
                'name' => 'NS Games Admin',
                'username' => 'nsgames_admin',
                'phone' => '081234567890',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // Create customer user
        User::updateOrCreate(
            ['email' => 'customer@nsgames.com'],
            [
                'name' => 'NS Games Customer',
                'username' => 'nsgames_customer',
                'phone' => '081234567891',
                'password' => Hash::make('customer123'),
                'role' => 'customer',
            ]
        );

        echo "Created users:\n";
        echo "Admin: admin@nsgames.com / admin123\n";
        echo "Customer: customer@nsgames.com / customer123\n";
    }
}