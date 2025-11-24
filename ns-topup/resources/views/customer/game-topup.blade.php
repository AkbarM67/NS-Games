<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Top-Up {{ $game->name }} - NS Games</title>
    <link rel="stylesheet" href="{{ asset('css/customer.css') }}">
</head>
<body>
    <header class="header">
        <div class="nav-container">
            <img src="{{ asset('assets/images/Logo_Nsgames.png') }}" alt="NS Games" style="max-width: 150px; height: auto; margin-bottom: 10px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <nav class="nav-links">
                <a href="{{ route('customer.dashboard') }}">Beranda</a>
                <a href="{{ route('customer.games') }}">Games</a>
                <a href="{{ route('customer.orders') }}">Pesanan</a>
                <form action="{{ route('logout') }}" method="POST" style="display: inline;">
                    @csrf
                    <button type="submit" class="btn-logout">Logout</button>
                </form>
            </nav>
        </div>
    </header>

    <div class="container">
        <div class="topup-section">
            <div class="game-header">
                <div class="game-info">
                    <div class="game-image-large">
                        @if($game->image)
                            <img src="{{ asset('storage/' . $game->image) }}" alt="{{ $game->name }}">
                        @else
                            <div class="game-icon-large">🎮</div>
                        @endif
                    </div>
                    <div class="game-details">
                        <h1>{{ $game->name }}</h1>
                        <p>{{ $game->description }}</p>
                        <div class="game-badge">{{ $game->topupProducts->count() }} produk tersedia</div>
                    </div>
                </div>
                <a href="{{ route('customer.dashboard') }}" class="btn-back">← Kembali</a>
            </div>

            <div class="products-section">
                <h2>Pilih Nominal Top-Up</h2>
                <div class="products-grid">
                    @foreach($game->topupProducts as $product)
                    <div class="product-card" onclick="selectProduct({{ $product->id }}, '{{ $product->name }}', {{ $product->price }})">
                        <div class="product-icon">💎</div>
                        <div class="product-name">{{ $product->name }}</div>
                        <div class="product-price">Rp {{ number_format($product->price, 0, ',', '.') }}</div>
                        <div class="product-overlay">
                            <span>Pilih</span>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>

            <div class="order-form" id="orderForm" style="display: none;">
                <h2>Detail Pesanan</h2>
                <form action="{{ route('customer.order.create') }}" method="POST">
                    @csrf
                    <input type="hidden" name="product_id" id="selectedProductId">

                    <div class="form-group">
                        <label>Game</label>
                        <input type="text" value="{{ $game->name }}" readonly>
                    </div>

                    <div class="form-group">
                        <label>Produk</label>
                        <input type="text" id="selectedProductName" readonly>
                    </div>

                    <div class="form-group">
                        <label>Harga</label>
                        <input type="text" id="selectedProductPrice" readonly>
                    </div>

                    <div class="form-group">
                        <label for="game_id">ID Game/Username</label>
                        <input type="text" name="game_id" id="game_id" placeholder="Masukkan ID game atau username" required>
                    </div>

                    <div class="form-group">
                        <label for="server_id">Server ID (opsional)</label>
                        <input type="text" name="server_id" id="server_id" placeholder="Masukkan server ID jika diperlukan">
                    </div>

                    <button type="submit" class="btn-order">Buat Pesanan</button>
                </form>
            </div>
        </div>
    </div>

    <style>
        .topup-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .game-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 2px solid #f0f0f0;
        }

        .game-info {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .game-image-large {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .game-image-large img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 15px;
        }

        .game-icon-large {
            font-size: 40px;
            color: white;
        }

        .game-details h1 {
            font-size: 32px;
            font-weight: 700;
            color: #333;
            margin-bottom: 10px;
        }

        .game-details p {
            color: #666;
            font-size: 16px;
            margin-bottom: 15px;
        }

        .game-badge {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
        }

        .btn-back {
            background: #f8f9fa;
            color: #333;
            padding: 12px 20px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
        }

        .btn-back:hover {
            background: #e9ecef;
            transform: translateY(-2px);
        }

        .products-section h2 {
            font-size: 24px;
            font-weight: 700;
            color: #333;
            margin-bottom: 25px;
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .product-card {
            background: white;
            border: 2px solid #f0f0f0;
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }

        .product-card:hover {
            border-color: #4169E1;
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .product-card.selected {
            border-color: #4169E1;
            background: #f8f9ff;
        }

        .product-icon {
            font-size: 32px;
            margin-bottom: 15px;
        }

        .product-name {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }

        .product-price {
            font-size: 18px;
            font-weight: 700;
            color: #4169E1;
        }

        .product-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(65, 105, 225, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .product-overlay span {
            color: white;
            font-size: 16px;
            font-weight: 600;
        }

        .product-card:hover .product-overlay {
            opacity: 1;
        }

        .order-form {
            background: #f8f9ff;
            border-radius: 15px;
            padding: 30px;
            margin-top: 30px;
        }

        .order-form h2 {
            font-size: 24px;
            font-weight: 700;
            color: #333;
            margin-bottom: 25px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
        }

        .form-group input {
            width: 100%;
            padding: 15px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        .form-group input:focus {
            outline: none;
            border-color: #4169E1;
        }

        .form-group input[readonly] {
            background: #f8f9fa;
            color: #666;
        }

        .btn-order {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            width: 100%;
        }

        .btn-order:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
            .game-header {
                flex-direction: column;
                gap: 20px;
            }

            .game-info {
                flex-direction: column;
                text-align: center;
            }

            .products-grid {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            }
        }
    </style>

    <script>
        function selectProduct(productId, productName, productPrice) {
            // Remove previous selection
            document.querySelectorAll('.product-card').forEach(card => {
                card.classList.remove('selected');
            });

            // Add selection to clicked card
            event.currentTarget.classList.add('selected');

            // Fill form data
            document.getElementById('selectedProductId').value = productId;
            document.getElementById('selectedProductName').value = productName;
            document.getElementById('selectedProductPrice').value = 'Rp ' + new Intl.NumberFormat('id-ID').format(productPrice);

            // Show order form
            document.getElementById('orderForm').style.display = 'block';

            // Scroll to form
            document.getElementById('orderForm').scrollIntoView({ behavior: 'smooth' });
        }
    </script>
</body>
</html>
