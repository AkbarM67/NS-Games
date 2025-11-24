<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class ProviderSettingsController extends Controller
{
    public function saveProviders(Request $request)
    {
        $providers = $request->input('providers', []);
        
        foreach ($providers as $provider) {
            $name = strtolower(str_replace(' ', '_', $provider['name']));
            
            // Save common fields
            Setting::set("provider.{$name}.status", $provider['status'] ?? 'inactive', 'string', 'provider');
            Setting::set("provider.{$name}.balance", $provider['balance'] ?? 0, 'number', 'provider');
            
            // Save provider-specific fields
            if ($name === 'digiflazz') {
                Setting::set("provider.{$name}.username", $provider['username'] ?? '', 'string', 'provider');
                Setting::set("provider.{$name}.api_key", $provider['api_key'] ?? '', 'string', 'provider');
            } elseif ($name === 'vip_reseller') {
                Setting::set("provider.{$name}.api_id", $provider['api_id'] ?? '', 'string', 'provider');
                Setting::set("provider.{$name}.api_key", $provider['api_key'] ?? '', 'string', 'provider');
            } else {
                Setting::set("provider.{$name}.api_key", $provider['api_key'] ?? '', 'string', 'provider');
            }
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Provider settings saved to database successfully',
            'providers' => $providers,
            'received_count' => count($providers)
        ]);
    }
}