<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NS Games - Daftar</title>
    <link rel="stylesheet" href="{{ asset('css/auth.css') }}">
</head>
<body>
     <div class="left-side">
            <img src="{{ asset('assets/images/Logo.png') }}" alt="NS Games Logo" onerror="this.innerHTML='NS<br>GAMES'; this.style.fontSize='120px'; this.style.fontWeight='900'; this.style.lineHeight='1.1';">
    </div>

    <div class="right-side">
        <div class="top-nav">
            <a href="/">Dashboard</a>
            <a href="{{ route('login') }}">Login</a>
            <a href="{{ route('register') }}">Daftar</a>
        </div>

        <div class="logo-box">
            <h1>NS Games</h1>
            <p>since 2025</p>
        </div>

        <div class="login-form">
            <h2>Daftar</h2>

            <form action="{{ route('register') }}" method="POST">
                @csrf

                <div class="form-group">
                    <label for="name">Nama Lengkap</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Masukkan nama lengkap"
                        value="{{ old('name') }}"
                        class="@error('name') is-invalid @enderror"
                        required
                    >
                    @error('name')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Masukkan username"
                        value="{{ old('username') }}"
                        class="@error('username') is-invalid @enderror"
                        required
                    >
                    @error('username')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="nama@example.com"
                        value="{{ old('email') }}"
                        class="@error('email') is-invalid @enderror"
                        required
                    >
                    @error('email')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="phone">Nomor Telepon</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="08xxxxxxxxxx"
                        value="{{ old('phone') }}"
                        class="@error('phone') is-invalid @enderror"
                        required
                    >
                    @error('phone')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Minimal 8 karakter"
                        class="@error('password') is-invalid @enderror"
                        required
                    >
                    @error('password')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="password_confirmation">Konfirmasi Password</label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        placeholder="Ulangi password"
                        required
                    >
                </div>

                <div class="button-group">
                    <button type="submit" class="btn btn-daftar">Daftar</button>
                    <a href="{{ route('login') }}" class="btn btn-login" style="text-decoration: none; text-align: center;">Login</a>
                </div>
            </form>
        </div>
    </div>

</body>
</html>
