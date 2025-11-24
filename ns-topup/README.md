# NS Topup Backend API

Laravel-based backend API for NS Topup Games Platform.

## Features

- 🔐 Multi-role authentication (Admin/Customer)
- 🎮 Game product management
- 💰 Order processing system
- 💳 Midtrans payment integration
- 🔌 Digiflazz provider integration
- 📊 Real-time dashboard data
- 🔄 WebSocket support
- 📝 Activity logging
- 🖼️ File upload system

## Tech Stack

- Laravel 10
- MySQL database
- Laravel Sanctum for API authentication
- Swagger for API documentation
- WebSocket for real-time features

## Installation

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

## API Documentation

- Swagger UI: `http://127.0.0.1:8000/api-docs.html`
- JSON Spec: `http://127.0.0.1:8000/storage/api-docs/api-docs.json`

## Default Accounts

**Admin:**
- Email: admin@example.com
- Password: password

**Customer:**
- Email: customer@example.com
- Password: password

## Configuration

Configure payment gateway and provider settings via the admin dashboard or environment variables.