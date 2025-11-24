@extends('layouts.app')

@section('title', 'Games -
}')

@section('content')
<div class="row mb-4">
    <div class="col-12">
        <h2>Available Games & Top-Up Packages</h2>
        <p class="text-muted">Pilih game dan paket top-up yang kamu inginkan</p>
    </div>
</div>

<div class="row">
    @forelse($games as $game)
    <div class="col-lg-6 mb-4">
        <div class="card h-100">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0">{{ $game->name }}</h5>
                <small>{{ $game->topupProducts->count() }} paket tersedia</small>
            </div>
            <div class="card-body">
                @forelse($game->topupProducts as $product)
                <div class="card mb-2 border-left-primary">
                    <div class="card-body p-3">
                        <div class="row align-items-center">
                            <div class="col-8">
                                <h6 class="mb-1">{{ $product->product_name }}</h6>
                                @if($product->amount)
                                    <small class="text-muted">{{ number_format($product->amount) }} {{ str_contains($game->name, 'Mobile Legends') ? 'Diamonds' : (str_contains($game->name, 'Free Fire') ? 'Diamonds' : 'Credits') }}</small>
                                @endif
                            </div>
                            <div class="col-4 text-end">
                                <div class="text-success font-weight-bold">Rp {{ number_format($product->price, 0, ',', '.') }}</div>
                                @if($product->base_price < $product->price)
                                    <small class="text-muted"><s>Rp {{ number_format($product->base_price, 0, ',', '.') }}</s></small>
                                @endif
                            </div>
                        </div>
                        <button class="btn btn-outline-primary btn-sm mt-2 w-100" onclick="orderProduct({{ $product->id }}, '{{ $product->product_name }}', {{ $product->price }})">🛒 Order Sekarang</button>
                    </div>
                </div>
                @empty
                <p class="text-muted text-center">Belum ada paket tersedia</p>
                @endforelse
            </div>
        </div>
    </div>
    @empty
    <div class="col-12">
        <div class="alert alert-info text-center">
            <h5>Belum ada game tersedia</h5>
            <p>Admin sedang menambahkan game dan paket top-up. Silakan cek kembali nanti!</p>
        </div>
    </div>
    @endforelse
</div>

<!-- Order Modal -->
<div class="modal fade" id="orderModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Order Top-Up</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form id="orderForm" action="/api/customer/orders" method="POST">
                @csrf
                <div class="modal-body">
                    <input type="hidden" id="product_id" name="product_id">

                    <div class="mb-3">
                        <label class="form-label">Produk</label>
                        <div id="product_info" class="form-control-plaintext"></div>
                    </div>

                    <div class="mb-3">
                        <label for="player_id" class="form-label">Player ID *</label>
                        <input type="text" class="form-control" id="player_id" name="player_id" required>
                        <small class="text-muted">Masukkan ID player/user ID game kamu</small>
                    </div>

                    <div class="mb-3">
                        <label for="server_id" class="form-label">Server ID</label>
                        <input type="text" class="form-control" id="server_id" name="server_id">
                        <small class="text-muted">Opsional, jika game memerlukan server ID</small>
                    </div>

                    <div class="mb-3">
                        <label for="payment_method" class="form-label">Metode Pembayaran *</label>
                        <select class="form-control" id="payment_method" name="payment_method" required>
                            <option value="">Pilih metode pembayaran</option>
                            <option value="BCA">Transfer BCA</option>
                            <option value="OVO">OVO</option>
                            <option value="DANA">DANA</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-primary">Buat Order</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
function orderProduct(productId, productName, price) {
    document.getElementById('product_id').value = productId;
    document.getElementById('product_info').innerHTML = `<strong>${productName}</strong><br><span class="text-success">Rp ${price.toLocaleString('id-ID')}</span>`;
    new bootstrap.Modal(document.getElementById('orderModal')).show();
}

document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Simple form submission - in real app, use AJAX
    alert('Fitur order akan segera tersedia! Gunakan API endpoint untuk sementara.');
});
</script>
@endsection
