<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'game_id', 'name', 'percentage', 'min_amount', 'start_date', 'end_date', 'is_active'
    ];
    
    protected $casts = [
        'percentage' => 'decimal:2',
        'min_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean'
    ];
    
    public function game()
    {
        return $this->belongsTo(Game::class);
    }
    
    public function isValid()
    {
        return $this->is_active && 
               $this->start_date <= now() && 
               $this->end_date >= now();
    }
}