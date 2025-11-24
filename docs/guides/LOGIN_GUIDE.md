# Panduan Login NS Topup

## 1. Login via Web Interface

### Akses Login Page
- Buka browser dan kunjungi: `http://localhost:8000/login`
- Atau langsung ke root: `http://localhost:8000/` (akan redirect ke login)

### Demo Accounts
**Admin:**
- Email: `admin@example.com`
- Password: `password`
- Setelah login akan redirect ke `/admin/dashboard`

**Customer:**
- Email: `customer@example.com`  
- Password: `password`
- Setelah login akan redirect ke `/customer/dashboard`

### Fitur Web Login
- ✅ Remember me checkbox
- ✅ Form validation dengan error messages
- ✅ Auto redirect berdasarkan role (admin/customer)
- ✅ Session management
- ✅ CSRF protection

## 2. Login via API

### Endpoint Login
```
POST /api/login
Content-Type: application/json

{
    "email": "admin@example.com",
    "password": "password"
}
```

### Response Success
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "name": "Admin",
        "email": "admin@example.com",
        "role": "admin",
        "avatar_url": null,
        "created_at": "2025-11-19T02:40:59.000000Z",
        "updated_at": "2025-11-19T02:40:59.000000Z"
    },
    "token": "1|abcdef123456..."
}
```

### Menggunakan Token
Setelah login, gunakan token untuk request selanjutnya:
```
Authorization: Bearer 1|abcdef123456...
```

### Test dengan cURL
```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Menggunakan token
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. Register Account Baru

### Via Web
- Kunjungi: `http://localhost:8000/register`
- Isi form: nama, email, password, konfirmasi password
- Otomatis login setelah register sebagai customer

### Via API
```
POST /api/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

## 4. Logout

### Via Web
- Klik tombol "Logout" di navbar
- Atau POST ke `/logout`

### Via API
```
POST /api/logout
Authorization: Bearer YOUR_TOKEN_HERE
```

## 5. Menjalankan Server

```bash
# Masuk ke direktori project
cd c:\laragon\www\ns-topup

# Jalankan server Laravel
php artisan serve

# Server akan berjalan di http://localhost:8000
```

## 6. Fitur Berdasarkan Role

### Customer Dashboard
- Lihat statistik order pribadi
- Browse games dan paket top-up
- History pemesanan
- Upload bukti pembayaran

### Admin Dashboard  
- Statistik penjualan dan revenue
- Kelola semua order dan update status
- CRUD games, products, payment methods
- Lihat data customers
- Activity logs

## 7. Troubleshooting

### Error "Route not found"
- Pastikan server Laravel sudah running
- Cek apakah routes sudah terdaftar dengan `php artisan route:list`

### Error "Unauthenticated"
- Pastikan sudah login dan token valid
- Untuk API, pastikan header Authorization sudah benar

### Error "Unauthorized" (403)
- User tidak memiliki permission untuk akses route admin
- Pastikan user memiliki role 'admin' untuk akses admin routes

### Database Error
- Jalankan migrasi: `php artisan migrate:fresh --seed`
- Pastikan database connection di `.env` sudah benar