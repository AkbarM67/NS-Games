# 📚 Swagger API Documentation

## 🚀 Akses Dokumentasi

Setelah server berjalan, akses dokumentasi Swagger di:
```
http://localhost:8000/api/documentation
```

## 📋 Setup & Generate

1. **Install L5-Swagger** (sudah dilakukan):
```bash
composer require darkaonline/l5-swagger
```

2. **Publish Config**:
```bash
php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"
```

3. **Generate Documentation**:
```bash
php artisan l5-swagger:generate
```

## 🔧 Konfigurasi

File config: `config/l5-swagger.php`
- Base URL: `http://localhost:8000/api`
- Security: Bearer Token Authentication

## 📖 Endpoint yang Terdokumentasi

### 🔐 Authentication
- `POST /api/register` - Register user baru
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/me` - Get user info

### 👤 Customer - Games
- `GET /api/customer/games` - List semua game dengan produk
- `GET /api/customer/games/{id}` - Detail game dengan produk

### 🛒 Customer - Orders
- `GET /api/customer/orders` - History pemesanan customer
- `POST /api/customer/orders` - Buat order baru
- `POST /api/customer/orders/{id}/payment-proof` - Upload bukti bayar

### 📊 Admin - Dashboard
- `GET /api/admin/dashboard` - Statistik dashboard admin

### 🔧 Admin - Orders
- `GET /api/admin/orders` - List semua order (dengan filter)
- `PUT /api/admin/orders/{id}/status` - Update status order

## 🔑 Authentication di Swagger

1. Klik tombol **"Authorize"** di Swagger UI
2. Masukkan Bearer Token: `Bearer YOUR_TOKEN_HERE`
3. Token didapat dari endpoint `/api/login`

## 📝 Contoh Request/Response

### Login Request:
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

### Login Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  },
  "token": "1|abcdef123456..."
}
```

### Create Order Request:
```json
{
  "product_id": 1,
  "player_id": "123456789",
  "server_id": "2001",
  "payment_method": "BCA"
}
```

## 🎯 Fitur Swagger UI

- ✅ **Try it out** - Test endpoint langsung dari browser
- ✅ **Authentication** - Bearer token support
- ✅ **Request/Response Examples** - Contoh data lengkap
- ✅ **Parameter Documentation** - Penjelasan setiap parameter
- ✅ **Status Codes** - HTTP response codes
- ✅ **Schema Models** - Struktur data yang jelas

## 🔄 Update Documentation

Setiap kali menambah/ubah endpoint:

1. **Tambah annotation** di controller:
```php
/**
 * @OA\Get(
 *     path="/api/endpoint",
 *     summary="Description",
 *     tags={"Tag Name"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(response=200, description="Success")
 * )
 */
```

2. **Generate ulang**:
```bash
php artisan l5-swagger:generate
```

3. **Refresh browser** untuk melihat perubahan

## 📱 Testing dengan Swagger

1. Buka `http://localhost:8000/api/documentation`
2. Login dulu via `/api/login` untuk dapat token
3. Authorize dengan token tersebut
4. Test endpoint lain dengan tombol "Try it out"

## 🎨 Customization

- **Logo**: Edit `resources/views/vendor/l5-swagger/index.blade.php`
- **Theme**: Ubah di config `l5-swagger.php`
- **Base URL**: Sesuaikan dengan environment

Dokumentasi Swagger sudah siap digunakan! 🎉