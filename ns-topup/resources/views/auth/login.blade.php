<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NS Games - Login</title>
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
            <h2>Login</h2>

            <form action="{{ route('login') }}" method="POST">
                @csrf

                <div class="form-group">
                    <label for="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="admin@gmail.com"
                        value="{{ old('email') }}"
                        class="@error('email') is-invalid @enderror"
                        required
                    >
                    @error('email')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="**********"
                        class="@error('password') is-invalid @enderror"
                        required
                    >
                    @error('password')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>

                <div class="forgot-password">
                    <a href="#">Lupa Kata Sandi ?</a>
                </div>

                <div class="button-group">
                    <button type="submit" class="btn btn-login">Login</button>
                    <a href="{{ route('register') }}" class="btn btn-daftar" style="text-decoration: none; text-align: center;">Daftar</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
