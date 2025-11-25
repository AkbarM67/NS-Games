<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Promo extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'type',
        'value',
        'value_type',
        'min_transaction',
        'max_discount',
        'quota',
        'used',
        'valid_from',
        'valid_until',
        'status',
        'target_users',
        'description'
    ];

    protected $casts = [
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'value' => 'decimal:2',
        'min_transaction' => 'decimal:2',
        'max_discount' => 'decimal:2'
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                    ->where('valid_from', '<=', now())
                    ->where('valid_until', '>=', now());
    }

    public function isValid()
    {
        return $this->status === 'active' && 
               $this->valid_from <= now() && 
               $this->valid_until >= now() &&
               ($this->quota === null || $this->used < $this->quota);
    }

    public function canUse($userId = null)
    {
        if (!$this->isValid()) {
            return false;
        }

        // Add user-specific validation logic here if needed
        return true;
    }
}
