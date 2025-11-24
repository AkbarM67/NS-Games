<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Events\DashboardUpdated;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'user_id',
        'product_id',
        'game_name',
        'product_name',
        'player_id',
        'server_id',
        'target_user_id',
        'amount',
        'total_price',
        'payment_method',
        'payment_proof_url',
        'status',
        'external_api_ref',
        'digiflazz_response',
        'snap_token',
        'paid_at',
        'notes'
    ];
    
    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'total_price' => 'decimal:2',
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::created(function ($order) {
            broadcast(new DashboardUpdated(self::getDashboardData()));
        });

        static::updated(function ($order) {
            broadcast(new DashboardUpdated(self::getDashboardData()));
        });
    }

    private static function getDashboardData()
    {
        $controller = new \App\Http\Controllers\Api\DashboardController();
        return $controller->index()->getData(true);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(TopupProduct::class, 'product_id');
    }

    public function orderLogs()
    {
        return $this->hasMany(OrderLog::class);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
