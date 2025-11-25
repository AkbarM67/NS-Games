<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>NS Games Store - Platform Top-Up Game, Pulsa & E-Wallet Terpercaya</title>
    <link rel="stylesheet" href="{{ asset('css/welcome.css') }}">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="nav-container">
            <div class="logo">
                <img src="{{ asset('assets/images/Logo_Nsgames.png') }}" alt="NS Games Store" style="max-width: 150px; height: auto;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            </div>
            <nav class="nav-links">
                <a href="#home">Beranda</a>
                <a href="#categories">Kategori</a>
                <a href="#games">Games</a>
                <a href="#features">Fitur</a>
                <a href="{{ route('login') }}" class="btn-login">Masuk</a>
                <a href="{{ route('register') }}" class="btn-register">Daftar</a>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="hero-container">
            <div class="hero-content">
                <div class="hero-badge">
                    <i class="fas fa-sparkles"></i>
                    <span>Platform Topup #1 di Indonesia</span>
                </div>
                <h1>Topup Game, Pulsa & E-Wallet</h1>
                <p>Cepat, Murah, dan Terpercaya! Proses otomatis dalam hitungan detik dengan harga terbaik di Indonesia.</p>
                <div class="hero-buttons">
                    <a href="{{ route('register') }}" class="btn btn-hero-primary">
                        Belanja Sekarang
                        <i class="fas fa-chevron-right"></i>
                    </a>
                    <a href="#games" class="btn btn-hero-secondary">Cek Promo</a>
                </div>

                <!-- Stats -->
                <div class="hero-stats">
                    <div class="stat-item">
                        <div class="stat-number">50k+</div>
                        <div class="stat-label">User Aktif</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">100+</div>
                        <div class="stat-label">Produk</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">4.9</div>
                        <div class="stat-label">Rating</div>
                    </div>
                </div>
            </div>

            <div class="hero-promo">
                <div class="promo-card">
                    <div class="promo-header">
                        <h3>Promo Hari Ini! 🎉</h3>
                        <p>Dapatkan diskon hingga 15%</p>
                    </div>
                    <div class="promo-items" id="hero-promos">
                        <!-- Promo items will be loaded dynamically -->
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Categories Section -->
    <section class="categories" id="categories">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Kategori Produk</h2>
                <p class="section-subtitle">Pilih kategori yang kamu butuhkan</p>
            </div>

            <div class="categories-grid">
                <div class="category-card game-category">
                    <div class="category-icon">
                        <i class="fas fa-gamepad"></i>
                    </div>
                    <h3>Games</h3>
                    <p>50+ Produk</p>
                </div>

                <div class="category-card pulsa-category">
                    <div class="category-icon">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <h3>Pulsa & Data</h3>
                    <p>25+ Produk</p>
                </div>

                <div class="category-card ewallet-category">
                    <div class="category-icon">
                        <i class="fas fa-wallet"></i>
                    </div>
                    <h3>E-Wallet</h3>
                    <p>15+ Produk</p>
                </div>

                <div class="category-card voucher-category">
                    <div class="category-icon">
                        <i class="fas fa-gift"></i>
                    </div>
                    <h3>Voucher</h3>
                    <p>10+ Produk</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Games Section -->
    <section class="games" id="games">
        <div class="container">
            <div class="section-header">
                <div class="section-info">
                    <h2 class="section-title">Game Populer</h2>
                    <p class="section-subtitle">Produk paling banyak dibeli</p>
                </div>
                <a href="{{ route('login') }}" class="btn btn-outline">
                    Lihat Semua
                    <i class="fas fa-chevron-right"></i>
                </a>
            </div>

            <div class="games-grid">
                @php
                $popularGames = [
                    ['name' => 'Mobile Legends', 'icon' => '⚔️', 'desc' => 'Diamonds & Battle Points', 'price' => '15.000', 'sales' => '1.2k', 'discount' => '10'],
                    ['name' => 'Free Fire', 'icon' => '🔥', 'desc' => 'Diamonds & Elite Pass', 'price' => '10.000', 'sales' => '980', 'discount' => null],
                    ['name' => 'PUBG Mobile', 'icon' => '🎯', 'desc' => 'UC & Royal Pass', 'price' => '20.000', 'sales' => '750', 'discount' => '15'],
                    ['name' => 'Genshin Impact', 'icon' => '⭐', 'desc' => 'Genesis Crystals', 'price' => '25.000', 'sales' => '650', 'discount' => null],
                ];
                @endphp

                @foreach($popularGames as $game)
                <div class="game-card">
                    <div class="game-image">
                        {{ $game['icon'] }}
                        @if($game['discount'])
                            <div class="discount-badge">-{{ $game['discount'] }}%</div>
                        @endif
                    </div>
                    <div class="game-content">
                        <h4>{{ $game['name'] }}</h4>
                        <p class="game-desc">{{ $game['desc'] }}</p>
                        <div class="game-price">Mulai Rp {{ number_format($game['price'], 0, ',', '.') }}</div>
                        <div class="game-sales">{{ $game['sales'] }} terjual hari ini</div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </section>

    <!-- Promo Section -->
    <section class="promo-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Promo Spesial</h2>
                <p class="section-subtitle">Dapatkan diskon dan cashback menarik!</p>
            </div>

            <div class="promo-grid" id="main-promos">
                <!-- Promo cards will be loaded dynamically -->
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Kenapa Pilih Kami?</h2>
                <p class="section-subtitle">Keunggulan yang membuat kami berbeda</p>
            </div>

            <div class="features-grid">
                <div class="feature-item">
                    <div class="feature-icon">
                        <i class="fas fa-bolt"></i>
                    </div>
                    <h4>Proses Cepat</h4>
                    <p>Rata-rata kurang dari 1 menit</p>
                </div>

                <div class="feature-item">
                    <div class="feature-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h4>100% Aman</h4>
                    <p>Transaksi terenkripsi</p>
                </div>

                <div class="feature-item">
                    <div class="feature-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <h4>24/7 Support</h4>
                    <p>CS siap membantu</p>
                </div>

                <div class="feature-item">
                    <div class="feature-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <h4>Harga Terbaik</h4>
                    <p>Termurah se-Indonesia</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Testimoni Pelanggan</h2>
                <p class="section-subtitle">Apa kata mereka tentang kami</p>
            </div>

            <div class="testimonials-grid">
                <div class="testimonial-card">
                    <div class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <p>"Pelayanan cepat banget! Diamonds langsung masuk dalam 1 menit."</p>
                    <div class="testimonial-author">Ahmad S.</div>
                </div>

                <div class="testimonial-card">
                    <div class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <p>"Harga paling murah yang pernah saya temukan. Recommended!"</p>
                    <div class="testimonial-author">Siti R.</div>
                </div>

                <div class="testimonial-card">
                    <div class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <p>"CS nya responsif dan ramah. Transaksi aman dan terpercaya."</p>
                    <div class="testimonial-author">Budi W.</div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="container">
            <div class="cta-card">
                <h2>Siap Topup Sekarang?</h2>
                <p>Dapatkan diamond, UC, dan pulsa dalam hitungan detik!</p>
                <a href="{{ route('register') }}" class="btn btn-cta">
                    Mulai Belanja
                    <i class="fas fa-chevron-right"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-section">
                    <h3>NS Games Store</h3>
                    <p>Platform topup game, pulsa, dan e-wallet terpercaya dan termurah di Indonesia.</p>
                </div>
                <div class="footer-section">
                    <h4>Produk</h4>
                    <ul>
                        <li>Mobile Legends</li>
                        <li>Free Fire</li>
                        <li>PUBG Mobile</li>
                        <li>Pulsa & Data</li>
                        <li>E-Wallet</li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Bantuan</h4>
                    <ul>
                        <li>Cara Order</li>
                        <li>FAQ</li>
                        <li>Syarat & Ketentuan</li>
                        <li>Kebijakan Privasi</li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Hubungi Kami</h4>
                    <ul>
                        <li>WhatsApp: 0812-3456-7890</li>
                        <li>Email: cs@nsgames.com</li>
                        <li>Instagram: @nsgamesstore</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 NS Games Store. All rights reserved.</p>
            </div>
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
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Copy promo code functionality
        document.querySelectorAll('.btn-copy').forEach(button => {
            button.addEventListener('click', function() {
                const promoCode = this.previousElementSibling.textContent;
                navigator.clipboard.writeText(promoCode).then(() => {
                    this.textContent = 'Tersalin!';
                    setTimeout(() => {
                        this.textContent = 'Salin';
                    }, 2000);
                });
            });
        });

        // Load real-time promo data
        async function loadPromos() {
            try {
                const response = await fetch('/api/promos/active');
                const data = await response.json();
                
                if (data.success && data.data.length > 0) {
                    loadHeroPromos(data.data.slice(0, 2));
                    loadMainPromos(data.data.slice(0, 3));
                } else {
                    showEmptyPromos();
                }
            } catch (error) {
                console.error('Error loading promos:', error);
                showEmptyPromos();
            }
        }

        function loadHeroPromos(promos) {
            const container = document.getElementById('hero-promos');
            container.innerHTML = promos.map(promo => `
                <div class="promo-item">
                    <div class="promo-info">
                        <p class="promo-title">${promo.name}</p>
                        <code class="promo-code">${promo.code}</code>
                    </div>
                    <button class="btn-promo" onclick="copyCode('${promo.code}', this)">Pakai</button>
                </div>
            `).join('');
        }

        function loadMainPromos(promos) {
            const container = document.getElementById('main-promos');
            const colors = ['promo-blue', 'promo-green', 'promo-orange'];
            
            container.innerHTML = promos.map((promo, index) => `
                <div class="promo-card-large ${colors[index % colors.length]}">
                    <div class="promo-content">
                        <div class="promo-badge">
                            <i class="fas fa-gift"></i>
                            <span>Promo Spesial</span>
                        </div>
                        <h3>${promo.name}</h3>
                        <p>${promo.description || 'Dapatkan penawaran menarik dengan kode promo ini'}</p>
                        <div class="promo-code-container">
                            <code class="promo-code-display">${promo.code}</code>
                            <button class="btn-copy" onclick="copyCode('${promo.code}', this)">Salin</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function showEmptyPromos() {
            document.getElementById('hero-promos').innerHTML = `
                <div class="promo-item">
                    <div class="promo-info">
                        <p class="promo-title">Belum ada promo</p>
                        <code class="promo-code">-</code>
                    </div>
                </div>
            `;
            
            document.getElementById('main-promos').innerHTML = `
                <div class="promo-card-large promo-blue">
                    <div class="promo-content">
                        <div class="promo-badge">
                            <i class="fas fa-gift"></i>
                            <span>Promo Spesial</span>
                        </div>
                        <h3>Belum ada promo tersedia</h3>
                        <p>Promo menarik akan segera hadir!</p>
                    </div>
                </div>
            `;
        }

        function copyCode(code, button) {
            navigator.clipboard.writeText(code).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Tersalin!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            });
        }

        // Load promos on page load
        document.addEventListener('DOMContentLoaded', loadPromos);
        
        // Refresh promos every 30 seconds
        setInterval(loadPromos, 30000);
    </script>
</body>
</html>
