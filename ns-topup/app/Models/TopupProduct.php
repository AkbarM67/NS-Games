<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopupProduct extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $fillable = [
        'game_id',
        'product_name',
        'sku_code',
        'amount',
        'price',
        'base_price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'base_price' => 'decimal:2',
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'product_id');
    }
}
