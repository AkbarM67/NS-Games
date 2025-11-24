<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class MidtransSettingsSeeder extends Seeder
{
    public function run()
    {
        $settings = [
            [
                'key' => 'payment.midtrans.server_key',
                'value' => env('MIDTRANS_SERVER_KEY', ''),
                'group' => 'payment'
            ],
            [
                'key' => 'payment.midtrans.client_key',
                'value' => env('MIDTRANS_CLIENT_KEY', ''),
                'group' => 'payment'
            ],
            [
                'key' => 'payment.midtrans.is_production',
                'value' => env('MIDTRANS_IS_PRODUCTION', false),
                'group' => 'payment'
            ]
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}