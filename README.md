# NS Topup Games Platform

Platform digital untuk layanan topup game, pulsa, dan e-wallet dengan sistem pembayaran terintegrasi.

## Overview

NS Topup Games adalah platform B2B2C yang menyediakan layanan topup digital dengan fokus pada:
- Topup game mobile (Mobile Legends, Free Fire, PUBG, dll)
- Pulsa dan paket data
- E-wallet (GoPay, OVO, DANA, ShopeePay)
- Voucher game dan aplikasi

## Architecture

```
├── ns-topup/              # Backend API (Laravel)
├── frontend_admin/        # Admin Dashboard (React)
├── frontend-customer/     # Customer Portal (React)
└── docs/                  # Documentation
```

## Quick Setup

### Requirements
- PHP 8.1+
- Node.js 18+
- MySQL 5.7+
- Composer

### Installation

1. **Backend Setup**
```bash
cd ns-topup
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

2. **Admin Dashboard**
```bash
cd frontend_admin
npm install
npm run dev
```

3. **Customer Portal**
```bash
cd frontend-customer
npm install
npm run dev
```

## Configuration

### Database
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ns_topup
DB_USERNAME=root
DB_PASSWORD=
```

### Payment Gateway (Midtrans)
```env
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_IS_PRODUCTION=false
```

### Provider API (Digiflazz)
Configure via admin dashboard settings.

## Access Points

- **API**: http://127.0.0.1:8000
- **Admin**: http://localhost:3000
- **Customer**: http://localhost:3001
- **Documentation**: http://127.0.0.1:8000/api-docs.html


## Features

### Core Features
- Multi-role authentication system
- Real-time transaction processing
- Automated order fulfillment
- Balance management
- Commission system

### Admin Features
- Dashboard analytics
- User management
- Product catalog management
- Transaction monitoring
- System configuration

### Customer Features
- Product browsing
- Order placement
- Balance top-up
- Transaction history
- Profile management

## Tech Stack

**Backend**
- Laravel 10
- MySQL
- Laravel Sanctum
- Queue Jobs

**Frontend**
- React 18
- TypeScript
- Tailwind CSS
- Vite

**Integrations**
- Digiflazz API
- Midtrans Payment Gateway
- WebSocket (Real-time)

## Documentation

- [API Documentation](docs/api/)
- [User Guides](docs/guides/)
- [Development](docs/development/)

## Support

For technical support or business inquiries, please contact our development team.

## License

Proprietary - All rights reserved
