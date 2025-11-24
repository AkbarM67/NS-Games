<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NS Games - Platform Top-Up Game Terpercaya</title>
    <link rel="stylesheet" href="{{ asset('css/welcome.css') }}">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="nav-container">
            <img src="{{ asset('assets/images/Logo_Nsgames.png') }}" alt="NS Games" style="max-width: 150px; height: auto; margin-bottom: 10px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <nav class="nav-links">
                <a href="#home">Beranda</a>
                <a href="#features">Fitur</a>
                <a href="#games">Games</a>
                @guest
                    <a href="{{ route('login') }}" class="btn-primary">Masuk</a>
                    <a href="{{ route('register') }}">Daftar</a>
                @else
                    <a href="{{ auth()->user()->isAdmin() ? '/admin/dashboard' : '/customer/dashboard' }}" class="btn-primary">Dashboard</a>
                @endguest
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="hero-content">
            <h1>NS Games</h1>
            <p>Platform top-up game terpercaya dengan harga terjangkau dan proses super cepat! Nikmati pengalaman gaming terbaik dengan layanan 24/7.</p>
            <div class="hero-buttons">
                @guest
                    <a href="{{ route('register') }}" class="btn btn-hero-primary">🎯 Daftar Gratis</a>
                    <a href="#games" class="btn btn-hero-secondary">Lihat Games</a>
                @else
                    <a href="{{ auth()->user()->isAdmin() ? '/admin/dashboard' : '/customer/dashboard' }}" class="btn btn-hero-primary">🚀 Ke Dashboard</a>
                    <a href="#games" class="btn btn-hero-secondary">Mulai Top-Up</a>
                @endguest
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
        <div class="container">
            <h2 class="section-title"> Mengapa Pilih NS Games?</h2>
            <p class="section-subtitle">Kami memberikan layanan terbaik untuk pengalaman gaming yang luar biasa</p>

            <div class="features-grid">
                <div class="feature-card">
                    <span class="feature-icon">⚡</span>
                    <h3>Proses Super Cepat</h3>
                    <p>Top-up otomatis dalam hitungan detik! Sistem kami yang canggih memastikan transaksi Anda diproses dengan kecepatan maksimal.</p>
                </div>

                <div class="feature-card">
                    <span class="feature-icon">🛡️</span>
                    <h3>Aman & Terpercaya</h3>
                    <p>Keamanan data dan transaksi Anda adalah prioritas utama. Dilengkapi dengan enkripsi SSL dan sistem keamanan berlapis.</p>
                </div>

                <div class="feature-card">
                    <span class="feature-icon">💰</span>
                    <h3>Harga Terjangkau</h3>
                    <p>Dapatkan harga terbaik di pasaran dengan berbagai promo menarik dan cashback untuk member setia.</p>
                </div>

                <div class="feature-card">
                    <span class="feature-icon">🎯</span>
                    <h3>Akurasi 100%</h3>
                    <p>Sistem otomatis yang akurat memastikan top-up masuk ke akun game Anda tanpa kesalahan.</p>
                </div>

                <div class="feature-card">
                    <span class="feature-icon">🌟</span>
                    <h3>Layanan 24/7</h3>
                    <p>Tim customer service kami siap membantu Anda kapan saja, 24 jam sehari 7 hari seminggu.</p>
                </div>

                <div class="feature-card">
                    <span class="feature-icon">🎮</span>
                    <h3>Banyak Pilihan Game</h3>
                    <p>Tersedia berbagai game populer dari Mobile Legends, Free Fire, PUBG, hingga Genshin Impact.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Games Section -->
    <section class="games" id="games">
        <div class="container">
            <h2 class="section-title">Game Populer</h2>
            <p class="section-subtitle">Pilih game favoritmu dan mulai top-up sekarang juga!</p>

            <div class="games-grid">
                @php
                $popularGames = [
                    ['name' => 'Mobile Legends', 'icon' => '⚔️', 'desc' => 'Diamonds & Battle Points', 'price' => 'Mulai dari Rp 15.000'],
                    ['name' => 'Free Fire', 'icon' => '🔥', 'desc' => 'Diamonds & Elite Pass', 'price' => 'Mulai dari Rp 10.000'],
                    ['name' => 'PUBG Mobile', 'icon' => '🎯', 'desc' => 'UC & Royal Pass', 'price' => 'Mulai dari Rp 20.000'],
                    ['name' => 'Genshin Impact', 'icon' => '⭐', 'desc' => 'Genesis Crystals', 'price' => 'Mulai dari Rp 25.000'],
                    ['name' => 'Valorant', 'icon' => '🎪', 'desc' => 'VP & Battle Pass', 'price' => 'Mulai dari Rp 30.000'],
                    ['name' => 'Call of Duty Mobile', 'icon' => '🔫', 'desc' => 'CP & Battle Pass', 'price' => 'Mulai dari Rp 18.000'],
                ];
                @endphp

                @foreach($popularGames as $game)
                <div class="game-card">
                    <div class="game-image">
                        {{ $game['icon'] }}
                    </div>
                    <div class="game-content">
                        <h4>{{ $game['name'] }}</h4>
                        <p>{{ $game['desc'] }}</p>
                        <div class="game-price">{{ $game['price'] }}</div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-links">
                <a href="#home">Beranda</a>
                <a href="#features">Fitur</a>
                <a href="#games">Games</a>
                <a href="{{ route('login') }}">Login</a>
                <a href="{{ route('register') }}">Daftar</a>
            </div>
            <p>&copy; 2025 NS Games. All rights reserved. Made with for gamers.</p>
            <p style="font-size: 12px; opacity: 0.7; margin-top: 10px;">🎮 Platform Top-Up Game Terpercaya • ⚡ Proses Cepat • 🛡️ Aman & Terpercaya</p>
        </div>
    </footer>

    <script>
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Header background on scroll
        window.addEventListener('scroll', function() {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });

    </script>
    </script>
</body>
</html>
