<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NS Games - Dashboard</title>
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
        <div class="welcome-section">
            <h1 class="welcome-title">Selamat Datang!</h1>
            <p class="welcome-subtitle">Pilih game favoritmu dan mulai top-up sekarang</p>
            <div class="user-greeting">
                👋 Halo, {{ auth()->user()->name }}!
            </div>
        </div>

        <div class="games-section">
            <h2 class="section-title"> Pilih Game untuk Top-Up</h2>
            <p class="section-subtitle">Klik pada game yang ingin kamu top-up</p>

            <div class="games-grid">
                @foreach($games as $game)
                <div class="game-card" onclick="window.location.href='{{ route('customer.game.topup', $game->id) }}'">
                    <div class="game-image">
                        @if($game->image)
                            <img src="{{ asset('storage/' . $game->image) }}" alt="{{ $game->name }}">
                        @else
                            <div class="game-icon"></div>
                        @endif
                    </div>
                    <div class="game-content">
                        <h3>{{ $game->name }}</h3>
                        <p>{{ $game->description }}</p>
                        <div class="game-stats">
                            <div class="game-products">
                                {{ $game->topup_products_count }} produk
                            </div>
                            <div class="game-price">
                                Mulai Rp {{ number_format($game->min_price ?? 10000, 0, ',', '.') }}
                            </div>
                        </div>
                    </div>
                    <div class="game-overlay">
                        <div class="overlay-icon"></div>
                        <span>Klik untuk Top-Up</span>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </div>


</body>
</html>
