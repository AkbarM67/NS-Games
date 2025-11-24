<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'category', 'description', 'image', 'base_price', 'profit_margin', 'is_active'
    ];
    
    protected $casts = [
        'base_price' => 'decimal:2',
        'profit_margin' => 'decimal:2',
        'is_active' => 'boolean'
    ];

    public function discounts()
    {
        return $this->hasMany(Discount::class);
    }
    
    public function topupProducts()
    {
        return $this->hasMany(TopupProduct::class);
    }
    
    public function products()
    {
        return $this->hasMany(TopupProduct::class);
    }
    
    public function orders()
    {
        return $this->hasManyThrough(Order::class, TopupProduct::class, 'game_id', 'product_id');
    }
    
    public function getFinalPriceAttribute()
    {
        $appFee = Setting::getValue('app_fee', 0);
        return $this->base_price + ($this->base_price * $this->profit_margin / 100) + $appFee;
    }
}
