<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'game_id',
        'product_name',
        'amount',
        'sku_code',
        'base_price',
        'price',
        'is_active',
        'provider',
        'category',
        'stock',
        'last_sync'
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'base_price' => 'decimal:2',
        'price' => 'decimal:2',
        'last_sync' => 'datetime'
    ];
    
    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
