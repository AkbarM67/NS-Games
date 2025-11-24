<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SystemController extends Controller
{
    public function getIpInfo()
    {
        try {
            // Get public IP
            $publicIp = Http::get('https://ipinfo.io/ip')->body();
            
            // Get server IP
            $serverIp = $_SERVER['SERVER_ADDR'] ?? 'Unknown';
            
            // Get client IP
            $clientIp = request()->ip();
            
            return response()->json([
                'public_ip' => trim($publicIp),
                'server_ip' => $serverIp,
                'client_ip' => $clientIp,
                'local_ip' => '127.0.0.1'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'public_ip' => 'Unable to fetch',
                'server_ip' => $_SERVER['SERVER_ADDR'] ?? 'Unknown',
                'client_ip' => request()->ip(),
                'local_ip' => '127.0.0.1'
            ]);
        }
    }
}