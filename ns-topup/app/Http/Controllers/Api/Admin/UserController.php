<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show()
    {
        // Mock admin user data
        $user = [
            'id' => 1,
            'name' => 'Admin NS Games',
            'email' => 'admin@nsgames.com',
            'role' => 'admin',
            'avatar_url' => null,
            'created_at' => '2024-01-01T00:00:00Z'
        ];

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }
}