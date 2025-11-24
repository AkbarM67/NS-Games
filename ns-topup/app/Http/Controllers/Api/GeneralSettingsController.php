<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class GeneralSettingsController extends Controller
{
    public function getSettings()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'app_name' => Setting::get('general.app_name', ''),
                'domain' => Setting::get('general.domain', ''),
                'support_email' => Setting::get('general.support_email', ''),
                'whatsapp_cs' => Setting::get('general.whatsapp_cs', ''),
                'logo' => Setting::get('general.logo', ''),
                'maintenance_mode' => Setting::get('general.maintenance_mode', false),
                'auto_refund' => Setting::get('general.auto_refund', false)
            ],
            'general' => [
                'app_name' => Setting::get('general.app_name', ''),
                'domain' => Setting::get('general.domain', ''),
                'support_email' => Setting::get('general.support_email', ''),
                'whatsapp_cs' => Setting::get('general.whatsapp_cs', ''),
                'logo' => Setting::get('general.logo', ''),
                'maintenance_mode' => Setting::get('general.maintenance_mode', false),
                'auto_refund' => Setting::get('general.auto_refund', false)
            ],
            'business' => [
                'default_margin' => Setting::get('business.default_margin', 0),
                'reseller_commission' => Setting::get('business.reseller_commission', 0),
                'min_deposit' => Setting::get('business.min_deposit', 0)
            ],
            'notification' => [
                'email_enabled' => Setting::get('notification.email_enabled', false),
                'whatsapp_enabled' => Setting::get('notification.whatsapp_enabled', false),
                'smtp_host' => Setting::get('notification.smtp_host', ''),
                'smtp_port' => Setting::get('notification.smtp_port', ''),
                'smtp_username' => Setting::get('notification.smtp_username', ''),
                'whatsapp_api_key' => Setting::get('notification.whatsapp_api_key', '')
            ],
            'payment' => [
                'qris_enabled' => Setting::get('payment.qris_enabled', true),
                'qris_provider' => Setting::get('payment.qris_provider', 'midtrans'),
                'qris_fee' => Setting::get('payment.qris_fee', 0),
                'va_enabled' => Setting::get('payment.va_enabled', true),
                'va_provider' => Setting::get('payment.va_provider', 'midtrans'),
                'va_fee' => Setting::get('payment.va_fee', 0),
                'ewallet_enabled' => Setting::get('payment.ewallet_enabled', true),
                'ewallet_provider' => Setting::get('payment.ewallet_provider', 'midtrans'),
                'ewallet_fee' => Setting::get('payment.ewallet_fee', 0)
            ]
        ]);
    }

    public function saveSettings(Request $request)
    {
        $settings = $request->all();

        foreach ($settings as $group => $groupSettings) {
            foreach ($groupSettings as $key => $value) {
                $type = is_bool($value) ? 'boolean' : (is_numeric($value) ? 'number' : 'string');
                Setting::set("{$group}.{$key}", $value, $type, $group);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Settings saved successfully'
        ]);
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = 'logo_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('public/uploads', $filename);
            $url = '/storage/uploads/' . $filename;
            
            Setting::set('general.logo', $url, 'string', 'general');
            
            return response()->json([
                'success' => true,
                'message' => 'Logo uploaded successfully',
                'logo_url' => $url
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No file uploaded'
        ], 400);
    }
}