# NS Topup - Laravel Backend API

Backend API untuk platform topup game dengan integrasi Digiflazz dan Midtrans.

## 🏗️ Struktur Project

```
ns-topup/
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── Admin/              # Admin controllers
│   │   ├── Customer/           # Customer controllers
│   │   ├── AuthController.php  # Authentication
│   │   ├── PaymentController.php # Midtrans integration
│   │   └── DigiflazzController.php # Digiflazz integration
│   ├── Models/
│   │   ├── User.php           # User model with avatar support
│   │   ├── Order.php          # Order management
│   │   └── Game.php           # Game catalog
│   └── Services/
│       ├── DigiFlazzService.php # Digiflazz API service
│       └── MidtransService.php  # Midtrans API service
├── database/
│   ├── migrations/            # Database migrations
│   └── seeders/              # Database seeders
├── routes/
│   └── api.php               # API routes
└── storage/
    └── api-docs/             # Swagger documentation
```

## 🚀 Installation

1. **Install dependencies**
```bash
composer install
```

2. **Environment setup**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Database setup**
```bash
php artisan migrate --seed
```

4. **Start server**
```bash
php artisan serve --host=127.0.0.1 --port=8000
```

## 🔧 Configuration

### Database Settings
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ns_topup
DB_USERNAME=root
DB_PASSWORD=
```

### Payment Gateway
```env
MIDTRANS_SERVER_KEY=SB-Mid-server-UeAXyK53ps6mD8kD5oMjiQRA
MIDTRANS_CLIENT_KEY=SB-Mid-client-K5IIhOtJfHqw5-6H
MIDTRANS_IS_PRODUCTION=false
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Admin Profile
- `GET /api/admin/user` - Get admin profile
- `POST /api/admin/profile` - Update admin profile (with avatar)

### User Management
- `GET /api/admin/customers` - Get all customers
- `PATCH /api/admin/customers/{id}/block` - Block/unblock customer
- `DELETE /api/admin/customers/{id}` - Delete customer

### Customer Profile
- `GET /api/customer/profile` - Get customer profile
- `POST /api/customer/profile` - Update customer profile

### Payment
- `POST /api/payment/create` - Create payment
- `POST /api/payment/webhook` - Midtrans webhook
- `GET /api/payment/status/{orderId}` - Check payment status

### Games & Products
- `GET /api/games` - Get all games
- `GET /api/games/{gameId}/products` - Get products by game

## 🔐 Authentication

API menggunakan Laravel Sanctum untuk authentication:

```php
// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Your protected routes here
});
```

## 💾 Database Schema

### Users Table
```sql
- id (bigint, primary key)
- role (enum: admin, customer)
- avatar_url (string, nullable)
- name (string)
- email (string, unique)
- phone (string, nullable)
- balance (decimal)
- is_blocked (boolean)
- created_at, updated_at
```

### Orders Table
```sql
- id (string, primary key) # Midtrans transaction ID
- user_id (bigint, foreign key)
- game_name (string)
- product_name (string)
- target_user_id (string)
- amount (decimal)
- total_amount (decimal)
- status (enum: pending, processing, completed, failed)
- midtrans_snap_token (string, nullable)
- digiflazz_trx_id (string, nullable)
- created_at, updated_at
```

## 🔌 External Integrations

### Digiflazz API
```php
// Service class: App\Services\DigiFlazzService
- getBalance() - Check balance
- getPriceList() - Get product prices
- topup() - Process topup
- checkStatus() - Check transaction status
```

### Midtrans API
```php
// Service class: App\Services\MidtransService
- createTransaction() - Create payment
- getTransactionStatus() - Check status
- verifySignature() - Verify webhook
```

## 📁 File Upload

Avatar uploads disimpan di:
```
public/uploads/avatars/
```

Format: `avatar_{role}_{user_id}_{timestamp}.{extension}`

## 🧪 Testing

```bash
# Run tests
php artisan test

# Test API endpoints
curl -X GET "http://localhost/NS-topupgames/ns-topup/public/api/admin/user"
```

## 🔧 Artisan Commands

```bash
# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Database
php artisan migrate:fresh --seed
php artisan db:seed

# Storage link
php artisan storage:link
```