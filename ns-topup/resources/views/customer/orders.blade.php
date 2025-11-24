@extends('layouts.app')

@section('title', 'My Orders - NS Topup')

@section('content')
<div class="row">
    <div class="col-12">
        <h2>My Orders</h2>
    </div>
</div>

<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-body">
                @if($orders->count() > 0)
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Game</th>
                                    <th>Product</th>
                                    <th>Player ID</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($orders as $order)
                                <tr>
                                    <td>{{ $order->game_name ?? ($order->product->game->name ?? 'N/A') }}</td>
                                    <td>{{ $order->product_name ?? ($order->product->product_name ?? 'N/A') }}</td>
                                    <td>{{ $order->player_id }}</td>
                                    <td>
                                        @php
                                            $statusClass = match($order->status) {
                                                'success' => 'success',
                                                'pending', 'processing' => 'warning',
                                                'waiting_payment' => 'info',
                                                'failed' => 'danger',
                                                default => 'secondary'
                                            };
                                        @endphp
                                        <span class="badge bg-{{ $statusClass }}">
                                            {{ ucfirst(str_replace('_', ' ', $order->status)) }}
                                        </span>
                                    </td>
                                    <td>Rp {{ number_format($order->total_price, 0, ',', '.') }}</td>
                                    <td>{{ $order->created_at->format('d/m/Y H:i') }}</td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                    
                    {{ $orders->links() }}
                @else
                    <p class="text-center text-muted">No orders yet. <a href="/customer/games">Start ordering!</a></p>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection