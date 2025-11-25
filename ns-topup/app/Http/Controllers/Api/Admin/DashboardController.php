<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // Mock dashboard data
        $data = [
            'stats' => [
                'total_users' => 15420,
                'total_transactions' => 8950,
                'total_revenue' => 125000000,
                'active_products' => 245
            ],
            'recent_transactions' => [
                [
                    'id' => 'TRX001',
                    'user' => 'Ahmad Rizki',
                    'product' => 'Mobile Legends 275 Diamonds',
                    'amount' => 75000,
                    'status' => 'success',
                    'created_at' => '2024-01-15T10:30:00Z'
                ],
                [
                    'id' => 'TRX002',
                    'user' => 'Siti Nurhaliza',
                    'product' => 'Free Fire 720 Diamonds',
                    'amount' => 95000,
                    'status' => 'pending',
                    'created_at' => '2024-01-15T10:25:00Z'
                ]
            ],
            'revenue_chart' => [
                ['month' => 'Jan', 'revenue' => 45000000],
                ['month' => 'Feb', 'revenue' => 52000000],
                ['month' => 'Mar', 'revenue' => 48000000],
                ['month' => 'Apr', 'revenue' => 61000000],
                ['month' => 'May', 'revenue' => 55000000],
                ['month' => 'Jun', 'revenue' => 67000000]
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}