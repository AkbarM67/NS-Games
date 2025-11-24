<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value', 'type', 'group'];

    public static function get($key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        
        if (!$setting) {
            return $default;
        }

        return match($setting->type) {
            'json' => json_decode($setting->value, true),
            'boolean' => (bool) $setting->value,
            'number' => (float) $setting->value,
            default => $setting->value
        };
    }

    public static function set($key, $value, $type = 'string', $group = 'general')
    {
        $processedValue = match($type) {
            'json' => json_encode($value),
            'boolean' => $value ? '1' : '0',
            default => (string) $value
        };

        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $processedValue, 'type' => $type, 'group' => $group]
        );
    }
}