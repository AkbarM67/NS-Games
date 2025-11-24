<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class DashboardUpdated
{
    use Dispatchable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
        $this->broadcast();
    }

    private function broadcast()
    {
        try {
            Http::post('http://127.0.0.1:6001/broadcast', $this->data);
        } catch (\Exception $e) {
            \Log::error('WebSocket broadcast failed: ' . $e->getMessage());
        }
    }
}