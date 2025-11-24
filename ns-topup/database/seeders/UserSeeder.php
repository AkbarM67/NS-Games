<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Customer Users only (admin already exists)
        $customers = [
            [
                'name' => 'Budi Santoso',
                'username' => 'budi123',
                'email' => 'budi@example.com',
                'phone' => '081234567891',
                'balance' => 150000,
            ],
            [
                'name' => 'Siti Nurhaliza',
                'username' => 'siti456',
                'email' => 'siti@example.com',
                'phone' => '081234567892',
                'balance' => 75000,
            ],
            [
                'name' => 'Ahmad Rizki',
                'username' => 'ahmad789',
                'email' => 'ahmad@example.com',
                'phone' => '081234567893',
                'balance' => 200000,
            ],
            [
                'name' => 'Maya Sari',
                'username' => 'maya101',
                'email' => 'maya@example.com',
                'phone' => '081234567894',
                'balance' => 50000,
            ],
        ];

        foreach ($customers as $customer) {
            User::updateOrCreate(
                ['email' => $customer['email']],
                [
                    'name' => $customer['name'],
                    'username' => $customer['username'],
                    'phone' => $customer['phone'],
                    'role' => 'customer',
                    'balance' => $customer['balance'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}